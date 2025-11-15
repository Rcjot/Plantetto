export default function timeAgo(dateString: string) {
    const date = new Date(dateString);
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    if (seconds >= 31536000) {
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    }

    if (seconds >= 86400) {
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    }

    const intervals = {
        h: 3600,
        min: 60,
    };

    for (const [unit, value] of Object.entries(intervals)) {
        const diff = Math.floor(seconds / value);
        if (diff >= 1) return `${diff}${unit}`;
    }

    return "just now";
}
