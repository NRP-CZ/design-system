import { renderHook, act } from "@testing-library/react-hooks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRequestTimeline } from "./use-request";
import type { ComponentProps, RequestRecordMetadata, RequestTimelineResponse } from "../types";

import { apiClient } from '../client'; // Mocked API client
import { withSupressedConsoleErrors } from "../tests";

jest.mock("../client");

// Use this wrapper to provide the `QueryClientProvider` context
const wrapper: React.FC<ComponentProps<{}>> = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
};

describe("useRequestTimeline", () => {
  const mockRequest: RequestRecordMetadata = {
    id: "test-request-id",
    links: {
      timeline: "https://example.com/timeline",
    },
  };

  const mockResponse: RequestTimelineResponse = {
    hits: {
      hits: [
        {
          id: "event1",
          type: "C",
          created: "2025-01-09T09:23:26.006595+00:00",
          updated: "2025-01-09T09:23:26.006595+00:00",
          links: {
            self: "https://example.com/event1",
          },
          revision_id: 1,
          created_by: { user: "123" },
          permissions: {
            can_update_comment: true,
            can_delete_comment: true,
          },
          payload: {
            content: "<p>Event 1</p>",
            format: "html",
          },
          expanded: {
            created_by: {
              id: "123",
              username: "test-user",
              email: "test@example.com",
              profile: {
                full_name: "Test User",
                affiliations: "",
              },
              links: {
                avatar: "https://example.com/avatar.png",
              },
              blocked_at: null,
              verified_at: null,
              confirmed_at: null,
              active: true,
              is_current_user: true,
            },
          },
        },
        {
          id: "event2",
          type: "C",
          created: "2025-01-09T09:25:00.000000+00:00",
          updated: "2025-01-09T09:25:00.000000+00:00",
          links: {
            self: "https://example.com/event2",
          },
          revision_id: 2,
          created_by: { user: "124" },
          permissions: {
            can_update_comment: false,
            can_delete_comment: false,
          },
          payload: {
            content: "<p>Event 2</p>",
            format: "html",
          },
          expanded: {
            created_by: {
              id: "124",
              username: "another-user",
              email: "another@example.com",
              profile: {
                full_name: "Another User",
                affiliations: "Company",
              },
              links: {
                avatar: "https://example.com/avatar2.png",
              },
              blocked_at: null,
              verified_at: null,
              confirmed_at: null,
              active: true,
              is_current_user: false,
            },
          },
        },
      ],
      total: 2,
    },
    sortBy: "newest",
    links: {
      self: "https://example.com/timeline",
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches timeline data successfully", async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({ data: mockResponse });

    // Render the hook
    const { result, waitForNextUpdate } = renderHook(
      () =>
        useRequestTimeline({
          request: {
            id: "123",
            links: { timeline: "https://example.com/timeline" },
          },
          pageSize: 2
        }),
      { wrapper }
    );

    // Wait for the data to load
    await waitForNextUpdate();

    expect(apiClient.get).toHaveBeenCalledWith(
      `${mockRequest.links!.timeline}?q=!(type:T)&page=1&size=2&sort=newest&expand=1`
    );
    expect(result.current.timelineData).toEqual(mockResponse);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("handles errors while fetching timeline data", async () => {
    const errorMessage = "Failed to fetch timeline data";
    (apiClient.get as jest.Mock).mockRejectedValue(new Error(errorMessage));

    let result, waitForNextUpdate = undefined

    withSupressedConsoleErrors(async () => {
      // Render the hook
      const { result, waitForNextUpdate } = renderHook(
        () => useRequestTimeline({
          request: mockRequest,
        }),
        { wrapper }
      );

      await waitForNextUpdate()
      waitFor(() => expect(apiClient.get as jest.Mock).toHaveBeenCalled());

      expect(result.current.error as Error).toBeDefined();

      const returnedError = result.current.error! as Error
      expect(returnedError.message).toBe(errorMessage);
      expect(result.current.timelineData).toBeUndefined();
      expect(result.current.isLoading).toBe(false);
    })
  });

  it("changes page and fetches new data", async () => {
    (apiClient.get as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

    // Render the hook
    const { result, waitForNextUpdate } = renderHook(
      () => useRequestTimeline({
        request: mockRequest,
      }),
      { wrapper }
    )

    await waitForNextUpdate();

    expect(result.current.timelineData).toBeDefined();
    expect(apiClient.get).toHaveBeenCalledTimes(1);

    const newResponse = {
      ...mockResponse,
      hits: {
        ...mockResponse.hits,
        hits: [{ id: "event3", type: "C", payload: { content: "Event 3" } }],
      },
    };

    (apiClient.get as jest.Mock).mockResolvedValueOnce({ data: newResponse });

    act(() => {
      result.current.changePage(2)
    })

    // Wait for update after changing page
    await new Promise((resolve) => setTimeout(resolve, 0));

    await waitForNextUpdate();

    expect(result.current.currentPage).toBe(2);
    expect(apiClient.get as jest.Mock).toHaveBeenCalledTimes(2)

    expect(apiClient.get as jest.Mock).toHaveBeenCalledWith(
      `${mockRequest.links!.timeline}?q=!(type:T)&page=1&size=25&sort=newest&expand=1`
    );
    expect(result.current.timelineData).toEqual(newResponse);
  });

  it("does not fetch data for the same page", async () => {
    // Render the hook
    const { result, waitForNextUpdate } = renderHook(
      () => useRequestTimeline({
        request: mockRequest,
      }),
      { wrapper }
    )

    await waitForNextUpdate();

    result.current.changePage(1);

    expect(result.current.currentPage).toBe(1);
    expect(apiClient.get).toHaveBeenCalledTimes(1);
  });

  it("respects refetchOnWindowFocus and refetchInterval options", async () => {
    const { refetch } = useRequestTimeline({
      request: mockRequest,
      refetchOnWindowFocus: true,
      refetchInterval: 600,
    })

    expect(refetch).toBeDefined();

    await new Promise((r) => setTimeout(r, 800));

    expect(apiClient.get).toHaveBeenCalledTimes(2);
  });
});

function waitFor (arg0: () => void) {
  throw new Error("Function not implemented.");
}
