import {
  parseISO,
  format,
  isToday,
  isYesterday,
  isThisWeek,
  isThisMonth,
  differenceInDays,
} from "date-fns";

export function formatDate(
  dateString: string,
  dateFormat: string = "MMMM dd, yyyy - hh:mm a"
) {
  const dateFromISO = parseISO(dateString);

  return format(dateFromISO, dateFormat);
}

export const getDateLabel = (dateString: string) => {
  const itemDate = new Date(dateString);
  let label = "";

  if (isToday(itemDate)) {
    label = "Today";
  } else if (isYesterday(itemDate)) {
    label = "Yesterday";
    // } else if (isThisWeek(itemDate)) {
    //   label = "Last Week";
    // } else if (isThisMonth(itemDate)) {
    //   label = "Last Month";
  } else {
    const daysDiff = differenceInDays(new Date(), itemDate);
    if (daysDiff < 30) {
      label = format(itemDate, "MMMM dd");
    } else {
      label = format(itemDate, "yyyy/MM/dd");
    }
  }

  return label;
};
