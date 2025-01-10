/**
 * OARepo-requests related types
 */

export interface RequestTimelineResponse {
  hits: {
    hits: RequestEventResponseMetadata[];
    total: number;
  };
  sortBy: string;
  links: {
    self: string;
  };
}

/**
 * Request record metadata
 */
export interface RequestRecordMetadata {
  /**
   * Unique identifier of the request.
   */
  id: string;

  /**
   * Links object containing various endpoints related to the request.
   */
  links?: {
    /**
     * URL for fetching the timeline events associated with the request.
     */
    timeline?: string;

    /**
     * URL for posting comments on the request.
     */
    comments?: string;

    /**
     * Other optional links related to the request.
     */
    [key: string]: string | undefined;
  };
  [key: string]: any;
}

/**
 * Metadata for creating an event on a request.
 */
export interface RequestEventMetadata {
  payload: {
    content: string;
    format: "html";
  };
}

/**
 * Metadata response of a single event happend on request record.
 */
export interface RequestEventResponseMetadata extends RequestEventMetadata {
  id: string;
  created: string;
  updated: string;
  links: {
    self: string;
  };
  revision_id: number;
  type: string;
  created_by: {
    user: string;
  };
  permissions: {
    can_update_comment: boolean;
    can_delete_comment: boolean;
  };
  expanded: {
    created_by: {
      id: string;
      username: string;
      email: string;
      profile: {
        full_name: string;
        affiliations: string;
      };
      links: {
        avatar: string;
      };
      blocked_at: string | null;
      verified_at: string | null;
      confirmed_at: string | null;
      active: boolean | null;
      is_current_user: boolean | null;
    };
  };
}
