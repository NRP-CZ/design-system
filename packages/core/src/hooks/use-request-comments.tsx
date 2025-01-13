import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../client";

import type { RequestEventMetadata, RequestRecordMetadata, RequestTimelineResponse } from "../types";
import { useRequestTimeline } from "./use-request-timeline";


export type UseRequestCommentsProps = {
  request: RequestRecordMetadata;
  page?: number;
};

export function useRequestComments ({
  request,
  page = 1
}: UseRequestCommentsProps) {
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

  const submitComment = React.useCallback(
    (comment: string) =>
      useMutation({
        mutationFn: () => submitCommentFn({ payload: { content: comment, format: 'html' } }),
        onSuccess: (response) => {
          if (response.status === 201) {
            queryClient.setQueryData(requestEventsQuery, updatedComments);
          }
          setTimeout(() => refetchTimelineData(), 1000);
        },
      }),
    [request, page]
  );

  return { submitComment };
}
