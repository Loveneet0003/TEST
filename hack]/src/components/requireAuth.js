import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const requireAuth = (WrappedComponent) => {
  return function WithAuth(props) {
    const { publicKey } = useWallet();

    if (!publicKey) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-6">
            Please connect your Solana wallet to participate in the voting.
          </p>
          <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700" />
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

export default requireAuth; 