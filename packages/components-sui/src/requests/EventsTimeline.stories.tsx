import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { EventsTimeline } from "./EventsTimeline";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Container, Segment } from 'semantic-ui-react'
import { http, HttpResponse, delay } from 'msw';

import type { RequestEventResponseMetadata, RequestRecordMetadata, RequestTimelineResponse } from "@repo/core";

/**
 * A dynamic and interactive component for displaying a paginated timeline of events associated with a specific request.
 * The timeline supports auto-refreshing, pagination, and the ability to add comments via a submission form.
 *
 * Features:
 * - Fetches timeline events from the backend using React Query.
 * - Supports client-side pagination with customizable page sizes.
 * - Auto-refreshes the timeline at regular intervals (default: 10 seconds).
 * - Enables posting of comments, which are dynamically added to the timeline without a full refetch.
 * - Displays a loading indicator while fetching data and error messages in case of failures.
 *
 * Props:
 * - `request` (object): The request object containing metadata and links required for fetching timeline events.
 * - `timelinePageSize` (number): Number of events displayed per page in the timeline.
 *
 * Dependencies:
 * - React Query for data fetching and state management.
 * - Semantic UI for loading indicators, messages, and pagination.
 * - i18next for internationalization.
 */
const meta = {
  title: "🙏 Requests/EventsTimeline",
  component: EventsTimeline,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof EventsTimeline>;

export default meta;

type Story = StoryObj<typeof EventsTimeline>;


const mockRequest: RequestRecordMetadata = {
  id: 'request-1',
  title: 'Sample Request',
  links: {
    timeline: 'https://localhost/api/requests/1/timeline',
    comments: 'https://localhost/api/requests/1/comments'
  }
};

const mockTimelineCommentEvent: (index: number) => RequestEventResponseMetadata = (index) => {
  const id = crypto.randomUUID()

  return {
    "id": id,
    "created": "2025-01-09T09:23:26.006595+00:00",
    "updated": "2025-01-09T09:23:26.009686+00:00",
    "links": {
      "self": "https://localhost/api/requests/a/comments/" + id
    },
    "revision_id": 1,
    "type": "C",
    "created_by": {
      "user": "1"
    },
    "permissions": {
      "can_update_comment": true,
      "can_delete_comment": true
    },
    "payload": {
      "content": 'Comment #' + index,
      "format": "html"
    },
    "expanded": {
      "created_by": {
        "id": "1",
        "username": "Deleted user",
        "email": "",
        "profile": {
          "full_name": "Deleted user",
          "affiliations": ""
        },
        "links": {
          "avatar": "https://localhost/api/users/1/avatar.svg"
        },
        "blocked_at": null,
        "verified_at": null,
        "confirmed_at": null,
        "active": null,
        "is_current_user": null
      }
    }
  }
}

const mockTimelineResponse: (numOfEvents: number, pageSize?: number) => RequestTimelineResponse = (
  numOfEvents = 1,
  pageSize = 25
) => ({
  "hits": {
    "hits": Array.from({ length: pageSize }, (_, i) => mockTimelineCommentEvent(i)) as RequestEventResponseMetadata[],
    "total": numOfEvents
  },
  "sortBy": "newest",
  "links": {
    "self": "https://localhost/api/requests/a/timeline?expand=True&page=1&q=%21%28type%3AT%29&size=25&sort=newest"
  }
})

const queryClient = new QueryClient();


//👇 The EventsTimelineTemplate construct will be spread to the existing stories
// to provide basic UI app layout to all test cases.
const EventsTimelineTemplate: Story = {
  render: (args) => {
    return (
      <Container>
        <Segment basic>
          <QueryClientProvider client={queryClient}>
            <EventsTimeline {...args} />
          </QueryClientProvider>
        </Segment>
      </Container>
    );
  },
};

/**
 * Timeline renders without any (network errors) and there
 * are some events on the request.
 */
export const Success: Story = {
  ...EventsTimelineTemplate,
  args: {
    request: mockRequest,
  },
  parameters: {
    msw: {
      handlers: [
        http.get(mockRequest.links.timeline, async () => {
          await delay(800);
          return HttpResponse.json(mockTimelineResponse(5));
        }),
      ],
    }
  }
} satisfies Story

/**
 * There's a backend or network error while fetching timeline data
 */
export const NetworkError: Story = {
  ...EventsTimelineTemplate,
  args: {
    request: mockRequest,
  },
  parameters: {
    msw: {
      handlers: [
        http.get(mockRequest.links.timeline, async () => {
          await delay(800);
          return HttpResponse.error()
        }),
      ],
    },
  },
} satisfies Story

/**
 * There are more results than what can fit on a single page
 */
export const Paginated: Story = {
  ...EventsTimelineTemplate,
  args: {
    request: mockRequest,
    timelinePageSize: 6,
  },
  parameters: {
    msw: {
      handlers: [
        http.get(mockRequest.links.timeline, async ({ request }) => {
          const url = new URL(request.url)
          const pageSize = parseInt(url.searchParams.get('size')!)
          const page = parseInt(url.searchParams.get('page')!)

          await delay(800);
          return HttpResponse.json(mockTimelineResponse(10, page === 1 ? pageSize : 10 - pageSize));
        }),
      ],
    },
  },
} satisfies Story

/**
 * There are no events on a request
 */
export const NoData: Story = {
  ...EventsTimelineTemplate,
  args: {
    request: mockRequest,
  },
  parameters: {
    msw: {
      handlers: [
        http.get(mockRequest.links.timeline, async ({ request }) => {
          await delay(800);
          return HttpResponse.json(mockTimelineResponse(0, 0));
        }),
      ],
    },
  },
} satisfies Story


