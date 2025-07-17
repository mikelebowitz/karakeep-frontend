# Triage Mode Specification

## Overview
Triage mode is a specialized interface for rapidly processing unassigned bookmarks using keyboard shortcuts and card-based navigation.

## Core Concept
- **Target**: Bookmarks not assigned to any list
- **Interface**: Card-based, one bookmark at a time
- **Interaction**: Keyboard-first with visual command reference
- **Workflow**: Assign → Apply → Auto-advance

## User Interface Design

### Layout
```
┌─────────────────────────────────────────────────────────────┐
│ Triage Mode - 3 of 47 remaining                    [X] Quit │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────┐  ┌─────────────────────┐  │
│  │                              │  │ Keyboard Commands   │  │
│  │     BOOKMARK CARD            │  │                     │  │
│  │                              │  │ 1-9  Select list    │  │
│  │  • Title                     │  │ ⌘↩   Apply & next   │  │
│  │  • URL                       │  │ esc  Skip to next   │  │
│  │  • Description               │  │ ⌘⇧↩  Apply & prev   │  │
│  │  • Tags                      │  │ q    Quit triage    │  │
│  │                              │  │                     │  │
│  │                              │  │ Available Lists:    │  │
│  │                              │  │                     │  │
│  │                              │  │ 1 📖 Reading List   │  │
│  │                              │  │ 2 🔖 Bookmarks      │  │
│  │                              │  │ 3 📰 News           │  │
│  │                              │  │ 4 💼 Work           │  │
│  │                              │  │ 5 📚 Learning       │  │
│  │                              │  │                     │  │
│  │                              │  │ Selected: 1, 3      │  │
│  │                              │  │                     │  │
│  └──────────────────────────────┘  └─────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```Done since our last committee.

### Components
- **TriageHeader**: Progress indicator and quit button
- **BookmarkCard**: Large, readable bookmark display
- **CommandSidebar**: Keyboard shortcuts and list selection
- **TriageFooter**: Apply/Skip buttons (secondary to keyboard)

## Keyboard Shortcuts

### Primary Commands
- `1-9`: Toggle list assignment (visual feedback on selection)
- `Cmd+Return`: Apply selections and move to next bookmark
- `Escape`: Skip to next bookmark without applying
- `Cmd+Shift+Return`: Apply selections and move to previous bookmark
- `Q`: Quit triage mode

### Navigation
- `J`: Move to next bookmark (same as Escape)
- `K`: Move to previous bookmark
- `Space`: Toggle currently highlighted list

## Technical Implementation

### Data Flow
1. Query unassigned bookmarks: `GET /bookmarks?unassigned=true`
2. Display first bookmark in card format
3. User selects lists via keyboard
4. On Cmd+Return: Apply selections via existing `attachLists` method
5. Move to next bookmark and repeat

### State Management
```typescript
interface TriageState {
  bookmarks: Bookmark[];
  currentIndex: number;
  selectedLists: string[];
  isProcessing: boolean;
  completedCount: number;
}
```

### Key Components

#### TriageMode.tsx
```typescript
const TriageMode = () => {
  const [triageState, setTriageState] = useState<TriageState>({
    bookmarks: [],
    currentIndex: 0,
    selectedLists: [],
    isProcessing: false,
    completedCount: 0
  });

  const currentBookmark = triageState.bookmarks[triageState.currentIndex];
  
  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (e.key >= '1' && e.key <= '9') {
      const listIndex = parseInt(e.key) - 1;
      toggleListSelection(listIndex);
    } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      applyAndNext();
    } else if (e.key === 'Escape') {
      skipToNext();
    } else if (e.key === 'q') {
      quitTriage();
    }
  }, [triageState]);

  const applyAndNext = async () => {
    if (triageState.selectedLists.length > 0) {
      await attachLists(currentBookmark.id, triageState.selectedLists);
    }
    moveToNext();
  };

  return (
    <div className="triage-mode">
      <TriageHeader 
        current={triageState.currentIndex + 1}
        total={triageState.bookmarks.length}
        onQuit={quitTriage}
      />
      
      <div className="triage-content">
        <BookmarkCard bookmark={currentBookmark} />
        <CommandSidebar 
          selectedLists={triageState.selectedLists}
          onListToggle={toggleListSelection}
        />
      </div>
    </div>
  );
};
```

#### BookmarkCard.tsx
```typescript
const BookmarkCard = ({ bookmark }: { bookmark: Bookmark }) => {
  const domain = extractDomain(bookmark.content?.url || '');
  
  return (
    <div className="bookmark-card">
      <div className="bookmark-header">
        <Avatar src={bookmark.content?.favicon} sx={{ width: 32, height: 32 }}>
          <Bookmark />
        </Avatar>
        <div className="bookmark-meta">
          <h2 className="bookmark-title">
            {bookmark.content?.title || bookmark.title || 'Untitled'}
          </h2>
          <p className="bookmark-url">{domain}</p>
        </div>
      </div>
      
      <div className="bookmark-content">
        {bookmark.content?.description && (
          <p className="bookmark-description">
            {bookmark.content.description}
          </p>
        )}
        
        {bookmark.note && (
          <div className="bookmark-note">
            <strong>Note:</strong> {bookmark.note}
          </div>
        )}
        
        {bookmark.tags && bookmark.tags.length > 0 && (
          <div className="bookmark-tags">
            <strong>Tags:</strong>
            {bookmark.tags.map(tag => (
              <Chip key={tag.id} label={tag.name} size="small" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
```

#### CommandSidebar.tsx
```typescript
const CommandSidebar = ({ selectedLists, onListToggle }: CommandSidebarProps) => {
  const { data: lists } = useGetList('lists', {
    pagination: { page: 1, perPage: 100 },
    sort: { field: 'name', order: 'ASC' }
  });

  return (
    <div className="command-sidebar">
      <div className="keyboard-commands">
        <h3>Keyboard Commands</h3>
        <div className="command-list">
          <div className="command-item">
            <kbd>1-9</kbd>
            <span>Select list</span>
          </div>
          <div className="command-item">
            <kbd>⌘↩</kbd>
            <span>Apply & next</span>
          </div>
          <div className="command-item">
            <kbd>esc</kbd>
            <span>Skip to next</span>
          </div>
          <div className="command-item">
            <kbd>⌘⇧↩</kbd>
            <span>Apply & prev</span>
          </div>
          <div className="command-item">
            <kbd>q</kbd>
            <span>Quit triage</span>
          </div>
        </div>
      </div>
      
      <div className="available-lists">
        <h3>Available Lists</h3>
        {lists?.slice(0, 9).map((list, index) => (
          <div 
            key={list.id}
            className={`list-option ${selectedLists.includes(list.id) ? 'selected' : ''}`}
            onClick={() => onListToggle(index)}
          >
            <span className="list-number">{index + 1}</span>
            <span className="list-icon">{list.icon}</span>
            <span className="list-name">{list.name}</span>
          </div>
        ))}
      </div>
      
      {selectedLists.length > 0 && (
        <div className="selected-lists">
          <h4>Selected: {selectedLists.map(id => {
            const list = lists?.find(l => l.id === id);
            return list?.name;
          }).join(', ')}</h4>
        </div>
      )}
    </div>
  );
};
```

## Integration Points

### Entry Points
- Button in BookmarkList: "Enter Triage Mode"
- Keyboard shortcut: `Ctrl+Shift+T`
- Show count of unassigned items in button

### Exit Points
- Complete all items: Automatic return to BookmarkList
- Quit early: Q key or X button
- Maintain state for resume capability

### API Requirements
- Filter for unassigned bookmarks: `GET /bookmarks?unassigned=true`
- Existing list attachment methods: `attachLists(bookmarkId, listIds)`
- Progress tracking capabilities

## Styling Approach

### Card Design
- Large, readable typography
- Plenty of whitespace
- Clear hierarchy with title, URL, description
- Subtle shadows and borders
- Responsive layout

### Sidebar Design
- Fixed width sidebar
- Clear command typography
- Visual separators between sections
- Highlighted selected lists
- Consistent spacing

### Color Scheme
- Primary: Blue for selected items
- Secondary: Gray for inactive items
- Success: Green for completed actions
- Warning: Orange for pending actions

## Success Metrics
- **Speed**: Process 50+ bookmarks in under 10 minutes
- **Efficiency**: Reduce mouse dependency to zero
- **Accuracy**: Clear visual feedback prevents errors
- **Completion**: Easy to process entire backlog

## Implementation Phases

### Phase 1: Core Structure
- Create TriageMode component
- Implement basic keyboard navigation
- Add bookmark card display
- Create command sidebar

### Phase 2: List Selection
- Implement list selection via number keys
- Add visual feedback for selections
- Integrate with existing dataProvider methods

### Phase 3: Navigation & State
- Add next/previous navigation
- Implement apply and skip functionality
- Add progress tracking

### Phase 4: Polish & Integration
- Add entry/exit points in BookmarkList
- Implement styling and animations
- Add error handling and loading states

## Future Enhancements
- Batch operations in triage mode
- Custom keyboard shortcut configuration
- Resume triage session capability
- Triage analytics and insights
- Undo/redo functionality
- Bulk tag assignment in triage mode

## Technical Considerations

### Performance
- Virtualization for large unassigned lists
- Prefetch next bookmark data
- Optimize re-renders with React.memo
- Efficient keyboard event handling

### Accessibility
- ARIA labels for all interactive elements
- Screen reader announcements for state changes
- High contrast mode support
- Focus management for keyboard navigation

### Error Handling
- Network error recovery
- API failure fallbacks
- User feedback for all operations
- Graceful degradation

This specification provides a complete blueprint for implementing an efficient, keyboard-first triage mode that enables rapid processing of unassigned bookmarks.