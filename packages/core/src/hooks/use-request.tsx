import * as React from "react";
import { useMutation, useQueryClient, useQuery, type UseQueryOptions, type QueryKey } from "@tanstack/react-query";
import { apiClient } from "../client";

import type { RequestEventMetadata, RequestRecordMetadata, RequestTimelineResponse } from "../types";

export function useRequestComments (
  request: RequestRecordMetadata,
  page: number = 1
) {
  const queryClient = useQueryClient();
  const { refetch: refetchTimelineData, pageSize: timelinePageSize, requestEventsQuery } =
    useRequestTimeline({ request });

  const updatedComments = (currentComments: RequestTimelineResponse | undefined) => {
    if (!currentComments) return;
    // a bit ugly, but it is a limitation of react query when data you recieve is nested
    const newComments = [...currentComments.hits.hits];
    if (currentComments.hits.total + 1 > timelinePageSize) {
      newComments.pop();
    }
    return {
      ...currentComments,
      hits: {
        ...currentComments.hits,
        total: currentComments.hits.total + 1,
        hits: [...currentComments.hits.hits, ...newComments],
      },
    };
  }

  async function submitCommentFn (comment: RequestEventMetadata) {
    return apiClient.post(request.links?.comments + "?expand=1", comment)
  }

  const submit = React.useCallback(
    () =>
      useMutation({
        mutationFn: submitCommentFn,
        onSuccess: (response) => {
          if (response.status === 201) {
            queryClient.setQueryData(requestEventsQuery, updatedComments);
          }
          setTimeout(() => refetchTimelineData(), 1000);
        },
      }),
    [request, page]
  );

  return { submit };
}

export type UseRequestTimelineProps = {
  request: RequestRecordMetadata;
  pageSize?: number;
  refetchOnWindowFocus?: boolean;
  refetchInterval?: number;
};


export function useRequestTimeline ({
  request,
  pageSize = 25,
  refetchOnWindowFocus = false,
  refetchInterval = 10000,
}: UseRequestTimelineProps) {
  const [page, setPage] = React.useState(1);

  const requestEventsQuery: QueryKey = ["requestEvents", request.id, page]

  async function fetchTimelineData (): Promise<RequestTimelineResponse> {
    return apiClient.get(
      // q=!(type:T) to eliminate system created events
      `${request.links?.timeline}?q=!(type:T)&page=${page}&size=${pageSize}&sort=newest&expand=1`
    ).then(response => response.data)
  }

  const {
    data: timelineData,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: requestEventsQuery,
    queryFn: fetchTimelineData,
    // select: (data) => data.data,
    enabled: !!request.links?.timeline,
    // when you click on rich editor and then back to the window, it considers
    // that this is focus on the window itself, so unable to use refetchOnWindowFocus
    refetchOnWindowFocus: refetchOnWindowFocus,
    refetchInterval: refetchInterval,
    throwOnError: true
  } as UseQueryOptions<RequestTimelineResponse, Error>);

  const changePage = React.useCallback(
    (newPage: number) => {
      if (newPage === page) return;
      setPage(newPage);
    },
    [page]
  );

  return {
    timelineData,
    error,
    isLoading,
    refetch,
    currentPage: page,
    changePage,
    pageSize,
    requestEventsQuery
  };
}

export function useRequest (request: RequestRecordMetadata) {
  // const comments = useRequestComments(request);

  // return { comments };
}
