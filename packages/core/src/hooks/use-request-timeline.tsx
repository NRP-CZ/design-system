import * as React from "react";
import { useQuery, type UseQueryOptions, type QueryKey } from "@tanstack/react-query";
import { apiClient } from "../client";

import type { RequestRecordMetadata, RequestTimelineResponse } from "../types";


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