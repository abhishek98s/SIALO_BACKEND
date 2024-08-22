export const convertDateTime = (dtStr: string) => {
    const dt = new Date(dtStr);
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const year = dt.getFullYear();
    const month = months[dt.getMonth()];
    const day = dt.getDate();
    return `${year}, ${month} ${day}`;
}
