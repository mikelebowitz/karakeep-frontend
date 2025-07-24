import axiosInstance from "../lib/axios";

/**
 * Local graph service for tracking bookmark-to-list membership
 * Provides O(1) lookups by building membership data at session start
 */
export class ListMembershipGraph {
  private membershipMap = new Map<string, string[]>();
  private isInitialized = false;
  private initializationPromise: Promise<void> | null = null;

  /**
   * Initialize the graph by fetching all lists and their bookmarks
   * Call this once at session start after authentication
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return Promise.resolve();
    }

    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this.buildMembershipGraph();
    return this.initializationPromise;
  }

  private async buildMembershipGraph(): Promise<void> {
    try {
      console.log("🏗️ Building list membership graph...");
      
      // Fetch all user's lists
      const { data: listsResponse } = await axiosInstance.get('/lists');
      const lists = listsResponse.lists || [];
      
      console.log(`📋 Found ${lists.length} lists, fetching membership data...`);

      // For each list, fetch its bookmarks and build the membership map
      const membershipPromises = lists.map(async (list: any) => {
        try {
          const { data: bookmarksResponse } = await axiosInstance.get(`/lists/${list.id}/bookmarks`);
          const bookmarks = Array.isArray(bookmarksResponse) ? bookmarksResponse : bookmarksResponse.bookmarks || [];
          
          // Add each bookmark to the membership map
          bookmarks.forEach((bookmark: any) => {
            const bookmarkId = bookmark.id;
            const currentLists = this.membershipMap.get(bookmarkId) || [];
            if (!currentLists.includes(list.id)) {
              currentLists.push(list.id);
              this.membershipMap.set(bookmarkId, currentLists);
            }
          });
        } catch (error) {
          console.warn(`⚠️ Failed to fetch bookmarks for list ${list.id}:`, error);
        }
      });

      await Promise.all(membershipPromises);
      
      this.isInitialized = true;
      console.log(`✅ List membership graph built successfully! Tracking ${this.membershipMap.size} bookmarks.`);
      
    } catch (error) {
      console.error("❌ Failed to build list membership graph:", error);
      this.initializationPromise = null;
      throw error;
    }
  }

  /**
   * Get all list IDs that contain the given bookmark
   * Returns empty array if bookmark is not in any lists
   */
  getListsForBookmark(bookmarkId: string): string[] {
    if (!this.isInitialized) {
      console.warn("⚠️ List membership graph not initialized yet");
      return [];
    }

    return this.membershipMap.get(bookmarkId) || [];
  }

  /**
   * Add a bookmark to a list (updates both local graph and API)
   */
  async addBookmarkToList(bookmarkId: string, listId: string): Promise<void> {
    try {
      // Update API first
      await axiosInstance.put(`/lists/${listId}/bookmarks/${bookmarkId}`);
      
      // Update local graph
      const currentLists = this.membershipMap.get(bookmarkId) || [];
      if (!currentLists.includes(listId)) {
        currentLists.push(listId);
        this.membershipMap.set(bookmarkId, currentLists);
      }
      
      console.log(`✅ Added bookmark ${bookmarkId} to list ${listId}`);
    } catch (error) {
      console.error(`❌ Failed to add bookmark ${bookmarkId} to list ${listId}:`, error);
      throw error;
    }
  }

  /**
   * Remove a bookmark from a list (updates both local graph and API)
   */
  async removeBookmarkFromList(bookmarkId: string, listId: string): Promise<void> {
    try {
      // Update API first  
      await axiosInstance.delete(`/lists/${listId}/bookmarks/${bookmarkId}`);
      
      // Update local graph
      const currentLists = this.membershipMap.get(bookmarkId) || [];
      const filteredLists = currentLists.filter(id => id !== listId);
      
      if (filteredLists.length === 0) {
        this.membershipMap.delete(bookmarkId);
      } else {
        this.membershipMap.set(bookmarkId, filteredLists);
      }
      
      console.log(`✅ Removed bookmark ${bookmarkId} from list ${listId}`);
    } catch (error) {
      console.error(`❌ Failed to remove bookmark ${bookmarkId} from list ${listId}:`, error);
      throw error;
    }
  }

  /**
   * Add a bookmark to multiple lists at once
   */
  async addBookmarkToLists(bookmarkId: string, listIds: string[]): Promise<void> {
    const promises = listIds.map(listId => this.addBookmarkToList(bookmarkId, listId));
    await Promise.all(promises);
  }

  /**
   * Check if the graph is ready for use
   */
  isReady(): boolean {
    return this.isInitialized;
  }

  /**
   * Reset the graph (useful for logout or re-initialization)
   */
  reset(): void {
    this.membershipMap.clear();
    this.isInitialized = false;
    this.initializationPromise = null;
    console.log("🔄 List membership graph reset");
  }

  /**
   * Get debug information about the graph state
   */
  getDebugInfo(): { bookmarkCount: number; totalMemberships: number } {
    const totalMemberships = Array.from(this.membershipMap.values())
      .reduce((sum, lists) => sum + lists.length, 0);
    
    return {
      bookmarkCount: this.membershipMap.size,
      totalMemberships
    };
  }
}

// Export singleton instance
export const listMembershipGraph = new ListMembershipGraph();