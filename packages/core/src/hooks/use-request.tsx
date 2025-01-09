import * as React from "react";
import { useMutation, useQueryClient, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { apiClient } from "../client";

import type { RequestRecordMetadata, RequestTimelineResponse } from "../types";
import type { AxiosError, AxiosResponse } from "axios";

// export function useRequestComments (
//   request: RequestRecordMetadata,
//   page: number = 1
// ) {
//   const queryClient = useQueryClient();
//   const { refetch: refetchTimelineData, pageSize: timelinePageSize } =
//     useRequestTimeline({ request });

//   const submit = React.useCallback(
//     () =>
//       useMutation({
//         mutationFn: (values) =>
//           apiClient.post(request.links?.comments + "?expand=1", values),
//         onSuccess: (response) => {
//           if (response.status === 201) {
//             queryClient.setQueryData(
//               ["requestEvents", request.id, page],
//               (oldData: RequestTimelineResponse) => {
//                 if (!oldData) return;
//                 // a bit ugly, but it is a limitation of react query when data you recieve is nested
//                 const newHits = [...oldData.hits.hits];
//                 if (oldData.hits.total + 1 > timelinePageSize) {
//                   newHits.pop();
//                 }
//                 return {
//                   ...oldData,
//                   data: {
//                     ...oldData,
//                     hits: {
//                       ...oldData.hits,
//                       total: oldData.hits.total + 1,
//                       hits: [response.data, ...newHits],
//                     },
//                   },
//                 };
//               }
//             );
//           }
//           setTimeout(() => refetchTimelineData(), 1000);
//         },
//       }),
//     [request, page]
//   );

//   return { submit };
// }

export type UseRequestTimelineProps = {
  request: RequestRecordMetadata;
  pageSize?: number;
  refetchOnWindowFocus?: boolean;
  refetchInterval?: number;
};

export interface UseRequestTimelineReturn {
  timelineData: RequestTimelineResponse | undefined;
  error: Error | null;
  isLoading: boolean;
  refetch: () => void;
  currentPage: number;
  changePage: (newPage: number) => void;
  pageSize: number;
}

export function useRequestTimeline ({
  request,
  pageSize = 25,
  refetchOnWindowFocus = false,
  refetchInterval = 10000,
}: UseRequestTimelineProps): UseRequestTimelineReturn {
  const [page, setPage] = React.useState(1);

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
    queryKey: ["requestEvents", request.id, page],
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
  };
}

export function useRequest (request: RequestRecordMetadata) {
  // const comments = useRequestComments(request);

  // return { comments };
}
