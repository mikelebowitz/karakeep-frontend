// Smart keyboard binding generation for lists
// Intelligently assigns keyboard shortcuts based on list names and usage

export interface SmartKeyBinding {
  key: string;
  listId: string;
  listName: string;
  description: string;
  reason: 'first-letter' | 'second-letter' | 'consonant' | 'fallback' | 'number';
  priority: number;
}

export interface ListUsage {
  listId: string;
  count: number;
  lastUsed: Date;
}

/**
 * Find the best available key for a list name
 */
function findBestKey(listName: string, usedKeys: Set<string>): { key: string; reason: SmartKeyBinding['reason'] } | null {
  const name = listName.toLowerCase().replace(/[^a-z]/g, '');
  
  if (name.length === 0) {
    return null;
  }
  
  // Strategy 1: First letter (most intuitive)
  if (!usedKeys.has(name[0])) {
    return { key: name[0], reason: 'first-letter' };
  }
  
  // Strategy 2: Try each subsequent letter
  for (let i = 1; i < name.length; i++) {
    if (!usedKeys.has(name[i])) {
      return { key: name[i], reason: 'second-letter' };
    }
  }
  
  // Strategy 3: Try consonants from the name (usually more distinctive)
  const consonants = name.match(/[bcdfghjklmnpqrstvwxyz]/g) || [];
  for (const consonant of consonants) {
    if (!usedKeys.has(consonant)) {
      return { key: consonant, reason: 'consonant' };
    }
  }
  
  // Strategy 4: Try any remaining letters a-z
  for (let i = 97; i <= 122; i++) { // a-z ASCII
    const letter = String.fromCharCode(i);
    if (!usedKeys.has(letter)) {
      return { key: letter, reason: 'fallback' };
    }
  }
  
  return null; // All letters used (26+ lists)
}

/**
 * Get usage count for a list
 */
function getUsageCount(listId: string, usageStats?: ListUsage[]): number {
  return usageStats?.find(u => u.listId === listId)?.count || 0;
}

/**
 * Generate smart key bindings for a list of lists
 */
export function generateSmartKeyBindings(
  lists: any[], 
  usageStats?: ListUsage[]
): SmartKeyBinding[] {
  console.log(`🧠 Generating smart key bindings for ${lists.length} lists`);
  
  // Sort lists by usage frequency (most used first gets priority)
  const sortedLists = [...lists].sort((a, b) => {
    const usageA = getUsageCount(a.id, usageStats);
    const usageB = getUsageCount(b.id, usageStats);
    
    // If no usage stats, sort alphabetically
    if (usageA === usageB) {
      return a.name.localeCompare(b.name);
    }
    
    return usageB - usageA;
  });
  
  const bindings: SmartKeyBinding[] = [];
  const usedKeys = new Set<string>();
  
  // First pass: assign letters
  for (const list of sortedLists) {
    const keyResult = findBestKey(list.name, usedKeys);
    if (keyResult) {
      bindings.push({
        key: keyResult.key,
        listId: list.id,
        listName: list.name,
        description: formatKeyDescription(list.name, keyResult.key, keyResult.reason),
        reason: keyResult.reason,
        priority: getUsageCount(list.id, usageStats)
      });
      usedKeys.add(keyResult.key);
    }
  }
  
  // Second pass: assign numbers to remaining lists
  const remainingLists = sortedLists.filter(
    list => !bindings.find(b => b.listId === list.id)
  );
  
  for (let i = 0; i < remainingLists.length && i < 9; i++) {
    const numberKey = (i + 1).toString();
    const list = remainingLists[i];
    
    bindings.push({
      key: numberKey,
      listId: list.id,
      listName: list.name,
      description: `${list.name} (${numberKey})`,
      reason: 'number',
      priority: getUsageCount(list.id, usageStats)
    });
  }
  
  console.log(`✅ Generated ${bindings.length} smart key bindings:`, 
    bindings.map(b => `${b.key}=${b.listName}`).join(', ')
  );
  
  return bindings;
}

/**
 * Format key description with reasoning
 */
function formatKeyDescription(listName: string, key: string, reason: SmartKeyBinding['reason']): string {
  switch (reason) {
    case 'first-letter':
      return `${listName} (${key})`;
    case 'second-letter':
      return `${listName} (${key})`;
    case 'consonant':
      return `${listName} (${key})`;
    case 'fallback':
      return `${listName} (${key})`;
    case 'number':
      return `${listName} (${key})`;
    default:
      return `${listName} (${key})`;
  }
}

/**
 * Get reason text for display
 */
export function getReasonText(reason: SmartKeyBinding['reason']): string {
  switch (reason) {
    case 'first-letter':
      return 'first letter';
    case 'second-letter':
      return 'alt letter';
    case 'consonant':
      return 'consonant';
    case 'fallback':
      return 'available';
    case 'number':
      return 'number';
    default:
      return '';
  }
}

/**
 * Save usage statistics to localStorage
 */
export function saveListUsage(listId: string): void {
  const key = 'karakeep-list-usage';
  const existing = localStorage.getItem(key);
  const usage: ListUsage[] = existing ? JSON.parse(existing) : [];
  
  const existingEntry = usage.find(u => u.listId === listId);
  if (existingEntry) {
    existingEntry.count++;
    existingEntry.lastUsed = new Date();
  } else {
    usage.push({
      listId,
      count: 1,
      lastUsed: new Date()
    });
  }
  
  localStorage.setItem(key, JSON.stringify(usage));
}

/**
 * Load usage statistics from localStorage
 */
export function loadListUsage(): ListUsage[] {
  const key = 'karakeep-list-usage';
  const existing = localStorage.getItem(key);
  return existing ? JSON.parse(existing) : [];
}

/**
 * Create keyboard config with smart bindings
 */
export function createSmartKeyboardConfig(lists: any[]): any {
  const usageStats = loadListUsage();
  const smartBindings = generateSmartKeyBindings(lists, usageStats);
  
  return {
    mode: 'smart',
    smartBindings,
    // Convert to the format expected by the existing keyboard system
    LIST_KEYS: smartBindings.map((binding, index) => ({
      key: binding.key,
      listIndex: index,
      description: binding.description
    }))
  };
}