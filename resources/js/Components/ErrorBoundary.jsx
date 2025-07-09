import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("React UI Error:", error, errorInfo);
    }

    render() {
        const handleSendWA = () => {
            const errorMessage = `*Ada Error*
Masalah Utama:
${this.state.error?.message}

Terjadi pada:
${this.state.error?.stack?.split("\n").slice(0, 3).join("\n")}
`;
            const text = encodeURIComponent(errorMessage);
            const waLink = `https://wa.me/6289646615484?text=${text}`;
            window.open(waLink, "_blank");
        };

        if (this.state.hasError) {
            const { error, errorInfo } = this.state;
            return (
                <div className="min-h-screen flex items-center">
                    <div className="shadow-lg rounded-lg m-auto max-w-lg overflow-hidden">
                        <div className="p-4 bg-primary shadow-lg text-white rounded-lg">
                            <h2 className="text-lg font-semibold">
                                Maaf, ada kesalahan sistem.
                            </h2>
                            <h4>
                                Silakan klik "Laporkan Error" untuk melaporan
                                error ini
                            </h4>
                        </div>
                        <div className="p-4 bg-sky-50 shadow-lg text-sky-700 text-balance">
                            {/* <p>
                                {this.state.error?.message ||
                                    "An unknown error occurred."}
                            </p> */}
                            <span className="font-bold">Masalah Utama:</span>
                            <pre className="whitespace-pre-wrap break-words">
                                {error?.message}
                            </pre>
                            <br />
                            <span className="font-bold">Terjadi pada:</span>
                            <div className="text-pretty">
                                {error.stack
                                    .split("\n")
                                    .slice(0, 6)
                                    .map((line, idx) => (
                                        <div key={idx}>{line}</div>
                                    ))}
                            </div>
                            {errorInfo?.componentStack && (
                                <div className="mb-2">
                                    <span className="font-semibold block">
                                        Component Stack:
                                    </span>
                                    <pre className="text-xs bg-red-100 p-2 rounded font-mono overflow-x-auto max-h-32 whitespace-pre-wrap">
                                        {errorInfo.componentStack}
                                    </pre>
                                </div>
                            )}
                            <div className="flex justify-center gap-2">
                                <button
                                    onClick={() => location.reload()}
                                    className="mt-2 px-4 py-2 bg-amber-500 text-white rounded-lg"
                                >
                                    Refresh
                                </button>
                                <button
                                    onClick={() =>
                                        this.setState({ hasError: false })
                                    }
                                    className="mt-2 px-4 py-2 bg-sky-500 text-white rounded-lg"
                                >
                                    Coba lagi
                                </button>
                                <button
                                    onClick={handleSendWA}
                                    className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg"
                                >
                                    <FontAwesomeIcon
                                        icon={faWhatsapp}
                                        className="me-1"
                                    />
                                    Laporkan Error
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
