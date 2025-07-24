function ItemErrorWrapper({ showErr, children }) {
    if (showErr) {
        return (
            <div className="empty-chart-text-wrapper">
                <div className="empty-chart-text">Insufficient Data</div>
            </div>
        );
    }

    return <>{children}</>;
}

export default ItemErrorWrapper;