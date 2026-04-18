export function timeAgo(isoDateString: string): string {
    const inputDate = new Date(isoDateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - inputDate.getTime()) / 1000);

    const intervals = {
        second: 60,
        minute: 60 * 60,
        hour: 24 * 60 * 60,
        day: 30 * 24 * 60 * 60,
        month: 365 * 24 * 60 * 60,
        year: 365 * 24 * 60 * 60 * 1000
    };

    if (seconds < intervals.second) {
        return `${seconds} seconds ago`;
    } else if (seconds < intervals.minute) {
        const minutes = Math.floor(seconds / 60);
        return `${minutes} minutes ago`;
    } else if (seconds < intervals.hour) {
        const hours = Math.floor(seconds / (60 * 60));
        return `${hours} hours ago`;
    } else if (seconds < intervals.day) {
        const days = Math.floor(seconds / (24 * 60 * 60));
        return `${days} days ago`;
    } else if (seconds < intervals.month) {
        const months = Math.floor(seconds / (30 * 24 * 60 * 60));
        return `${months} months ago`;
    } else {
        const years = Math.floor(seconds / (365 * 24 * 60 * 60));
        return `${years} years ago`;
    }
}
