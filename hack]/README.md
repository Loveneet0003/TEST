# Hostel Secretary Voting Website

A decentralized voting platform for hostel secretary elections using Solana blockchain.

## Features

- Clean and responsive user interface
- Secure voting mechanism using Solana blockchain
- Real-time vote counting
- One vote per wallet policy
- Mobile-friendly design

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Solana wallet (Phantom, Solflare, etc.)

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Smart Contract

The voting smart contract is deployed on the Solana devnet. The contract handles:
- Vote recording
- Vote counting
- Prevention of double voting

## Security

- Each wallet can only vote once
- All votes are recorded on the Solana blockchain
- Transparent and immutable voting records

## Technologies Used

- React.js
- Solana Web3.js
- TailwindCSS
- Solana Wallet Adapter

## Contributing

Feel free to submit issues and enhancement requests. 