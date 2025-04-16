
export const convertDateTime = (dtStr: string) => {
  const dt = new Date(dtStr);
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const year = dt.getFullYear();
  const month = months[dt.getMonth()];
  const day = dt.getDate();
  return `${year}, ${month} ${day}`;
};

export const timeAgo = (dtStr: string) => {
  const dt = new Date(dtStr);
  const now = new Date();
  const diff = now.getTime() - dt.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) {
    return 'Just now';
  } else if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  } else if (hours < 24) {
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  } else {
    return `${days} day${days === 1 ? '' : 's'} ago`;
  }
};
