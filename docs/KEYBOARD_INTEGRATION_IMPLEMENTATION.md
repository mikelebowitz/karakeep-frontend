# Keyboard Integration Implementation Guide

## Table of Contents
1. [Overview](#overview)
2. [Component Mapping](#component-mapping)
3. [Keyboard Handler Implementation](#keyboard-handler-implementation)
4. [Modal Enhancements](#modal-enhancements)
5. [Selection System](#selection-system)
6. [Step-by-Step Integration](#step-by-step-integration)

## Overview

This guide provides detailed implementation code for integrating our keyboard command system into the main Karakeep NextJS application.

## Component Mapping

### UI Component Equivalents

| Our Component (DaisyUI) | Main App (shadcn/ui) | Notes |
|------------------------|---------------------|-------|
| `<div className="modal">` | `<Dialog>` | Direct replacement |
| `<div className="btn">` | `<Button>` | Similar API |
| `<div className="badge">` | `<Badge>` | Direct replacement |
| `<input className="input">` | `<Input>` | Direct replacement |
| `<div className="toast">` | `<Toast>` | Use their toast system |

### Data Provider Mapping

```typescript
// Our Refine data provider
const { data } = useList({
  resource: "bookmarks",
  filters: [{ field: "list_id", value: "inbox" }]
});

// Their NextJS pattern (likely)
const { data } = useQuery({
  queryKey: ['bookmarks', { listId: 'inbox' }],
  queryFn: () => fetchBookmarks({ listId: 'inbox' })
});
```

## Keyboard Handler Implementation

### 1. Core Keyboard Hook

Create a new file: `apps/web/hooks/useBookmarkKeyboardShortcuts.ts`

```typescript
import { useCallback, useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { toast } from '@/components/ui/use-toast';

interface UseBookmarkKeyboardShortcutsProps {
  selectedBookmarks: Set<string>;
  onOpenTagModal: () => void;
  onOpenListModal: () => void;
  onArchiveBookmarks: (ids: string[]) => Promise<void>;
  onDeleteBookmarks: (ids: string[]) => Promise<void>;
  onSelectAll: () => void;
}

export function useBookmarkKeyboardShortcuts({
  selectedBookmarks,
  onOpenTagModal,
  onOpenListModal,
  onArchiveBookmarks,
  onDeleteBookmarks,
  onSelectAll,
}: UseBookmarkKeyboardShortcutsProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  // Tag assignment (T key)
  useHotkeys('t', (e) => {
    e.preventDefault();
    if (selectedBookmarks.size === 0) {
      toast({
        title: "No bookmarks selected",
        description: "Select bookmarks to assign tags",
        variant: "destructive",
      });
      return;
    }
    onOpenTagModal();
  }, {
    enabled: !isProcessing,
    enableOnFormTags: false,
  });

  // List assignment (L key)
  useHotkeys('l', (e) => {
    e.preventDefault();
    if (selectedBookmarks.size === 0) {
      toast({
        title: "No bookmarks selected",
        description: "Select bookmarks to assign to lists",
        variant: "destructive",
      });
      return;
    }
    onOpenListModal();
  }, {
    enabled: !isProcessing,
    enableOnFormTags: false,
  });

  // Archive (A key)
  useHotkeys('a', async (e) => {
    e.preventDefault();
    if (selectedBookmarks.size === 0) {
      toast({
        title: "No bookmarks selected",
        description: "Select bookmarks to archive",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    try {
      await onArchiveBookmarks(Array.from(selectedBookmarks));
      toast({
        title: "Bookmarks archived",
        description: `${selectedBookmarks.size} bookmark(s) archived successfully`,
      });
    } catch (error) {
      toast({
        title: "Archive failed",
        description: "Failed to archive bookmarks",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, {
    enabled: !isProcessing,
    enableOnFormTags: false,
  });

  // Delete (Delete key)
  useHotkeys('delete', async (e) => {
    e.preventDefault();
    if (selectedBookmarks.size === 0) {
      toast({
        title: "No bookmarks selected",
        description: "Select bookmarks to delete",
        variant: "destructive",
      });
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedBookmarks.size} bookmark(s)?`
    );
    
    if (!confirmed) return;

    setIsProcessing(true);
    try {
      await onDeleteBookmarks(Array.from(selectedBookmarks));
      toast({
        title: "Bookmarks deleted",
        description: `${selectedBookmarks.size} bookmark(s) deleted successfully`,
      });
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Failed to delete bookmarks",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, {
    enabled: !isProcessing,
    enableOnFormTags: false,
  });

  // Select all (Cmd/Ctrl+Shift+A)
  useHotkeys('cmd+shift+a, ctrl+shift+a', (e) => {
    e.preventDefault();
    onSelectAll();
  }, {
    enabled: !isProcessing,
    enableOnFormTags: false,
  });

  return { isProcessing };
}
```

### 2. Integration with Command Palette

Enhance their existing command component:

```typescript
// apps/web/components/ui/command-enhanced.tsx
import { Command } from 'cmdk';
import { useBookmarkKeyboardShortcuts } from '@/hooks/useBookmarkKeyboardShortcuts';

export function CommandEnhanced({ children, ...props }) {
  return (
    <Command {...props}>
      <Command.List>
        <Command.Group heading="Bookmark Actions">
          <Command.Item onSelect={() => handleTagAssignment()}>
            <span>Assign Tags</span>
            <CommandShortcut>T</CommandShortcut>
          </Command.Item>
          <Command.Item onSelect={() => handleListAssignment()}>
            <span>Assign to Lists</span>
            <CommandShortcut>L</CommandShortcut>
          </Command.Item>
          <Command.Item onSelect={() => handleArchive()}>
            <span>Archive Selected</span>
            <CommandShortcut>A</CommandShortcut>
          </Command.Item>
          <Command.Item onSelect={() => handleDelete()}>
            <span>Delete Selected</span>
            <CommandShortcut>Del</CommandShortcut>
          </Command.Item>
        </Command.Group>
        {children}
      </Command.List>
    </Command>
  );
}
```

## Modal Enhancements

### 1. Enhanced Bulk Tag Modal

```typescript
// apps/web/components/dashboard/bookmarks/BulkTagModalEnhanced.tsx
import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Command, CommandInput, CommandList, CommandItem } from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useQuery, useMutation } from '@tanstack/react-query';

interface BulkTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBookmarkIds: string[];
  onSuccess?: () => void;
}

export function BulkTagModalEnhanced({
  isOpen,
  onClose,
  selectedBookmarkIds,
  onSuccess,
}: BulkTagModalProps) {
  const [search, setSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [progress, setProgress] = useState(0);
  const commandInputRef = useRef<HTMLInputElement>(null);

  // Fetch available tags
  const { data: tags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: fetchTags,
  });

  // Bulk tag mutation
  const { mutate: assignTags, isLoading } = useMutation({
    mutationFn: async () => {
      const total = selectedBookmarkIds.length;
      let completed = 0;

      for (const bookmarkId of selectedBookmarkIds) {
        await attachTagsToBookmark(bookmarkId, Array.from(selectedTags));
        completed++;
        setProgress((completed / total) * 100);
      }
    },
    onSuccess: () => {
      onSuccess?.();
      handleClose();
    },
  });

  // Focus search on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => commandInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Keyboard navigation
  useHotkeys('enter', () => {
    if (selectedTags.size > 0 && !isLoading) {
      assignTags();
    }
  }, {
    enabled: isOpen,
    enableOnFormTags: true,
  });

  useHotkeys('escape', () => {
    if (!isLoading) {
      handleClose();
    }
  }, {
    enabled: isOpen,
  });

  const handleClose = () => {
    setSelectedTags(new Set());
    setSearch('');
    setProgress(0);
    onClose();
  };

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Assign Tags to {selectedBookmarkIds.length} Bookmarks
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Selected tags */}
          <div className="flex flex-wrap gap-2 min-h-[32px]">
            {Array.from(selectedTags).map(tagId => {
              const tag = tags.find(t => t.id === tagId);
              return tag ? (
                <Badge
                  key={tagId}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => {
                    const newTags = new Set(selectedTags);
                    newTags.delete(tagId);
                    setSelectedTags(newTags);
                  }}
                >
                  {tag.name} ×
                </Badge>
              ) : null;
            })}
          </div>

          {/* Tag search */}
          <Command>
            <CommandInput
              ref={commandInputRef}
              placeholder="Search tags..."
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              {filteredTags.map(tag => (
                <CommandItem
                  key={tag.id}
                  onSelect={() => {
                    const newTags = new Set(selectedTags);
                    if (newTags.has(tag.id)) {
                      newTags.delete(tag.id);
                    } else {
                      newTags.add(tag.id);
                    }
                    setSelectedTags(newTags);
                  }}
                >
                  <span>{tag.name}</span>
                  {selectedTags.has(tag.id) && <span className="ml-auto">✓</span>}
                </CommandItem>
              ))}
            </CommandList>
          </Command>

          {/* Progress bar */}
          {isLoading && (
            <div className="space-y-2">
              <Progress value={progress} />
              <p className="text-sm text-muted-foreground text-center">
                Processing... {Math.round(progress)}%
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={() => assignTags()}
              disabled={selectedTags.size === 0 || isLoading}
            >
              Apply Tags
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

## Selection System

### 1. Two-Tier Selection Hook

```typescript
// apps/web/hooks/useTwoTierSelection.ts
import { useState, useCallback, useMemo } from 'react';

interface UseTwoTierSelectionProps<T> {
  items: T[];
  getItemId: (item: T) => string;
  totalCount?: number;
}

export function useTwoTierSelection<T>({
  items,
  getItemId,
  totalCount,
}: UseTwoTierSelectionProps<T>) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectAllMatching, setSelectAllMatching] = useState(false);

  const visibleIds = useMemo(
    () => new Set(items.map(getItemId)),
    [items, getItemId]
  );

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
    setSelectAllMatching(false);
  }, []);

  const selectAll = useCallback(() => {
    if (selectAllMatching) {
      // Deselect all
      setSelectedIds(new Set());
      setSelectAllMatching(false);
    } else if (selectedIds.size === visibleIds.size) {
      // All visible selected, select all matching
      setSelectAllMatching(true);
    } else {
      // Select all visible
      setSelectedIds(new Set(visibleIds));
      setSelectAllMatching(false);
    }
  }, [selectAllMatching, selectedIds.size, visibleIds]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
    setSelectAllMatching(false);
  }, []);

  const getEffectiveSelection = useCallback(() => {
    if (selectAllMatching) {
      // In real implementation, this would include all matching IDs
      // from the server based on current filters
      return {
        type: 'all-matching' as const,
        count: totalCount || 0,
      };
    }
    return {
      type: 'specific' as const,
      ids: Array.from(selectedIds),
      count: selectedIds.size,
    };
  }, [selectAllMatching, selectedIds, totalCount]);

  return {
    selectedIds,
    selectAllMatching,
    toggleSelection,
    selectAll,
    clearSelection,
    getEffectiveSelection,
    isSelected: (id: string) => selectedIds.has(id),
    selectionCount: selectAllMatching ? (totalCount || 0) : selectedIds.size,
  };
}
```

### 2. Integration with Bookmark List

```typescript
// apps/web/components/dashboard/bookmarks/BookmarkListWithKeyboard.tsx
import { useBookmarkKeyboardShortcuts } from '@/hooks/useBookmarkKeyboardShortcuts';
import { useTwoTierSelection } from '@/hooks/useTwoTierSelection';
import { BulkTagModalEnhanced } from './BulkTagModalEnhanced';
import { BulkListModalEnhanced } from './BulkListModalEnhanced';

export function BookmarkListWithKeyboard() {
  const [tagModalOpen, setTagModalOpen] = useState(false);
  const [listModalOpen, setListModalOpen] = useState(false);
  
  const { data: bookmarks = [], totalCount } = useBookmarks();
  
  const selection = useTwoTierSelection({
    items: bookmarks,
    getItemId: (bookmark) => bookmark.id,
    totalCount,
  });

  const { isProcessing } = useBookmarkKeyboardShortcuts({
    selectedBookmarks: selection.selectedIds,
    onOpenTagModal: () => setTagModalOpen(true),
    onOpenListModal: () => setListModalOpen(true),
    onArchiveBookmarks: async (ids) => {
      // Archive implementation
    },
    onDeleteBookmarks: async (ids) => {
      // Delete implementation
    },
    onSelectAll: selection.selectAll,
  });

  return (
    <>
      {/* Selection indicator */}
      {selection.selectionCount > 0 && (
        <div className="sticky top-0 z-10 bg-background border-b p-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">
              {selection.selectAllMatching
                ? `All ${totalCount} matching bookmarks selected`
                : `${selection.selectionCount} bookmark(s) selected`}
            </span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={selection.clearSelection}>
                Clear Selection
              </Button>
              <Button size="sm" variant="outline" onClick={() => setTagModalOpen(true)}>
                Tags (T)
              </Button>
              <Button size="sm" variant="outline" onClick={() => setListModalOpen(true)}>
                Lists (L)
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Bookmark grid */}
      <div className="grid gap-4">
        {bookmarks.map(bookmark => (
          <BookmarkCard
            key={bookmark.id}
            bookmark={bookmark}
            selected={selection.isSelected(bookmark.id)}
            onToggleSelect={() => selection.toggleSelection(bookmark.id)}
          />
        ))}
      </div>

      {/* Modals */}
      <BulkTagModalEnhanced
        isOpen={tagModalOpen}
        onClose={() => setTagModalOpen(false)}
        selectedBookmarkIds={Array.from(selection.selectedIds)}
      />
      
      <BulkListModalEnhanced
        isOpen={listModalOpen}
        onClose={() => setListModalOpen(false)}
        selectedBookmarkIds={Array.from(selection.selectedIds)}
      />
    </>
  );
}
```

## Step-by-Step Integration

### Phase 1: Setup (Day 1 Morning)

1. **Install dependencies**
   ```bash
   npm install react-hotkeys-hook cmdk
   ```

2. **Create hooks directory structure**
   ```
   apps/web/hooks/
   ├── useBookmarkKeyboardShortcuts.ts
   ├── useTwoTierSelection.ts
   └── index.ts
   ```

3. **Add TypeScript types**
   ```typescript
   // apps/web/types/keyboard.ts
   export interface KeyboardShortcut {
     key: string;
     description: string;
     action: () => void;
   }
   ```

### Phase 2: Core Implementation (Day 1 Afternoon)

1. **Implement keyboard hook** (as shown above)
2. **Add selection system** (as shown above)
3. **Create keyboard shortcut documentation component**

### Phase 3: Modal Enhancement (Day 2 Morning)

1. **Enhance BulkTagModal** with keyboard support
2. **Enhance BulkListModal** with keyboard support
3. **Add progress tracking and error handling**

### Phase 4: Integration & Testing (Day 2 Afternoon)

1. **Integrate with existing bookmark list**
2. **Add visual indicators for keyboard shortcuts**
3. **Test with production data**
4. **Performance optimization**

### Phase 5: Documentation & Polish (Day 3)

1. **Add inline help for shortcuts**
2. **Create user documentation**
3. **Add telemetry for shortcut usage**
4. **Submit PR with comprehensive docs**

## Testing Strategy

```typescript
// Example test for keyboard shortcuts
describe('BookmarkKeyboardShortcuts', () => {
  it('should open tag modal on T key press', async () => {
    const { getByRole } = render(<BookmarkListWithKeyboard />);
    
    // Select a bookmark
    fireEvent.click(getByRole('checkbox', { name: /bookmark-1/ }));
    
    // Press T key
    fireEvent.keyDown(document, { key: 't' });
    
    // Modal should be open
    expect(getByRole('dialog', { name: /assign tags/i })).toBeInTheDocument();
  });
});
```

## Performance Considerations

1. **Debounce rapid key presses**
2. **Use React.memo for bookmark cards**
3. **Virtualize long bookmark lists**
4. **Batch API calls for bulk operations**

## Rollback Plan

If integration causes issues:
1. Feature flag keyboard shortcuts
2. Provide settings to disable
3. Keep existing UI as fallback

---

This implementation guide provides production-ready code that can be directly integrated into the main Karakeep application.