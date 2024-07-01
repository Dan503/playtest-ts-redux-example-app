import { formatDistanceToNow, parseISO } from 'date-fns'

interface TimeAgoProps {
  isoTime: string
}

export function TimeAgo({ isoTime }: TimeAgoProps) {
  const date = parseISO(isoTime)
  const timePeriod = formatDistanceToNow(date)

  const timeAgo = `${timePeriod} ago`

  return (
    <time dateTime={isoTime} title={isoTime}>
      <i>{timeAgo}</i>
    </time>
  )
}
