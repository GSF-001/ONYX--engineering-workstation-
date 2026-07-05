interface MergeNotificationProps {
  number: number;
  title: string;
}

export function MergeNotificationBody({ number, title }: MergeNotificationProps) {
  return (
    <span>
      #{number} “{title}” merged
    </span>
  );
}
