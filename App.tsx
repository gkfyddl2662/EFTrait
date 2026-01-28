import React, { useState, useMemo } from 'react';
import { WEAPON_DATA, OPTIONS_1, OPTIONS_2, OPTIONS_3 } from './constants';
import { MatchResult, GroupedMatchResult } from './types';
import { OptionGroup } from './components/OptionGroup';
import { ResultCard } from './components/ResultCard';

// SVG Icons
const SearchIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4 mx-auto">
    <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="#B0B8C1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const EmptyIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4 mx-auto">
    <circle cx="12" cy="12" r="9" stroke="#B0B8C1" strokeWidth="2"/>
    <path d="M8 12L12 16L16 8" stroke="#B0B8C1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7.75 12L10.58 14.83L16.25 9.17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronUpIcon = ({ className }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Collapsible Section Component
interface CollapsibleSectionProps {
  title: string;
  count: number;
  children: React.ReactNode;
  icon: React.ReactNode;
  defaultOpen: boolean;
  colorClass: string;
  badgeClass: string;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ 
  title, 
  count, 
  children, 
  icon, 
  defaultOpen,
  badgeClass 
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Sync state if defaultOpen changes significantly (optional, but keeping simple manual toggle is usually better UX)
  // Here we use a key in parent to reset state when logic changes, or just rely on manual toggle.
  // We will rely on the parent rendering different instances or just keeping manual control.
  // Actually, to strictly follow "folded when higher match exists", we can use an effect or just respect defaultOpen on mount.
  // Let's rely on the user manually toggling after initial render.
  
  // However, if the user changes filter and a higher match appears, we want this to auto-close?
  // It's tricky with simple state. Let's start with manual toggling respecting the initial prop.
  // To force reset when categories change, we can use a key prop on this component in the parent.

  return (
    <div className="mb-6">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-1 py-3 mb-2 group select-none"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-[19px] font-bold text-[#191F28]">{title}</span>
          <span className={`${badgeClass} text-[12px] px-2 py-0.5 rounded-full font-bold ml-1`}>
            {count}
          </span>
        </div>
        <div className="text-[#8B95A1] group-hover:text-[#333D4B] transition-colors">
          {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </div>
      </button>
      
      {isOpen && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  // Change state to arrays for multiple selection
  const [selectedOp1, setSelectedOp1] = useState<string[]>([]);
  const [selectedOp2, setSelectedOp2] = useState<string[]>([]);
  const [selectedOp3, setSelectedOp3] = useState<string[]>([]);

  const handleReset = () => {
    setSelectedOp1([]);
    setSelectedOp2([]);
    setSelectedOp3([]);
  };

  const toggleOption = (current: string[], option: string) => {
    return current.includes(option) 
      ? current.filter(item => item !== option)
      : [...current, option];
  };

  const results = useMemo(() => {
    // Only start calculating if at least one option is selected in any category
    if (selectedOp1.length === 0 && selectedOp2.length === 0 && selectedOp3.length === 0) return [];

    // 1. Calculate matches for all entries
    const computed: MatchResult[] = WEAPON_DATA.map((entry) => {
      // Check if entry's option is in the selected list
      const match1 = selectedOp1.includes(entry.op1);
      const match2 = selectedOp2.includes(entry.op2);
      const match3 = selectedOp3.includes(entry.op3);
      
      const count = (match1 ? 1 : 0) + (match2 ? 1 : 0) + (match3 ? 1 : 0);
      
      return {
        ...entry,
        matchCount: count,
        matchedOptions: [match1, match2, match3]
      };
    });

    // 2. Filter for at least 1 match
    const filtered = computed.filter((r) => r.matchCount >= 1);

    // 3. Group by weapons
    const groupedMap = new Map<string, GroupedMatchResult>();

    filtered.forEach((item) => {
      const key = item.weapons.join(',');
      
      if (groupedMap.has(key)) {
        const existing = groupedMap.get(key)!;
        if (!existing.zones.includes(item.zone)) {
          existing.zones.push(item.zone);
        }
        // IMPORTANT: When grouping, we need to handle potential conflicts in matchedOptions if traits differ by zone (rare but possible).
        // For Endfield weapon logic, traits are fixed per weapon usually, but here traits are per zone entry.
        // We will assume the match status comes from the entry that caused the inclusion.
        // If multiple entries match, we take the one with higher match count? 
        // Our grouping key is just weapon name.
        // Let's simple keep the first one encountered or update if we find a "better" match for same weapon?
        // Current logic: simple append zone.
        // Refinement: If the same weapon appears in another zone with *different* traits (unlikely in this data) it might be an issue.
        // But in this dataset, a weapon like "용사" appears in multiple zones with SAME traits. So matchedOptions are identical.
      } else {
        const { zone, ...rest } = item; 
        groupedMap.set(key, {
          ...rest,
          zones: [zone]
        });
      }
    });

    // 4. Convert map to array and sort
    const groupedResults = Array.from(groupedMap.values());

    return groupedResults.sort((a, b) => {
      if (b.matchCount !== a.matchCount) return b.matchCount - a.matchCount;
      return a.zones[0].localeCompare(b.zones[0]);
    });
  }, [selectedOp1, selectedOp2, selectedOp3]);

  // Separate results
  const perfectMatches = results.filter(r => r.matchCount === 3);
  const highMatches = results.filter(r => r.matchCount === 2);
  const partialMatches = results.filter(r => r.matchCount === 1);

  // Logic for default openness
  // If Perfect > 0, others closed.
  // If Perfect == 0 and High > 0, Partial closed.
  // Otherwise Open.
  // We use the `key` prop on CollapsibleSection to force re-initialization of the internal state when these conditions change.
  const showHighDefault = perfectMatches.length === 0;
  const showPartialDefault = perfectMatches.length === 0 && highMatches.length === 0;

  return (
    <div className="min-h-screen pb-20 max-w-[600px] mx-auto bg-[#F2F4F6] relative">
      
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#F2F4F6]/90 backdrop-blur-md px-6 py-5 flex justify-between items-center border-b border-gray-200/50">
        <h1 className="text-[22px] font-bold text-[#191F28]">
          엔드필드 기질 분석
        </h1>
        <button 
          onClick={handleReset}
          className="text-[14px] font-medium text-[#8B95A1] hover:text-[#3182F6] transition-colors"
        >
          초기화
        </button>
      </header>

      {/* Input Section */}
      <div className="px-5 py-6 space-y-2">
        <div className="bg-white rounded-[24px] p-6 shadow-sm mb-6">
          <OptionGroup 
            title="옵션 1 (기본 속성)" 
            options={OPTIONS_1} 
            selected={selectedOp1} 
            onSelect={(val) => setSelectedOp1(toggleOption(selectedOp1, val))}
            colorClass="bg-[#3182F6]"
          />
          <div className="h-6"></div>
          <OptionGroup 
            title="옵션 2 (효과 타입)" 
            options={OPTIONS_2} 
            selected={selectedOp2} 
            onSelect={(val) => setSelectedOp2(toggleOption(selectedOp2, val))}
            colorClass="bg-[#3182F6]"
          />
          <div className="h-6"></div>
          <OptionGroup 
            title="옵션 3 (특수 기질)" 
            options={OPTIONS_3} 
            selected={selectedOp3} 
            onSelect={(val) => setSelectedOp3(toggleOption(selectedOp3, val))}
            colorClass="bg-[#3182F6]"
          />
        </div>

        {/* Results Section */}
        <div>
          {selectedOp1.length === 0 && selectedOp2.length === 0 && selectedOp3.length === 0 && (
            <div className="text-center py-10 text-[#8B95A1]">
              <SearchIcon />
              <p className="text-[17px] font-medium text-[#333D4B]">위에서 기질을 선택해보세요</p>
              <p className="text-[14px] mt-1">1개 이상 일치하는 무기를 찾아드릴게요</p>
            </div>
          )}

          {(selectedOp1.length > 0 || selectedOp2.length > 0 || selectedOp3.length > 0) && results.length === 0 && (
            <div className="text-center py-10 text-[#8B95A1]">
              <EmptyIcon />
              <p className="text-[17px] font-medium text-[#333D4B]">일치하는 결과가 없어요</p>
              <p className="text-[14px] mt-1">다른 조합을 선택해보세요</p>
            </div>
          )}

          {perfectMatches.length > 0 && (
            <div className="mb-8">
              <h2 className="px-1 text-[19px] font-bold text-[#191F28] mb-4 flex items-center gap-2">
                <CheckCircleIcon className="text-blue-500" />
                <span>완벽히 일치해요</span>
                <span className="bg-blue-100 text-blue-600 text-[12px] px-2 py-0.5 rounded-full font-bold align-middle">
                  {perfectMatches.length}
                </span>
              </h2>
              {perfectMatches.map((result, idx) => (
                <ResultCard key={`p-${idx}`} result={result} />
              ))}
            </div>
          )}

          {highMatches.length > 0 && (
            <CollapsibleSection
              key={`high-${showHighDefault ? 'open' : 'closed'}`}
              title="2개 일치해요"
              count={highMatches.length}
              icon={<CheckCircleIcon className="text-gray-400" />}
              defaultOpen={showHighDefault}
              colorClass="text-[#191F28]"
              badgeClass="bg-gray-200 text-gray-600"
            >
              {highMatches.map((result, idx) => (
                <ResultCard key={`h-${idx}`} result={result} />
              ))}
            </CollapsibleSection>
          )}

          {partialMatches.length > 0 && (
            <CollapsibleSection
              key={`partial-${showPartialDefault ? 'open' : 'closed'}`}
              title="1개 일치해요"
              count={partialMatches.length}
              icon={<CheckCircleIcon className="text-gray-300" />}
              defaultOpen={showPartialDefault}
              colorClass="text-[#191F28]"
              badgeClass="bg-gray-100 text-gray-500"
            >
              {partialMatches.map((result, idx) => (
                <ResultCard key={`part-${idx}`} result={result} />
              ))}
            </CollapsibleSection>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;