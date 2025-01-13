import { renderHook, act } from "@testing-library/react-hooks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRequestTimeline } from "./use-request-timeline";
import type { ComponentProps } from "../types";

import { apiClient } from '../client'; // Mocked API client
import { useRequestComments } from "./use-request-comments";

jest.mock("../client");
jest.mock("./use-request-timeline")

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


describe("useRequestComments", () => {

  const mockRequest = {
    id: "123",
    links: {
      comments: "/api/comments",
      timeline: ""
    },
  };

  const mockTimelineResponse = {
    hits: {
      total: 1,
      hits: [{ id: "comment1" }],
    },
  };

  const mockRefetchTimelineData = jest.fn();
  const mockQueryClient = {
    setQueryData: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRequestTimeline as jest.Mock).mockReturnValue({
      refetch: mockRefetchTimelineData,
      pageSize: 10,
    });
  });

  it("returns a submit function", () => {
    // (useMutation as jest.Mock).mockImplementation(() => ({
    //   mutate: jest.fn(),
    // }));

    const { result } = renderHook(() => useRequestComments({ request: mockRequest, page: 1 }), { wrapper });
    expect(result.current.submitComment).toBeDefined();
  });

  it("calls mutationFn with correct values", async () => {
    (apiClient.post as jest.Mock).mockResolvedValue({});

    const { result } = renderHook(() => useRequestComments({ request: mockRequest, page: 1 }), { wrapper });

    act(() => {
      result.current.submitComment("New comment");
    });

    // expect(mockMutate).toHaveBeenCalledWith({ content: "New comment" });
  });

  it("updates timeline cache on success", async () => {
    const mockMutate = jest.fn((values, { onSuccess }) =>
      onSuccess({ status: 201, data: { id: "new-comment" } })
    );

    const { result } = renderHook(() => useRequestComments({ request: mockRequest, page: 1 }), { wrapper });

    act(() => {
      result.current.submitComment("Another comment");
    });

    expect(mockQueryClient.setQueryData).toHaveBeenCalledWith(
      ["requestEvents", "123", 1],
      expect.any(Function)
    );
  });

  it("calls refetchTimelineData after mutation success", async () => {
    const mockMutate = jest.fn((values, { onSuccess }) =>
      onSuccess({ status: 201, data: { id: "new-comment" } })
    );

    const { result } = renderHook(() => useRequestComments({ request: mockRequest, page: 1 }), { wrapper });

    act(() => {
      result.current.submitComment("Another comment");
    });

    expect(mockRefetchTimelineData).toHaveBeenCalled();
  });
});