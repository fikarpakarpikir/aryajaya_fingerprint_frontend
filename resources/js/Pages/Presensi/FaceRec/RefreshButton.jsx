export const RefreshButton = ({ buttonRefresh }) => {
    return (
        buttonRefresh && (
            <div className="text-center">
                <button
                    onClick={() => location.reload()}
                    className="btn-primary font-bold rounded-full mx-auto text-center"
                >
                    Refresh halaman
                </button>
            </div>
        )
    );
};
