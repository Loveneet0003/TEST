import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { clusterApiUrl } from '@solana/web3.js';

const candidates = [
  { id: 1, name: 'Alice', description: 'Experienced in hostel management' },
  { id: 2, name: 'Bob', description: 'Strong leadership skills' },
  { id: 3, name: 'Charlie', description: 'Innovative problem solver' },
  { id: 4, name: 'David', description: 'Excellent communication skills' },
  { id: 5, name: 'Eve', description: 'Community-focused approach' }
];

const VotingInterface = ({ setVotes }) => {
  const { publicKey, sendTransaction } = useWallet();
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [votingStatus, setVotingStatus] = useState('');
  const [error, setError] = useState('');

  const handleVote = async (candidateId) => {
    if (!publicKey) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setVotingStatus('Processing vote...');
      setError('');

      // Create a new transaction
      const connection = new Connection(clusterApiUrl('devnet'));
      const transaction = new Transaction();

      // Add vote instruction (this is a simplified version - in a real app, you'd use a proper program)
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey('YOUR_VOTE_PROGRAM_ID'), // Replace with your actual program ID
          lamports: 1000000 // 0.001 SOL as voting fee
        })
      );

      // Send transaction
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature);

      // Update local vote count
      setVotes(prevVotes => ({
        ...prevVotes,
        [candidates[candidateId - 1].name]: prevVotes[candidates[candidateId - 1].name] + 1
      }));

      setVotingStatus('Vote recorded successfully!');
      setSelectedCandidate(null);
    } catch (err) {
      setError('Failed to record vote. Please try again.');
      console.error('Voting error:', err);
    }
  };

  return (
    <div className="space-y-4">
      {candidates.map((candidate) => (
        <div
          key={candidate.id}
          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
            selectedCandidate === candidate.id
              ? 'border-purple-500 bg-purple-50'
              : 'border-gray-200 hover:border-purple-300'
          }`}
          onClick={() => setSelectedCandidate(candidate.id)}
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">{candidate.name}</h3>
              <p className="text-sm text-gray-600">{candidate.description}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleVote(candidate.id);
              }}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              disabled={!publicKey || votingStatus === 'Processing vote...'}
            >
              Vote
            </button>
          </div>
        </div>
      ))}

      {votingStatus && (
        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-lg">
          {votingStatus}
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default VotingInterface; 