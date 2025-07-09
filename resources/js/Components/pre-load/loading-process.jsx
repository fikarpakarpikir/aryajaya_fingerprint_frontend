import React from "react";

function LoadingProcess() {
    return (
    <div className="fixed-top bg-gradient-light h-100 opacity-6 d-none" id="loading">
        <div className="spinner-border position-absolute top-50 start-50" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    </div>
    )
}

export default LoadingProcess;