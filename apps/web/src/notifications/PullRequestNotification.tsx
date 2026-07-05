interface PullRequestNotificationProps {
  number: number;
  action?: string;
}

export function PullRequestNotificationBody({ number, action }: PullRequestNotificationProps) {
  return (
    <span>
      PR #{number} {action ?? "updated"}
    </span>
  );
}
