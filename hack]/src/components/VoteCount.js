import React from 'react';

const VoteCount = ({ votes }) => {
  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-4">
      {Object.entries(votes).map(([candidate, count]) => {
        const percentage = totalVotes > 0 ? (count / totalVotes) * 100 : 0;
        
        return (
          <div key={candidate} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">{candidate}</span>
              <span className="text-gray-600">{count} votes</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-purple-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <div className="text-sm text-gray-500">
              {percentage.toFixed(1)}% of total votes
            </div>
          </div>
        );
      })}
      
      <div className="mt-6 pt-4 border-t">
        <div className="text-lg font-semibold">
          Total Votes: {totalVotes}
        </div>
      </div>
    </div>
  );
};

export default VoteCount; 