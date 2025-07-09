export function formatSize(bytes, precision = 2) {
    const units = ["B", "KB", "MB", "GB", "TB"];

    if (isNaN(bytes) || bytes <= 0) return "0 B";

    const pow = Math.min(
        Math.floor(Math.log(bytes) / Math.log(1024)),
        units.length - 1
    );
    const size = bytes / Math.pow(1024, pow);

    return `${size.toFixed(precision)} ${units[pow]}`;
}
