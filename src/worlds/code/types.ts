export type CommandId = 'check' | 'if-dry' | 'open-valve' | 'wait' | 'close-valve';

export interface Command {
  id: CommandId;
  label: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
}

export const COMMANDS: Record<CommandId, Command> = {
  'check': {
    id: 'check',
    label: 'Check Soil Moisture',
    icon: '🔍',
    color: 'indigo',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-400',
    textColor: 'text-indigo-700',
  },
  'if-dry': {
    id: 'if-dry',
    label: 'If Soil is Dry',
    icon: '❓',
    color: 'saffron',
    bgColor: 'bg-saffron-50',
    borderColor: 'border-saffron-400',
    textColor: 'text-saffron-700',
  },
  'open-valve': {
    id: 'open-valve',
    label: 'Open Water Valve',
    icon: '🚰',
    color: 'teal',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-400',
    textColor: 'text-teal-700',
  },
  'wait': {
    id: 'wait',
    label: 'Wait 10 Minutes',
    icon: '⏱',
    color: 'terracotta',
    bgColor: 'bg-terracotta-50',
    borderColor: 'border-terracotta-400',
    textColor: 'text-terracotta-700',
  },
  'close-valve': {
    id: 'close-valve',
    label: 'Close Water Valve',
    icon: '🔒',
    color: 'forest',
    bgColor: 'bg-forest-50',
    borderColor: 'border-forest-400',
    textColor: 'text-forest-700',
  },
};

export const CORRECT_SEQUENCE: CommandId[] = [
  'check',
  'if-dry',
  'open-valve',
  'wait',
  'close-valve',
];

export const SHUFFLED_SEQUENCE: CommandId[] = [
  'open-valve',
  'check',
  'close-valve',
  'if-dry',
  'wait',
];

export const BUGGY_SEQUENCE: CommandId[] = [
  'check',
  'if-dry',
  'open-valve',
  'close-valve',
  'wait',
];

export const MASCOT_INTRO =
  'The village has installed a smart irrigation system, but the controller is broken! Help me rebuild the algorithm so the system can water the crops automatically.';

export const MASCOT_TEXTS: Record<string, string> = {
  build: 'Arrange the command blocks in the correct order. Think about what should happen first!',
  run: 'The program is running! Watch the irrigation system water the plants.',
  ifelse: 'Now let us test the IF/ELSE logic. The sensor reads moisture — should the pump turn on?',
  debug: 'Something is wrong with this program! The crops are still dry. Can you find the bug?',
  done: 'The irrigation system is thinking for us! The smart farm is fully operational!',
};
