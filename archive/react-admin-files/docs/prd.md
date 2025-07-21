```markdown
# Karakeep Web Frontend PRD

**Version:** 1.0
**Date:** July 12, 2025

## 1. Executive Summary

This document outlines the requirements for the Karakeep web frontend application. The primary objective is to develop a fast, intuitive, and highly productive web interface for managing bookmarks, tags, and lists stored via the Karakeep REST API. Leveraging React and React-Admin, the application will enable users to perform rapid CRUD operations, utilize power features like batch actions and real-time search, and organize their saved content efficiently. Authentication via JWT is required. The application will prioritize keyboard navigability, accessibility, and a maintainable codebase for easy deployment (Vercel) and local development. The ultimate goal is to provide power users with a friction-free experience for triaging, tagging, and organizing their digital resources.

## 2. Product Vision

**Purpose:** To provide the most efficient and productive web interface for managing large collections of bookmarks, transforming disorganized links into an easily navigable and actionable personal knowledge base.

**Target Users:** Individuals who frequently save web content and struggle to manage, organize, and retrieve it effectively using standard browser tools. This includes researchers, developers, students, content curators, knowledge workers, and anyone who accumulates a significant number of links. They are users who value speed, efficiency, and robust organizational capabilities.

**Business Goals:**
*   Increase user engagement and retention by providing a superior bookmark management experience.
*   Position Karakeep as a powerful productivity tool, attracting users beyond basic bookmarking needs.
*   Establish a solid foundation for future feature development and potential monetization strategies.
*   Drive traffic and usage to the Karakeep platform.

## 3. User Personas

**Persona Name:** Anya, The Knowledge Curator
**Role:** Researcher / Content Manager
**Goals:**
*   Quickly save articles, reports, and resources relevant to her projects.
*   Efficiently categorize saved items using tags and assign them to specific project lists.
*   Easily find specific pieces of information later for writing papers or creating reports.
*   Maintain an organized digital library without spending excessive time on administration.
**Pain Points:**
*   Browser bookmarks are a chaotic mess, making retrieval difficult.
*   Manually tagging and organizing links one by one is time-consuming and tedious.
*   Losing important links saved weeks or months ago.
*   Spending too much time managing links instead of using the information.

**Persona Name:** Ben, The Efficiency Hacker
**Role:** Software Developer / Prolific Learner
**Goals:**
*   Rapidly save technical documentation, tutorials, code examples, and blog posts.
*   Organize links into collections (lists) for specific technologies or problems he's solving.
*   Use keyboard shortcuts to speed up all interactions.
*   Apply tags to multiple links simultaneously after saving them in bulk.
*   Perform quick, fuzzy searches to find any related link immediately.
**Pain Points:**
*   Existing bookmarking tools are slow and mouse-dependent.
*   No easy way to apply actions (like tagging) to many links at once.
*   Search is often slow or requires exact keywords.
*   Feeling limited by basic tag or folder structures.

## 4. Feature Specifications

### 4.1. Authentication (JWT Login)

*   **User Story:** As a user, I want to securely log in to the Karakeep web application using my credentials so I can access my saved bookmarks, tags, and lists.
*   **Acceptance Criteria:**
    *   When the user is not authenticated and attempts to access a protected route, they are redirected to a login page.
    *   The login page contains fields for username (or email) and password, and a submit button.
    *   Upon successful login (API returns JWT), the JWT token is stored in the browser's `localStorage` or `sessionStorage`.
    *   The user is redirected to the main application view (e.g., Bookmark List).
    *   All subsequent requests to the Karakeep API include the stored JWT in the `Authorization: Bearer <token>` header.
    *   There is a "Logout" option available within the application interface.
    *   Clicking "Logout" clears the stored JWT and redirects the user back to the login page.
    *   If an API request returns a 401 Unauthorized error (e.g., token expired), the user is automatically logged out and redirected to the login page.
*   **Edge Cases:**
    *   Incorrect username or password entered (display API error message).
    *   API authentication endpoint is unreachable or returns an error other than 401.
    *   User manually clears browser storage containing the token.
    *   Token expires while the user is actively using the application.

### 4.2. Bookmark Management (CRUD)

*   **User Story:** As a user, I want to view, add, edit, and delete my bookmarks to keep my collection up-to-date.
*   **Acceptance Criteria:**
    *   **View:**
        *   A primary view displays a paginated list of bookmarks.
        *   Each list item shows essential information (e.g., Title, URL, Description snippet, associated Tags, associated Lists).
        *   Bookmarks can be sorted (e.g., by creation date, title, URL) and paginated.
        *   Clicking on a bookmark list item navigates to a detailed view or opens an edit form/modal.
    *   **Create:**
        *   A button or action is available to initiate adding a new bookmark.
        *   A form or modal appears allowing the user to input: URL (required), Title (required, pre-filled if fetched from URL metadata - *stretch goal*), Description (optional), Tags (select from existing or add new), Lists (select from existing).
        *   Submitting the form calls the API to create the bookmark and adds it to the list view.
    *   **Edit:**
        *   Clicking on a bookmark from the list or a dedicated 'Edit' action opens an edit form/modal pre-populated with the bookmark's current data.
        *   The user can modify URL, Title, Description, Tags, and Lists.
        *   Saving the form calls the API to update the bookmark and reflects changes in the list view.
    *   **Delete:**
        *   An option to delete a bookmark is available (e.g., button on list item or detail view).
        *   Clicking delete prompts a confirmation dialog.
        *   Confirming deletion calls the API to remove the bookmark and removes it from the list view.
*   **Edge Cases:**
    *   API returns an error during create/update/delete (display error message).
    *   Attempting to add a bookmark with an invalid URL format.
    *   API cannot fetch metadata for a new bookmark URL (*stretch goal*).
    *   Deleting a bookmark fails on the API but client-side state is updated (requires sync mechanism or refetch).
    *   Creating/editing a bookmark with very long content for title/description.

### 4.3. Tag Management (CRUD)

*   **User Story:** As a user, I want to create, view, edit, and delete my tags to categorize my bookmarks effectively.
*   **Acceptance Criteria:**
    *   A dedicated view or section lists all existing tags.
    *   Each tag in the list shows its name and optionally the number of bookmarks it's applied to.
    *   Ability to add a new tag (input field and button).
    *   Ability to edit an existing tag's name.
    *   Ability to delete an existing tag (with confirmation).
    *   When editing/deleting a tag, associated bookmarks should reflect the change (API handles data integrity, frontend reflects via refresh or state update).
*   **Edge Cases:**
    *   Attempting to create a tag with a name that already exists (API should ideally handle uniqueness).
    *   Attempting to create/edit a tag with an empty name or invalid characters.
    *   API error during tag create/update/delete.
    *   Deleting a tag that is currently assigned to many bookmarks (ensure API handles gracefully).

### 4.4. List Management (CRUD)

*   **User Story:** As a user, I want to create, view, edit, and delete lists to organize my bookmarks into collections.
*   **Acceptance Criteria:**
    *   A dedicated view or section lists all existing lists.
    *   Each list in the list shows its name and optionally the number of bookmarks it contains.
    *   Ability to add a new list (input field and button).
    *   Ability to edit an existing list's name.
    *   Ability to delete an existing list (with confirmation).
    *   When editing/deleting a list, associated bookmarks should reflect the change (API handles data integrity, frontend reflects).
*   **Edge Cases:**
    *   Attempting to create a list with a name that already exists.
    *   Attempting to create/edit a list with an empty name or invalid characters.
    *   API error during list create/update/delete.
    *   Deleting a list that contains many bookmarks (ensure API handles gracefully, e.g., removes association, doesn't delete bookmarks).

### 4.5. Batch Actions

*   **User Story:** As a power user, I want to select multiple bookmarks and perform actions on them simultaneously to save time.
*   **Acceptance Criteria:**
    *   The Bookmark List view includes checkboxes or a similar mechanism to select multiple list items.
    *   Selecting one or more items activates a batch action menu or buttons (e.g., "Apply Tags", "Add to List", "Delete").
    *   **Batch Apply Tags:** Selecting bookmarks and choosing this action allows the user to select one or more tags to add to *all* selected bookmarks. Users should be able to select existing tags or potentially add new ones in the process (*stretch goal*).
    *   **Batch Add to List:** Selecting bookmarks and choosing this action allows the user to select one or more lists to add *all* selected bookmarks to.
    *   **Batch Delete:** Selecting bookmarks and choosing this action allows the user to delete *all* selected bookmarks (with a clear confirmation dialog stating the number of items being deleted).
    *   After a batch action, the Bookmark List view updates to reflect the changes (e.g., removed items, updated tags/lists shown).
*   **Edge Cases:**
    *   No items are selected when a batch action is attempted (actions should be disabled).
    *   API call for batch action fails for some or all items (provide user feedback).
    *   Attempting to apply a tag/list that doesn't exist (frontend validation or API error handling).
    *   Selecting a very large number of bookmarks (ensure UI remains responsive and API call is efficient).

### 4.6. Inline Editing (Tags & Lists on Bookmarks)

*   **User Story:** As a user, I want to quickly add or remove tags and lists from a bookmark directly from the list view or detail view without opening a separate edit form.
*   **Acceptance Criteria:**
    *   On the Bookmark List item and/or Bookmark Detail view, the displayed tags and lists are interactive.
    *   Clicking on a tag or list allows removing it from the bookmark (with confirmation if necessary).
    *   An input or selector is available next to the tags/lists to quickly add an existing tag or list to the bookmark.
    *   Changes made via inline editing trigger an API call to update the specific bookmark immediately.
    *   Visual feedback is provided during the save process (e.g., spinner, disabled state).
*   **Edge Cases:**
    *   API save fails during inline edit (provide error feedback, potentially revert UI state).
    *   User adds a tag/list that doesn't exist (frontend should ideally use a picker of existing ones, or API validates).
    *   Network latency makes the inline edit feel slow.

### 4.7. Real-time Search & Filtering

*   **User Story:** As a user, I want to quickly find bookmarks by typing keywords or selecting filters (tags, lists) and see the results update instantly.
*   **Acceptance Criteria:**
    *   A prominent search input field is available on the Bookmark List view.
    *   Typing in the search field triggers filtering of the displayed bookmark list. This search should ideally look across Title, URL, and Description fields.
    *   Search requests to the API are debounced to avoid excessive calls while typing.
    *   Filters for Tags and Lists are available (e.g., dropdowns, multi-select pickers).
    *   Selecting one or more tags and/or lists filters the bookmark list to show only items matching *all* selected criteria.
    *   Search and filters can be used in combination.
    *   The current search query and active filters are reflected in the UI.
    *   Clearing the search field or removing filters resets the list to show all (or default filtered) bookmarks.
*   **Edge Cases:**
    *   API search endpoint is slow, leading to delayed results.
    *   Searching/filtering on an empty bookmark collection.
    *   Complex search queries or special characters not handled by the API.
    *   Combining a large number of filters causing performance issues.

### 4.8. User Experience (Keyboard Shortcuts & Accessibility)

*   **User Story:** As a power user, I want to navigate and perform common actions using keyboard shortcuts for maximum efficiency. As a user with accessibility needs, I want the application to be perceivable and operable using assistive technologies.
*   **Acceptance Criteria:**
    *   **Keyboard Shortcuts:**
        *   Common actions have assigned keyboard shortcuts (e.g., `/` to focus search, `n` to create new bookmark, `j`/`k` to navigate list items, `x` to select item for batch action).
        *   A help or settings section lists available keyboard shortcuts (*stretch goal*).
    *   **Accessibility (WCAG 2.1 AA compliance goal):**
        *   The application is fully navigable using a keyboard (correct tab order, focus indicators visible).
        *   All interactive elements (buttons, links, form fields) are accessible via keyboard.
        *   Sufficient color contrast is used for text and interactive elements.
        *   Appropriate ARIA attributes are used to convey meaning and structure for screen reader users (e.g., labels for forms, roles for regions, states for interactive elements).
        *   Images have descriptive alt text if they convey information.
        *   Error messages are clearly associated with the relevant form fields and announced to screen readers.
*   **Edge Cases:**
    *   Keyboard shortcut conflicts with browser or OS shortcuts (avoid common ones like Ctrl/Cmd+S).
    *   Complex custom components in React-Admin requiring manual ARIA implementation.

## 5. Technical Requirements

**API Dependencies:**
*   Requires a functional Karakeep REST API supporting CRUD operations for bookmarks, tags, and lists.
*   **Authentication Endpoint:** `POST /auth/login` expecting username/password and returning a JWT on success.
*   **Resource Endpoints:**
    *   `GET /bookmarks`: List all bookmarks (supports pagination, filtering, sorting, search parameters).
    *   `POST /bookmarks`: Create a new bookmark.
    *   `GET /bookmarks/:id`: Retrieve a single bookmark.
    *   `PUT /bookmarks/:id`: Update a single bookmark.
    *   `DELETE /bookmarks/:id`: Delete a single bookmark.
    *   `GET /tags`: List all tags.
    *   `POST /tags`: Create a new tag.
    *   `PUT /tags/:id`: Update a tag.
    *   `DELETE /tags/:id`: Delete a tag (API should handle associated bookmarks - e.g., remove tag from bookmarks).
    *   `GET /lists`: List all lists.
    *   `POST /lists`: Create a new list.
    *   `PUT /lists/:id`: Update a list.
    *   `DELETE /lists/:id`: Delete a list (API should handle associated bookmarks - e.g., remove bookmark from list).
*   **Batch Action Endpoints (Recommended):**
    *   `PUT /bookmarks/batch`: Update multiple bookmarks by IDs (e.g., apply tags/lists). Payload: `{ ids: [id1, id2, ...], data: { tags: [tagId1, ...], lists: [listId1, ...], ... } }`
    *   `DELETE /bookmarks/batch`: Delete multiple bookmarks by IDs. Payload: `{ ids: [id1, id2, ...] }`
*   **Data Structures:** Expected minimal fields:
    *   Bookmark: `id` (unique identifier), `url`, `title`, `description` (optional), `tags` (array of tag IDs or nested objects with `id`, `name`), `lists` (array of list IDs or nested objects with `id`, `name`), `createdAt`, `updatedAt`.
    *   Tag: `id` (unique identifier), `name`.
    *   List: `id` (unique identifier), `name`.
*   **Authentication:** API must validate JWT provided in the `Authorization: Bearer <token>` header for all protected endpoints.
*   **API Responses:** Standard REST responses (200 OK, 201 Created, 204 No Content, 4xx for client errors, 5xx for server errors). List endpoints (`GET /bookmarks`, `GET /tags`, `GET /lists`) must support pagination (e.g., via query params `_start`, `_end`, `_sort`, `_order`) and filtering/search (e.g., `q` for search, `tags_ids` for filtering by tag IDs). The response should include total count, preferably in a `Content-Range` header, for pagination.
*   **API Adapter:** A custom `dataProvider` implementation is required to translate React-Admin's data fetching conventions (GET_LIST, GET_ONE, CREATE, UPDATE, DELETE, UPDATE_MANY, DELETE_MANY) into calls to the Karakeep REST API endpoints. A custom `authProvider` is needed for login/logout/checkAuth/checkError.

**Frontend Data Storage:**
*   JWT token should be stored securely in `localStorage` or `sessionStorage`. No other sensitive user data should be stored client-side beyond what's needed for the current session state and potentially UI state (e.g., filter values).
*   Application state management will be handled primarily by React-Admin (using Redux Toolkit internally), with component-local state for specific UI interactions (e.g., form input values before save).

**Development & Deployment:**
*   The application must be built using React and React-Admin with Material UI components.
*   Codebase should follow React/Redux best practices, be modular, and well-documented.
*   Utilize standard build tools (e.g., Create React App or Vite).
*   Configuration for the API base URL and other environment-specific settings must be managed via environment variables (e.g., `.env` files).
*   The project structure should be configured for easy static deployment on platforms like Vercel (`npm build` generates production-ready static assets).
*   Local development environment setup should be streamlined (`npm install`, `npm start`).

## 6. Implementation Roadmap

This roadmap outlines a suggested sequence for implementing the features, prioritizing core functionality and productivity enhancements for a Version 1.0 release.

**Phase 1: Foundation & Basic Bookmark Management (Estimated: [Duration])**
*   Implement basic project structure with React, React-Admin, Material UI.
*   Set up Authentication Flow (Login page, Auth Provider, token storage, protected routes).
*   Develop initial Karakeep API Data Provider (supporting GET_LIST, GET_ONE, CREATE, UPDATE, DELETE for Bookmarks).
*   Implement Bookmark Listing view (`<List>`, `<Datagrid>`).
*   Implement Bookmark Creation form (`<Create>`, `<SimpleForm>`).
*   Implement Bookmark Detail/Edit view (`<Edit>`, `<SimpleForm>`).
*   Add Bookmark Delete functionality.

**Phase 2: Tag & List Management & Association (Estimated: [Duration])**
*   Extend Data Provider support for Tags and Lists (GET_LIST, CREATE, UPDATE, DELETE).
*   Implement Tag Listing & Management views (`<List>`, `<Datagrid>`, `<Create>`, `<Edit>`).
*   Implement List Listing & Management views (`<List>`, `<Datagrid>`, `<Create>`, `<Edit>`).
*   Integrate Tag and List inputs/displays into Bookmark forms (e.g., `<ReferenceArrayInput>`, `<SelectArrayInput>`).
*   Ensure API interactions for bookmarks correctly handle sending/receiving associated Tag and List IDs.

**Phase 3: Core Productivity - Search & Filtering (Estimated: [Duration])**
*   Extend Data Provider to support filtering (tags, lists) and search (`GET_LIST` query parameters).
*   Add Search input and Filter components (e.g., `<FilterButton>`, `<SelectArrayInput>` within filters) to the Bookmark List view.
*   Implement debouncing for the search input.

**Phase 4: Power Features - Batch Actions & Inline Editing (Estimated: [Duration])**
*   Extend Data Provider to support `UPDATE_MANY` and `DELETE_MANY` (mapping to batch API endpoints).
*   Enable row selection on the Bookmark List (`rowClick="toggleSelection"` or similar).
*   Implement Batch Delete button/action.
*   Implement Batch Tag/List assignment button/action (e.g., using a custom bulk action component with a modal for selection).
*   Implement Inline Editing for Tags and Lists directly within the Bookmark List rows or Detail view (might require custom React-Admin components or leveraging `<EditableDatagrid>` if suitable).

**Phase 5: Refinement, UX & Accessibility (Estimated: [Duration])**
*   Implement core Keyboard Shortcuts identified as high value (e.g., Search focus, list navigation, item selection).
*   Conduct accessibility review and implement necessary ARIA attributes, focus management, and contrast adjustments.
*   Improve loading states, error handling messages, and empty states for all views.
*   Review and refine UI/UX based on testing and user feedback.
*   Optimize performance for large lists of bookmarks.

**Ongoing/Parallel Activities:**
*   Continuous refinement and testing of the React-Admin Data Provider and Auth Provider.
*   Documentation of the local development environment setup.
*   Configuration and testing of Vercel deployment pipeline.
*   Writing unit and integration tests for critical components and data interactions.
*   Collaboration with API developers to ensure endpoints meet frontend needs.

**Future Considerations (Beyond V1.0):**
*   Bookmark import functionality (e.g., from browser HTML export).
*   Browser extension for saving bookmarks directly to Karakeep.
*   More advanced sorting options or custom views.
*   Support for additional bookmark metadata (e.g., screenshots, notes).
*   User settings and profile management.
```
