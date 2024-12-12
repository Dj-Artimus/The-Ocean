import { differenceInSeconds, differenceInMinutes, differenceInHours, differenceInDays, differenceInMonths, differenceInYears } from 'date-fns';


export const formatCount = (count) => {
    if (count < 1000) return count.toString(); // Less than 1k
    if (count < 1_000_000) return (count / 1_000).toFixed(1).replace(/\.0$/, '') + 'k'; // 1k to 999k
    if (count < 1_000_000_000) return (count / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'; // 1M to 999M
    return (count / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B'; // 1B+
}

export const getRandomNumber = (a, b) => {
    if (a > b) [a, b] = [b, a]; // Swap if a is greater than b
    return Math.floor(Math.random() * (b - a + 1)) + a;
}

export const getTime = (created_time) => {
    const now = new Date();
    const time = new Date(created_time);

    const seconds = differenceInSeconds(now, time);
    if (seconds < 60) return `${seconds}s`;

    const minutes = differenceInMinutes(now, time);
    if (minutes < 60) return `${minutes}m`;

    const hours = differenceInHours(now, time);
    if (hours < 24) return `${hours}h`;

    const days = differenceInDays(now, time);
    if (days < 30) return `${days}d`;

    const months = differenceInMonths(now, time);
    if (months < 12) return `${months}mo`;

    const years = differenceInYears(now, time);
    return `${years}y`;
};

export const formaterDateAndTime = (time) => {
    const formater = new Intl.DateTimeFormat('en-US', {
        year: '2-digit',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true // Ensure 12-hour format
    }).format(new Date(created_at));
    return formater;
}