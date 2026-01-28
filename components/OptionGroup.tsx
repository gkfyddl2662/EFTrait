import React from 'react';

interface OptionGroupProps {
  title: string;
  options: string[];
  selected: string[];
  onSelect: (option: string) => void;
  colorClass: string;
}

export const OptionGroup: React.FC<OptionGroupProps> = ({ 
  title, 
  options, 
  selected, 
  onSelect,
  colorClass
}) => {
  return (
    <div className="mb-8 last:mb-0">
      <div className="flex justify-between items-end mb-3 px-1">
        <h3 className="text-[17px] font-bold text-[#333D4B]">
          {title}
        </h3>
        {selected.length > 0 && (
          <span className="text-[13px] font-medium text-[#8B95A1]">
            {selected.length}개 선택됨
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected.includes(option);
          return (
            <button
              key={option}
              onClick={() => onSelect(option)}
              className={`
                px-4 py-2.5 rounded-[18px] text-[15px] font-medium transition-all duration-200 ease-in-out border
                ${isSelected 
                  ? `${colorClass} text-white border-transparent shadow-md transform scale-[1.02]` 
                  : 'bg-white text-[#4E5968] border-gray-200 hover:bg-gray-50 active:scale-95'
                }
              `}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
};