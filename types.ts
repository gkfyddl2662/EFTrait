export interface TraitData {
  zone: string;
  op1: string;
  op2: string;
  op3: string;
  weapons: string[];
}

export interface MatchResult extends TraitData {
  matchCount: number;
  matchedOptions: boolean[]; // [op1 matched, op2 matched, op3 matched]
}

export interface GroupedMatchResult extends Omit<MatchResult, 'zone'> {
  zones: string[];
}
