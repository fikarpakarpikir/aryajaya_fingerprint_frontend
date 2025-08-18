export const measureNetworkSpeed = async () => {
    const startTime = new Date().getTime();

    try {
        // Replace 'https://example.com/test-file' with a URL to a small test file
        const response = await fetch("/assets/cover-aj.jpg");

        // Calculate the download speed in kilobits per second
        const contentLength = response.headers.get("Content-Length");
        const duration = new Date().getTime() - startTime;
        const speedKbps = contentLength / 1024 / (duration / 1000);

        // Convert speed to megabits per second
        const speedMbps = speedKbps / 1024;
        // console.log(speedMbps);
        return speedMbps;
    } catch (error) {
        console.error("Network request failed:", error);
        return null;
    }
};
