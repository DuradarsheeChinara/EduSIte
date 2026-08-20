export const HARVEST_VALUES = [10, 20, 20, 30, 40];
export const SORTED_VALUES = [...HARVEST_VALUES].sort((a, b) => a - b);
export const TOTAL_HARVEST = 120;
export const FIELD_COUNT = 5;
export const MEAN_VALUE = 24;
export const MEDIAN_VALUE = 20;
export const MODE_VALUE = 20;

export const PROBABILITY_BAG = [
  { color: 'red' as const, count: 3, label: 'Water Available' },
  { color: 'blue' as const, count: 2, label: 'No Water' },
];

export const SEASONS = [
  { id: 'winter', label: 'Winter', rainfall: 20, color: 'bg-blue-300', crop: 'wheat' },
  { id: 'summer', label: 'Summer', rainfall: 10, color: 'bg-saffron-300', crop: 'vegetables' },
  { id: 'monsoon', label: 'Monsoon', rainfall: 80, color: 'bg-indigo-500', crop: 'rice' },
  { id: 'autumn', label: 'Autumn', rainfall: 40, color: 'bg-terracotta-300', crop: 'fruit' },
];

export const MASCOT_INTRO =
  'The village harvest is in! Five fields produced different amounts of grain. Help me analyse the data so we can plan for next season!';
