# Keyboard Integration Architecture

## System Architecture

```mermaid
graph TB
    subgraph "User Input Layer"
        K[Keyboard Events]
        M[Mouse Events]
        CMD[Command Palette]
    end

    subgraph "Event Handling Layer"
        KH[useBookmarkKeyboardShortcuts Hook]
        HK[react-hotkeys-hook]
        CMDK[cmdk Library]
    end

    subgraph "State Management"
        SEL[useTwoTierSelection Hook]
        BMS[Bookmark Selection State]
        MS[Modal State]
    end

    subgraph "UI Components"
        BL[BookmarkList]
        BTM[BulkTagModal]
        BLM[BulkListModal]
        TB[Toast/Feedback]
    end

    subgraph "API Layer"
        TQ[Tag Queries]
        LQ[List Queries]
        BM[Bookmark Mutations]
    end

    K --> KH
    K --> CMDK
    CMD --> CMDK
    M --> SEL
    
    KH --> SEL
    KH --> MS
    HK --> KH
    CMDK --> MS
    
    SEL --> BMS
    MS --> BTM
    MS --> BLM
    
    BMS --> BL
    BTM --> TQ
    BTM --> BM
    BLM --> LQ
    BLM --> BM
    
    BM --> TB
```

## Keyboard Event Flow

```mermaid
sequenceDiagram
    participant U as User
    participant KB as Keyboard
    participant KH as Keyboard Hook
    participant ST as Selection State
    participant MD as Modal
    participant API as API
    participant UI as UI Feedback

    U->>KB: Press "T" key
    KB->>KH: keydown event
    KH->>KH: Check if input focused
    KH->>ST: Check selection count
    alt No bookmarks selected
        KH->>UI: Show "No bookmarks" toast
    else Bookmarks selected
        KH->>MD: Open Tag Modal
        MD->>API: Fetch available tags
        API->>MD: Return tags list
        U->>MD: Select tags
        U->>MD: Press Enter/Apply
        MD->>API: Bulk assign tags
        loop For each bookmark
            API->>API: Assign tags
            MD->>UI: Update progress
        end
        API->>MD: Success
        MD->>UI: Show success toast
        MD->>ST: Clear selection
    end
```

## Component Integration Map

```mermaid
graph LR
    subgraph "Our Implementation"
        RA[React-Admin/Refine]
        DUI[DaisyUI Components]
        CKH[Custom Keyboard Hooks]
        RDP[Refine Data Provider]
    end

    subgraph "Main App Implementation"
        NX[NextJS App Router]
        SUI[shadcn/ui Components]
        CMK[cmdk Integration]
        RQ[React Query/SWR]
    end

    subgraph "Integration Points"
        KHI[Keyboard Handler Interface]
        MSI[Modal System Interface]
        SSI[Selection State Interface]
        API[API Interface]
    end

    CKH --> KHI
    CMK --> KHI
    
    DUI --> MSI
    SUI --> MSI
    
    RA --> SSI
    NX --> SSI
    
    RDP --> API
    RQ --> API
```

## Selection State Machine

```mermaid
stateDiagram-v2
    [*] --> NoSelection
    
    NoSelection --> SingleSelection: Select bookmark
    NoSelection --> MultiSelection: Shift+Click
    
    SingleSelection --> MultiSelection: Ctrl/Cmd+Click
    SingleSelection --> NoSelection: Deselect
    SingleSelection --> AllVisible: Ctrl/Cmd+A
    
    MultiSelection --> AllVisible: Ctrl/Cmd+A
    MultiSelection --> SingleSelection: Click without modifier
    MultiSelection --> NoSelection: Clear selection
    
    AllVisible --> AllMatching: Ctrl/Cmd+Shift+A
    AllVisible --> MultiSelection: Deselect one
    AllVisible --> NoSelection: Clear selection
    
    AllMatching --> NoSelection: Clear selection
    AllMatching --> MultiSelection: Deselect any

    NoSelection --> BulkOperation: Press T/L/A/Delete
    SingleSelection --> BulkOperation: Press T/L/A/Delete
    MultiSelection --> BulkOperation: Press T/L/A/Delete
    AllVisible --> BulkOperation: Press T/L/A/Delete
    AllMatching --> BulkOperation: Press T/L/A/Delete
    
    BulkOperation --> Processing: Confirm action
    Processing --> NoSelection: Complete
    BulkOperation --> [*]: Cancel
```

## Modal Lifecycle

```mermaid
flowchart TD
    A[Keyboard Shortcut Pressed] --> B{Selection Check}
    B -->|No Selection| C[Show Toast Error]
    B -->|Has Selection| D[Open Modal]
    
    D --> E[Focus Search Input]
    E --> F{User Action}
    
    F -->|Search| G[Filter Items]
    F -->|Select Item| H[Add to Selected]
    F -->|Deselect Item| I[Remove from Selected]
    F -->|Press Enter| J{Has Selected Items?}
    F -->|Press Escape| K[Close Modal]
    
    G --> F
    H --> F
    I --> F
    
    J -->|No| L[Show Validation Error]
    J -->|Yes| M[Start Bulk Operation]
    
    L --> F
    
    M --> N[Show Progress Bar]
    N --> O{Process Each Item}
    
    O -->|Success| P[Update Progress]
    O -->|Error| Q[Log Error]
    
    P --> R{More Items?}
    Q --> R
    
    R -->|Yes| O
    R -->|No| S[Operation Complete]
    
    S --> T[Show Success Toast]
    T --> U[Clear Selection]
    U --> K
    
    C --> V[End]
    K --> V
```

## Performance Optimization Strategy

```mermaid
graph TD
    A[User Input] --> B{Input Type}
    
    B -->|Rapid Key Presses| C[Debounce 150ms]
    B -->|Single Key Press| D[Process Immediately]
    
    C --> E[Aggregate Actions]
    D --> F[Execute Action]
    E --> F
    
    F --> G{Operation Type}
    
    G -->|UI Update| H[React.memo Components]
    G -->|API Call| I[Batch Requests]
    G -->|Selection Change| J[Virtualized List]
    
    H --> K[Render Update]
    I --> L[Single Network Request]
    J --> M[Update Visible Items Only]
    
    K --> N[UI Feedback]
    L --> N
    M --> N
```

## Error Handling Flow

```mermaid
flowchart LR
    A[Keyboard Action] --> B{Validation}
    
    B -->|Invalid| C[Show Error Toast]
    B -->|Valid| D[Execute Operation]
    
    D --> E{API Call}
    
    E -->|Network Error| F[Retry Logic]
    E -->|Server Error| G[Show Error Modal]
    E -->|Success| H[Update UI]
    
    F --> I{Retry Count}
    I -->|< 3| E
    I -->|>= 3| J[Show Persistent Error]
    
    G --> K[Log to Console]
    J --> K
    
    H --> L[Clear Selection]
    L --> M[Show Success Feedback]
```

## Deployment Strategy

```mermaid
gantt
    title Keyboard Integration Deployment
    dateFormat  YYYY-MM-DD
    section Phase 1
    Environment Setup    :a1, 2024-01-15, 2h
    Install Dependencies :a2, after a1, 2h
    Create Hook Structure:a3, after a2, 4h
    
    section Phase 2
    Implement Keyboard Hook    :b1, 2024-01-16, 4h
    Add Selection System       :b2, after b1, 4h
    
    section Phase 3
    Enhance Tag Modal         :c1, 2024-01-17, 4h
    Enhance List Modal        :c2, after c1, 4h
    
    section Phase 4
    Integration Testing       :d1, 2024-01-18, 4h
    Performance Testing       :d2, after d1, 2h
    Documentation            :d3, after d2, 2h
    
    section Phase 5
    Code Review              :e1, 2024-01-19, 2h
    Deploy to Staging        :e2, after e1, 1h
    User Testing            :e3, after e2, 4h
    Deploy to Production    :e4, after e3, 1h
```

---

These diagrams provide a visual understanding of:
1. How keyboard events flow through the system
2. Component integration points between our app and theirs
3. Selection state transitions
4. Modal lifecycle and error handling
5. Performance optimization strategies
6. Deployment timeline

Each diagram can be rendered using any Mermaid-compatible viewer or documentation system.