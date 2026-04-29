import { format, parseISO } from "date-fns";
export function formatDateTime(dateString: string) {
  return format(parseISO(dateString), "MMM d, yyyy 'at' h:mm a");
}
