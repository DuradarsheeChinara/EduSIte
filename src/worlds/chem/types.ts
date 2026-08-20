export type ReactionType = 'combination' | 'decomposition' | 'displacement' | 'double-displacement';

export type StationPhase = 'locked' | 'active' | 'complete';

export interface StationState {
  phase: StationPhase;
}

export type StationMap = Record<ReactionType, StationState>;

export const REACTION_ORDER: ReactionType[] = [
  'combination',
  'decomposition',
  'displacement',
  'double-displacement',
];

export const STATION_META: Record<
  ReactionType,
  {
    label: string;
    shortLabel: string;
    accent: string;
    accentBg: string;
    accentBorder: string;
    accentText: string;
    accentRing: string;
    iconHint: string;
  }
> = {
  combination: {
    label: 'Combination Station',
    shortLabel: 'Combination',
    accent: 'saffron',
    accentBg: 'bg-saffron-50',
    accentBorder: 'border-saffron-400',
    accentText: 'text-saffron-700',
    accentRing: 'ring-saffron-300',
    iconHint: 'two substances merging',
  },
  decomposition: {
    label: 'Decomposition Station',
    shortLabel: 'Decomposition',
    accent: 'terracotta',
    accentBg: 'bg-terracotta-50',
    accentBorder: 'border-terracotta-400',
    accentText: 'text-terracotta-700',
    accentRing: 'ring-terracotta-300',
    iconHint: 'one substance splitting',
  },
  displacement: {
    label: 'Displacement Station',
    shortLabel: 'Displacement',
    accent: 'indigo',
    accentBg: 'bg-indigo-50',
    accentBorder: 'border-indigo-400',
    accentText: 'text-indigo-700',
    accentRing: 'ring-indigo-300',
    iconHint: 'one element replacing another',
  },
  'double-displacement': {
    label: 'Double Displacement Station',
    shortLabel: 'Double Displacement',
    accent: 'teal',
    accentBg: 'bg-teal-50',
    accentBorder: 'border-teal-400',
    accentText: 'text-teal-700',
    accentRing: 'ring-teal-300',
    iconHint: 'two compounds exchanging partners',
  },
};

export const HINTS: Record<ReactionType, string> = {
  combination: 'Look at how many products are formed — when two become one, that is combination.',
  decomposition: 'What happens when one compound breaks apart into simpler pieces?',
  displacement: 'One element is taking another element\u2019s place in the compound.',
  'double-displacement': 'Watch what happens to the partners in the two compounds — they swap.',
};

export const MASCOT_EXPLANATIONS: Record<ReactionType, string> = {
  combination: 'Two substances combine to form one product. That\u2019s a combination reaction.',
  decomposition: 'One compound has broken into simpler substances. That\u2019s decomposition.',
  displacement: 'Iron replaces copper in the compound. That\u2019s a displacement reaction.',
  'double-displacement': 'Two compounds exchange partners. That\u2019s a double displacement reaction.',
};

export const MASCOT_INTRO =
  'The reaction stations are scrambled! Help me restore them and bring the laboratory back online.';
