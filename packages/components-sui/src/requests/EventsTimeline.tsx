import { Message, Feed, Dimmer, Loader, Pagination } from "semantic-ui-react";

import type { ComponentProps, RequestEventMetadata, RequestRecordMetadata } from "@repo/core";
import { defaultT, translated, type TranslatedProps } from "@nrp-cz/internationalization";
import { useRequestTimeline } from "@repo/core";

export type EventsTimelineProps = ComponentProps<{
    request: RequestRecordMetadata,
    timelinePageSize: number
}> & TranslatedProps

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
 *
 * Usage:
 * ```jsx
 * <Timeline request={requestData} timelinePageSize={10} />
 * ```
 */
export function EventsTimelineFn ({ request, timelinePageSize = 25, t = defaultT }: EventsTimelineProps): JSX.Element {

    const { timelineData, isLoading, error, changePage, currentPage } = useRequestTimeline({ request, pageSize: timelinePageSize })

    const events: RequestEventMetadata[] | undefined = timelineData?.hits.hits;
    const totalEventsNum: number = timelineData?.hits?.total || 0
    const totalPages = Math.ceil(totalEventsNum / timelinePageSize);
    const hasEvents = !!events && events.length > 0

    console.log({ timelineData, events, totalEventsNum, totalPages, hasEvents, isLoading, error, timelinePageSize })

    return (
        <Dimmer.Dimmable blurring dimmed={isLoading}>
            <Dimmer active={isLoading} inverted>
                <Loader indeterminate size="big">
                    {t("Loading timeline...")}
                </Loader>
            </Dimmer>
            <div className="rel-mb-5">
                {/* <CommentSubmitForm commentSubmitMutation={commentSubmitMutation} /> */}
            </div>
            {error && (
                <Message negative>
                    <Message.Header>
                        {t("Error while fetching timeline events")}
                    </Message.Header>
                </Message>
            )}
            {hasEvents && (
                <Feed>
                    {events.map((event, id) => (
                        <span key={id}>{event.payload.content}</span>
                        // <TimelineEvent
                        //     key={event.id}
                        //     event={event}
                        //     // necessary for query invalidation and setting state of the request events query
                        //     requestId={request.id}
                        //     page={page}
                        // />
                    ))}
                </Feed>
            )}
            {totalEventsNum > timelinePageSize && (
                <div className="centered rel-mb-1">
                    <Pagination
                        size="mini"
                        activePage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(_, { activePage }) => changePage(activePage)}
                        ellipsisItem={null}
                        firstItem={null}
                        lastItem={null}
                    />
                </div>
            )}
        </Dimmer.Dimmable>
    );
};

export const EventsTimeline = translated(EventsTimelineFn);
