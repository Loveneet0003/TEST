# College Hostel Election Backend

This is the backend server for the College Hostel Election System. It provides APIs for candidate management, voting, and result tracking.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm (Node Package Manager)

## Setup Instructions

1. Clone the repository:
```bash
git clone <your-repository-url>
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following content:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/election
```

4. Start MongoDB service:
- Windows: MongoDB should run as a service automatically
- Linux/Mac: `sudo service mongod start`

5. Start the server:
```bash
npm start
```

The server will run on http://localhost:5000

## API Endpoints

- `GET /api/candidates` - Get all candidates
- `POST /api/vote` - Cast a vote
- `GET /api/check-init` - Check initialization status
- `POST /api/reset-candidates` - Reset candidates (for testing)

## Environment Variables

- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string

## Development

To run the server in development mode with auto-reload:
```bash
npm run dev
```

## Testing

To run tests:
```bash
npm test
``` 