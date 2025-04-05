const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection (replace with your MongoDB connection string)
const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/election";
mongoose.connect(uri, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s
});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
});

// Define Vote Schema
const voteSchema = new mongoose.Schema({
    candidateId: { type: Number, required: true },
    voterEmail: { type: String, required: true, unique: true },
});

const Vote = mongoose.model('Vote', voteSchema);

// Define Candidate Schema
const candidateSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    voteCount: { type: Number, default: 0 }
});

const Candidate = mongoose.model('Candidate', candidateSchema);

// Initialize candidates if they don't exist
async function initializeCandidates() {
    const defaultCandidates = [
        { id: 1, name: "ARVIND MEEENA", voteCount: 0 },
        { id: 2, name: "RUDRA PRATAP", voteCount: 0 },
        { id: 3, name: "IVAN SHARMA", voteCount: 0 }
    ];

    try {
        // First, check if candidates exist
        const existingCandidates = await Candidate.find({});
        console.log('Existing candidates:', existingCandidates);
        
        if (existingCandidates.length === 0) {
            console.log('No candidates found, creating new ones...');
            // If no candidates exist, create them
            for (const candidate of defaultCandidates) {
                const newCandidate = await Candidate.create(candidate);
                console.log('Created candidate:', newCandidate);
            }
            console.log('Candidates initialized successfully');
        } else {
            // Verify all required candidates exist
            const existingIds = existingCandidates.map(c => c.id);
            const missingCandidates = defaultCandidates.filter(c => !existingIds.includes(c.id));
            
            if (missingCandidates.length > 0) {
                console.log('Some candidates are missing, adding them...');
                for (const candidate of missingCandidates) {
                    const newCandidate = await Candidate.create(candidate);
                    console.log('Added missing candidate:', newCandidate);
                }
            }
            
            // Update names in case they were changed
            for (const defaultCandidate of defaultCandidates) {
                await Candidate.findOneAndUpdate(
                    { id: defaultCandidate.id },
                    { $set: { name: defaultCandidate.name } },
                    { new: true }
                );
            }
            
            console.log('Candidates verified and updated');
        }
    } catch (error) {
        console.error('Error initializing candidates:', error);
    }
}

// Call initializeCandidates when the server starts and after MongoDB connects
connection.once('open', async () => {
    console.log("MongoDB database connection established successfully");
    await initializeCandidates();
    console.log('Initial candidate setup completed');
});

// Add a route to check initialization status
app.get('/api/check-init', async (req, res) => {
    try {
        const candidates = await Candidate.find({});
        console.log('Checking initialization status. Found candidates:', candidates);
        res.json({
            initialized: candidates.length > 0,
            candidates: candidates
        });
    } catch (error) {
        console.error('Error checking initialization:', error);
        res.status(500).json({ message: error.message });
    }
});

// Routes
app.get('/api/candidates', async (req, res) => {
    try {
        const candidates = await Candidate.find({});
        console.log('Fetching candidates:', candidates);
        res.json(candidates);
    } catch (error) {
        console.error('Error fetching candidates:', error);
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/vote', async (req, res) => {
    const { candidateId, voterEmail } = req.body;
    console.log('Received vote request:', { candidateId, voterEmail });

    try {
        // Check if user has already voted
        const existingVote = await Vote.findOne({ voterEmail });
        if (existingVote) {
            console.log('User has already voted:', voterEmail);
            return res.status(400).json({ message: 'You have already cast your vote!' });
        }

        // Create new vote
        const vote = new Vote({ candidateId, voterEmail });
        await vote.save();
        console.log('Vote saved:', vote);

        // Update candidate vote count
        const updatedCandidate = await Candidate.findOneAndUpdate(
            { id: candidateId },
            { $inc: { voteCount: 1 } },
            { new: true }
        );
        console.log('Updated candidate:', updatedCandidate);

        res.json({ message: 'Vote cast successfully!' });
    } catch (error) {
        console.error('Error processing vote:', error);
        res.status(500).json({ message: error.message });
    }
});

// Add a route to reset candidates (for testing)
app.post('/api/reset-candidates', async (req, res) => {
    try {
        await Candidate.deleteMany({});
        await initializeCandidates();
        res.json({ message: 'Candidates reset successfully' });
    } catch (error) {
        console.error('Error resetting candidates:', error);
        res.status(500).json({ message: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
}); 
