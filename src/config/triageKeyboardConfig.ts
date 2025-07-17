// Configurable keyboard bindings for triage mode
// This makes it easy to change keyboard shortcuts without modifying core logic

export type ModifierKey = 'cmd' | 'ctrl' | 'shift' | 'alt';
export type TriageAction = 
  | 'APPLY_AND_NEXT' 
  | 'SKIP_TO_NEXT' 
  | 'APPLY_AND_PREV' 
  | 'QUIT' 
  | 'NEXT' 
  | 'PREVIOUS'
  | 'TOGGLE_LIST';

export interface KeyBinding {
  key: string;
  modifiers?: ModifierKey[];
  description: string;
  action: TriageAction;
}

export interface ListKeyBinding {
  key: string;
  listIndex: number;
  description?: string;
}

export interface TriageKeyboardConfig {
  // Core actions
  APPLY_AND_NEXT: KeyBinding;
  SKIP_TO_NEXT: KeyBinding;
  APPLY_AND_PREV: KeyBinding;
  QUIT: KeyBinding;
  
  // Navigation
  NEXT?: KeyBinding;
  PREVIOUS?: KeyBinding;
  
  // List selection keys
  LIST_KEYS: ListKeyBinding[];
}

// Default configuration using number keys
export const DEFAULT_TRIAGE_KEYS: TriageKeyboardConfig = {
  // Core navigation
  APPLY_AND_NEXT: { 
    key: 'Enter', 
    modifiers: ['cmd'] as ModifierKey[], 
    description: 'Apply & next',
    action: 'APPLY_AND_NEXT'
  },
  SKIP_TO_NEXT: { 
    key: 'Escape', 
    description: 'Skip to next',
    action: 'SKIP_TO_NEXT'
  },
  APPLY_AND_PREV: { 
    key: 'Enter', 
    modifiers: ['cmd', 'shift'] as ModifierKey[], 
    description: 'Apply & previous',
    action: 'APPLY_AND_PREV'
  },
  QUIT: { 
    key: 'q', 
    description: 'Quit triage',
    action: 'QUIT'
  },
  
  // Alternative navigation
  NEXT: { 
    key: 'j', 
    description: 'Next bookmark',
    action: 'NEXT'
  },
  PREVIOUS: { 
    key: 'k', 
    description: 'Previous bookmark',
    action: 'PREVIOUS'
  },
  
  // List selection - number keys
  LIST_KEYS: [
    { key: '1', listIndex: 0 },
    { key: '2', listIndex: 1 },
    { key: '3', listIndex: 2 },
    { key: '4', listIndex: 3 },
    { key: '5', listIndex: 4 },
    { key: '6', listIndex: 5 },
    { key: '7', listIndex: 6 },
    { key: '8', listIndex: 7 },
    { key: '9', listIndex: 8 },
  ]
};

// Alternative keyboard layouts
export const KEYBOARD_LAYOUTS = {
  // Default number keys
  NUMBERS: DEFAULT_TRIAGE_KEYS,
  
  // Home row keys for lists (a-l)
  HOME_ROW: {
    ...DEFAULT_TRIAGE_KEYS,
    LIST_KEYS: [
      { key: 'a', listIndex: 0, description: 'First list' },
      { key: 's', listIndex: 1 },
      { key: 'd', listIndex: 2 },
      { key: 'f', listIndex: 3 },
      { key: 'g', listIndex: 4 },
      { key: 'h', listIndex: 5 },
      { key: 'j', listIndex: 6 },
      { key: 'k', listIndex: 7 },
      { key: 'l', listIndex: 8, description: 'Ninth list' },
    ],
    // Move navigation keys since j/k conflict
    NEXT: { key: 'n', description: 'Next bookmark', action: 'NEXT' as TriageAction },
    PREVIOUS: { key: 'p', description: 'Previous bookmark', action: 'PREVIOUS' as TriageAction },
  },
  
  // QWERTY top row
  QWERTY: {
    ...DEFAULT_TRIAGE_KEYS,
    LIST_KEYS: [
      { key: 'q', listIndex: 0 },
      { key: 'w', listIndex: 1 },
      { key: 'e', listIndex: 2 },
      { key: 'r', listIndex: 3 },
      { key: 't', listIndex: 4 },
      { key: 'y', listIndex: 5 },
      { key: 'u', listIndex: 6 },
      { key: 'i', listIndex: 7 },
      { key: 'o', listIndex: 8 },
    ],
    // Change quit key since 'q' is used for lists
    QUIT: { key: 'x', description: 'Exit triage', action: 'QUIT' as TriageAction },
  },
  
  // Minimal arrow keys mode
  MINIMAL: {
    APPLY_AND_NEXT: { 
      key: 'Enter', 
      description: 'Apply & next',
      action: 'APPLY_AND_NEXT' as TriageAction
    },
    SKIP_TO_NEXT: { 
      key: 'ArrowRight', 
      description: 'Skip to next',
      action: 'SKIP_TO_NEXT' as TriageAction
    },
    APPLY_AND_PREV: { 
      key: 'Enter', 
      modifiers: ['shift'] as ModifierKey[], 
      description: 'Apply & previous',
      action: 'APPLY_AND_PREV' as TriageAction
    },
    QUIT: { 
      key: 'Escape', 
      description: 'Quit triage',
      action: 'QUIT' as TriageAction
    },
    NEXT: { 
      key: 'ArrowDown', 
      description: 'Next bookmark',
      action: 'NEXT' as TriageAction
    },
    PREVIOUS: { 
      key: 'ArrowUp', 
      description: 'Previous bookmark',
      action: 'PREVIOUS' as TriageAction
    },
    // Space + number for lists
    LIST_KEYS: Array.from({ length: 9 }, (_, i) => ({
      key: `${i + 1}`,
      listIndex: i,
      description: `List ${i + 1} (with Space)`
    }))
  }
};

// Helper function to check if a keyboard event matches a binding
export function matchesBinding(event: KeyboardEvent, binding: KeyBinding): boolean {
  // Check key
  if (event.key !== binding.key) return false;
  
  // Check modifiers
  const modifiers = binding.modifiers || [];
  const hasCmd = modifiers.includes('cmd') || modifiers.includes('ctrl');
  const hasShift = modifiers.includes('shift');
  const hasAlt = modifiers.includes('alt');
  
  // For cross-platform support
  const cmdOrCtrl = event.metaKey || event.ctrlKey;
  
  return (
    (!hasCmd || cmdOrCtrl) &&
    (!hasShift || event.shiftKey) &&
    (!hasAlt || event.altKey) &&
    // Make sure no extra modifiers are pressed
    (hasCmd === cmdOrCtrl) &&
    (hasShift === event.shiftKey) &&
    (hasAlt === event.altKey)
  );
}

// Helper to format key combo for display
export function formatKeyCombo(binding: KeyBinding): string {
  const parts: string[] = [];
  
  if (binding.modifiers) {
    if (binding.modifiers.includes('cmd') || binding.modifiers.includes('ctrl')) {
      parts.push('⌘');
    }
    if (binding.modifiers.includes('shift')) {
      parts.push('⇧');
    }
    if (binding.modifiers.includes('alt')) {
      parts.push('⌥');
    }
  }
  
  // Special key formatting
  const keyDisplay = binding.key === 'Enter' ? '↩' :
                    binding.key === 'Escape' ? 'esc' :
                    binding.key === 'ArrowUp' ? '↑' :
                    binding.key === 'ArrowDown' ? '↓' :
                    binding.key === 'ArrowLeft' ? '←' :
                    binding.key === 'ArrowRight' ? '→' :
                    binding.key;
  
  parts.push(keyDisplay);
  
  return parts.join('');
}

// Get keyboard layout from localStorage or default
export function getKeyboardLayout(): TriageKeyboardConfig {
  const savedLayout = localStorage.getItem('triageKeyboardLayout');
  if (savedLayout && savedLayout in KEYBOARD_LAYOUTS) {
    return KEYBOARD_LAYOUTS[savedLayout as keyof typeof KEYBOARD_LAYOUTS];
  }
  return DEFAULT_TRIAGE_KEYS;
}

// Save keyboard layout preference
export function setKeyboardLayout(layout: keyof typeof KEYBOARD_LAYOUTS): void {
  localStorage.setItem('triageKeyboardLayout', layout);
}