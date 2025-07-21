# Karakeep API Endpoints Documentation

## Overview
- **Base URL**: Configured via `VITE_API_URL` environment variable
- **Authentication**: HTTP Bearer Token (JWT)
- **Current Version**: v0.25.0

## Authentication
All endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Bookmarks

### GET /bookmarks
Get all bookmarks with optional filtering and pagination.

**Query Parameters:**
- `archived` (boolean, optional): Filter by archived status
- `favourited` (boolean, optional): Filter by favourited status
- `sortOrder` (string, optional): "asc", "desc" (default: "desc")
- `limit` (number, optional): Maximum number of results
- `cursor` (string, optional): Pagination cursor
- `includeContent` (boolean, optional, default: true): Include full content

**Response:**
```json
{
  "bookmarks": [
    {
      "id": "string",
      "url": "string",
      "title": "string",
      "description": "string",
      "tags": ["string"],
      "createdAt": "string",
      "updatedAt": "string",
      "archived": boolean,
      "favourited": boolean,
      "note": "string",
      "summary": "string"
    }
  ],
  "nextCursor": "string"
}
```

### GET /bookmarks/{bookmarkId}
Get a single bookmark by ID.

**Path Parameters:**
- `bookmarkId` (string, required): Bookmark ID

**Query Parameters:**
- `includeContent` (boolean, optional, default: true): Include full content

**Response:** Single bookmark object

### POST /bookmarks
Create a new bookmark.

**Request Body:**
```json
{
  "title": "string",
  "archived": boolean,
  "favourited": boolean,
  "note": "string",
  "summary": "string",
  "createdAt": "string",
  "type": "link|text|asset",
  "url": "string", // for link type
  "text": "string", // for text type
  "assetType": "image|pdf", // for asset type
  "assetId": "string" // for asset type
}
```

### PATCH /bookmarks/{bookmarkId}
Update a bookmark by ID.

**Path Parameters:**
- `bookmarkId` (string, required): Bookmark ID

**Request Body:** Partial bookmark object with fields to update

### DELETE /bookmarks/{bookmarkId}
Delete a bookmark by ID.

**Path Parameters:**
- `bookmarkId` (string, required): Bookmark ID

### GET /bookmarks/search
Search bookmarks.

**Query Parameters:**
- `q` (string, required): Search query
- `sortOrder` (string, optional): "asc", "desc", "relevance" (default: "relevance")
- `limit` (number, optional): Maximum results
- `cursor` (string, optional): Pagination cursor
- `includeContent` (boolean, optional, default: true): Include full content

### POST /bookmarks/{bookmarkId}/summarize
Generate a summary for a bookmark.

**Path Parameters:**
- `bookmarkId` (string, required): Bookmark ID

### POST /bookmarks/{bookmarkId}/tags
Attach tags to a bookmark.

**Path Parameters:**
- `bookmarkId` (string, required): Bookmark ID

**Request Body:**
```json
{
  "tags": [
    {
      "tagId": "string",
      "tagName": "string"
    }
  ]
}
```

**Response:**
```json
{
  "attached": ["tagId1", "tagId2"]
}
```

### POST /bookmarks/{bookmarkId}/assets
Attach an asset to a bookmark.

**Path Parameters:**
- `bookmarkId` (string, required): Bookmark ID

**Request Body:**
```json
{
  "id": "string",
  "assetType": "screenshot|assetScreenshot|bannerImage|fullPageArchive|video|bookmarkAsset|precrawledArchive|unknown"
}
```

## Tags

### GET /tags
Get all tags.

**Response:**
```json
{
  "tags": [
    {
      "id": "string",
      "name": "string",
      "numBookmarks": number,
      "numBookmarksByAttachedType": {
        "ai": number,
        "human": number
      }
    }
  ]
}
```

### GET /tags/{tagId}
Get a single tag by ID.

**Path Parameters:**
- `tagId` (string, required): Tag ID

**Response:** Single tag object

### PATCH /tags/{tagId}
Update a tag by ID.

**Path Parameters:**
- `tagId` (string, required): Tag ID

**Request Body:**
```json
{
  "name": "string"
}
```

### DELETE /tags/{tagId}
Delete a tag by ID.

**Path Parameters:**
- `tagId` (string, required): Tag ID

### GET /tags/{tagId}/bookmarks
Get bookmarks with a specific tag.

**Path Parameters:**
- `tagId` (string, required): Tag ID

**Query Parameters:**
- `limit` (number, optional): Maximum results
- `cursor` (string, optional): Pagination cursor
- `includeContent` (boolean, optional, default: true): Include full content

## Lists

### GET /lists
Get all lists.

**Response:**
```json
{
  "lists": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "icon": "string",
      "parentId": "string",
      "type": "manual|smart",
      "query": "string",
      "public": boolean
    }
  ]
}
```

### GET /lists/{listId}
Get a single list by ID.

**Path Parameters:**
- `listId` (string, required): List ID

### POST /lists
Create a new list.

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "icon": "string",
  "type": "manual|smart",
  "query": "string",
  "parentId": "string"
}
```

### PATCH /lists/{listId}
Update a list by ID.

**Path Parameters:**
- `listId` (string, required): List ID

**Request Body:** Partial list object with fields to update

### DELETE /lists/{listId}
Delete a list by ID.

**Path Parameters:**
- `listId` (string, required): List ID

### PUT /lists/{listId}/bookmarks/{bookmarkId}
Add a bookmark to a list.

**Path Parameters:**
- `listId` (string, required): List ID
- `bookmarkId` (string, required): Bookmark ID

### GET /lists/{listId}/bookmarks
Get bookmarks in a list (used by data provider for Inbox).

**Path Parameters:**
- `listId` (string, required): List ID

**Query Parameters:**
- `limit` (number, optional): Maximum results
- `cursor` (string, optional): Pagination cursor

## Highlights

### GET /highlights
Get all highlights.

**Query Parameters:**
- `limit` (number, optional): Maximum results
- `cursor` (string, optional): Pagination cursor

### GET /highlights/{highlightId}
Get a single highlight by ID.

**Path Parameters:**
- `highlightId` (string, required): Highlight ID

### POST /highlights
Create a new highlight.

**Request Body:**
```json
{
  "bookmarkId": "string",
  "startOffset": number,
  "endOffset": number,
  "color": "yellow|red|green|blue",
  "text": "string",
  "note": "string"
}
```

### DELETE /highlights/{highlightId}
Delete a highlight by ID.

**Path Parameters:**
- `highlightId` (string, required): Highlight ID

## Users

### GET /users/me
Get current user info.

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "email": "string"
}
```

### GET /users/me/stats
Get current user statistics.

**Response:**
```json
{
  "numBookmarks": number,
  "numFavorites": number,
  "numArchived": number,
  "numTags": number,
  "numLists": number,
  "numHighlights": number
}
```

## Assets

### PUT /bookmarks/{bookmarkId}/assets/{assetId}
Replace an asset.

**Path Parameters:**
- `bookmarkId` (string, required): Bookmark ID
- `assetId` (string, required): Asset ID

**Request Body:**
```json
{
  "assetId": "string"
}
```

### DELETE /bookmarks/{bookmarkId}/assets/{assetId}
Detach an asset from a bookmark.

**Path Parameters:**
- `bookmarkId` (string, required): Bookmark ID
- `assetId` (string, required): Asset ID

## Important Notes

1. **No `/tags/many` or `/lists/many` endpoints**: These don't exist in the Karakeep API
2. **Pagination**: Uses cursor-based pagination, not offset-based
3. **Authentication**: All endpoints require JWT bearer token
4. **Content inclusion**: Many endpoints have `includeContent` parameter for performance
5. **Tag/List relationships**: Must be managed through specific attachment endpoints, not through nested updates

## Frontend Integration Notes

- **Data Provider**: Must handle `getMany` for tags/lists by calling `GET /tags` and `GET /lists` then filtering
- **ReferenceArrayInput**: Cannot be used directly - requires custom components
- **Field Mapping**: Bookmark fields are likely flat structure, not nested under "content"
- **Authentication**: Handled automatically by axios interceptors in dataProvider