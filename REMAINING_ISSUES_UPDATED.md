# Updated Remaining Issues - Post Phase 2 Fixes

## 🚨 CRITICAL ISSUES (Must Fix Immediately)

### 1. **Black Borders Throughout Triage Mode** (URGENT - Incomplete from Phase 2)
- **Issue**: Harsh black borders visible around all components in triage mode
- **Evidence**: Screenshot shows black borders on sidebar lists, bookmark card, command bar
- **Impact**: Makes interface look unprofessional and broken
- **Priority**: CRITICAL - blocks user acceptance
- **Files**: CommandSidebar.tsx, BookmarkCard.tsx, KeyboardCommandBar.tsx

## 🔧 IMPORTANT ISSUES (High Impact)

### 2. **Table Responsiveness & Width Utilization** (Issue #7 from original backlog)
- **Issue**: Table feels narrow and doesn't use full container width effectively  
- **Evidence**: Screenshot shows table confined to narrow center area
- **Impact**: Poor space utilization, cramped data display
- **Priority**: HIGH
- **File**: BookmarkList.tsx

### 3. **Actions Column Button Layout** (Issue #10 from original backlog)
- **Issue**: Edit/Delete buttons stacked vertically, wasting horizontal space
- **Evidence**: Screenshot shows buttons in column instead of row
- **Impact**: Inefficient space usage, inconsistent with UI patterns
- **Priority**: HIGH  
- **File**: BookmarkList.tsx

### 4. **Available Lists Text Size** (Issue #9 from original backlog)
- **Issue**: List names in triage sidebar too small to read comfortably
- **Evidence**: Screenshot shows tiny text for "Projects", "Dev", "Home", etc.
- **Impact**: Poor usability, accessibility concern
- **Priority**: MEDIUM
- **File**: CommandSidebar.tsx

## 📋 POLISH ISSUES (Nice to Have)

### 5. **Bookmark Card Sizing in Triage** (Issue #8 from original backlog)  
- **Issue**: Card could be larger to fill more of the available center space
- **Evidence**: Screenshot shows unused white space around card
- **Impact**: Suboptimal space utilization
- **Priority**: MEDIUM
- **File**: TriageMode.tsx, BookmarkCard.tsx

### 6. **Search Input Prominence** (Issue #11 from original backlog)
- **Issue**: Search input has basic styling, could be more visually prominent
- **Evidence**: Screenshot shows plain input field
- **Impact**: Minor UX improvement
- **Priority**: LOW
- **File**: BookmarkList.tsx

## 📊 Status Summary

### ✅ **COMPLETED (6 issues)**
- Inter font loading and typography standardization
- DaisyUI skeleton loading implementation  
- Table header cleanup (removed "Favicon", left-aligned)
- DaisyUI badge implementation for tags
- Progress bar enhancement with DaisyUI component
- Triage mode layout proportions (spacing, sidebar width)

### 🚨 **CRITICAL BLOCKERS (1 issue)**
- Black borders throughout triage mode interface

### 🔧 **REMAINING WORK (5 issues)**
- Table responsiveness and button layout (2 high priority)
- Sidebar text size and card sizing (2 medium priority)  
- Search input styling (1 low priority)

## 🎯 Implementation Strategy for Next Session

### **Phase 3A: Critical Fixes (30 min)**
1. **Fix black borders** - Examine border classes, use proper DaisyUI border colors
2. **Test thoroughly** - Verify borders are subtle gray, not black

### **Phase 3B: Layout Optimization (45 min)**  
3. **Table width utilization** - Make table use full container width
4. **Actions button layout** - Change from vertical to horizontal button arrangement
5. **Sidebar text sizing** - Increase list name font size for readability

### **Phase 3C: Final Polish (30 min)**
6. **Card sizing optimization** - Improve bookmark card proportions
7. **Search input enhancement** - Apply better DaisyUI input styling

**Total Estimated Time**: 2 hours
**Risk Level**: Low (UI fixes only)
**Critical Path**: Black borders must be fixed first