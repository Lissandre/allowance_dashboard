type EmptyDataProps = {
    statement?: string;
    actionTitle?: string;
    action?: () => void;
};

const EmptyData = ({
    statement = "No data available",
    actionTitle = "Retry",
    action,
}: EmptyDataProps) => {
    return (
        <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">{statement}</p>
            {action && (
                <button className="" onClick={action}>
                    {actionTitle}
                </button>
            )}
        </div>
    );
};

export default EmptyData;
