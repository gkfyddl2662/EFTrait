import React from 'react';
import { GroupedMatchResult } from '../types';

interface ResultCardProps {
  result: GroupedMatchResult;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const isPerfect = result.matchCount === 3;
  
  const getBadge = () => {
    if (result.matchCount === 3) {
      return (
        <span className="shrink-0 bg-blue-500 text-white text-[12px] font-bold px-2.5 py-1 rounded-full shadow-sm shadow-blue-200">
          완벽 일치
        </span>
      );
    }
    if (result.matchCount === 2) {
      return (
        <span className="shrink-0 bg-gray-100 text-[#6B7684] text-[12px] font-bold px-2.5 py-1 rounded-full">
          2/3 일치
        </span>
      );
    }
    return (
      <span className="shrink-0 bg-gray-50 text-[#8B95A1] text-[12px] font-bold px-2.5 py-1 rounded-full border border-gray-100">
        1/3 일치
      </span>
    );
  };

  return (
    <div className={`
      relative overflow-hidden rounded-[24px] p-5 mb-4 transition-all duration-300
      ${isPerfect ? 'bg-white shadow-lg ring-1 ring-blue-100' : 'bg-white shadow-sm opacity-90'}
    `}>
      {/* Header with Zones and Badge */}
      <div className="flex justify-between items-start mb-3 gap-2">
        <div className="flex flex-wrap gap-1.5">
          {result.zones.map((zone) => (
            <span 
              key={zone} 
              className="text-[13px] font-medium text-[#8B95A1] bg-gray-50 px-2 py-1 rounded-md"
            >
              {zone}
            </span>
          ))}
        </div>
        {getBadge()}
      </div>

      {/* Weapons List */}
      <div className="mb-4">
        {result.weapons.map((weapon, idx) => (
          <div key={idx} className="text-[19px] font-bold text-[#191F28] leading-tight mb-1">
            {weapon}
          </div>
        ))}
      </div>

      {/* Tags Display */}
      <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
        <Tag label={result.op1} matched={result.matchedOptions[0]} />
        <Tag label={result.op2} matched={result.matchedOptions[1]} />
        <Tag label={result.op3} matched={result.matchedOptions[2]} />
      </div>
    </div>
  );
};

const Tag: React.FC<{ label: string; matched: boolean }> = ({ label, matched }) => (
  <span className={`
    text-[13px] px-2 py-1 rounded-md font-medium
    ${matched 
      ? 'bg-blue-50 text-blue-600' 
      : 'bg-gray-50 text-gray-400 line-through decoration-gray-300'
    }
  `}>
    {label}
  </span>
);