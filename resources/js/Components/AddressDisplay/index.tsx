import { useEnsName, useEnsAvatar } from "wagmi";
import { useMemo } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FaCopy } from "react-icons/fa";
import { toast } from "sonner";
import EtherscanLink from "@/Components/EtherscanLink";

interface AddressDisplayProps {
    address: `0x${string}`;
    className?: string;
    network?: string;
    withLink?: boolean;
    showCopy?: boolean;
    showTooltip?: boolean;
}

const AddressDisplay = ({
    address,
    className,
    network = "holesky",
    withLink = false,
    showCopy = true,
    showTooltip = true,
}: AddressDisplayProps) => {
    const { data: ensName, isLoading: isEnsLoading } = useEnsName({
        address: address,
    });
    const { data: ensAvatar } = useEnsAvatar({
        name: ensName || "",
    });

    const truncatedAddress = useMemo(() => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }, [address]);

    const displayAddress = useMemo(() => {
        return ensName || truncatedAddress;
    }, [ensName, truncatedAddress]);

    if (isEnsLoading) {
        return (
            <div className={`flex items-center gap-2 ${className}`}>
                <div className="animate-pulse flex space-x-2">
                    <div className="rounded-full bg-gray-200 h-4 w-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
            </div>
        );
    }

    return (
        <div className={`group relative flex items-center gap-2 ${className}`}>
            {ensAvatar && (
                <img
                    src={ensAvatar}
                    alt={ensName || address}
                    className="w-4 h-4 rounded-full"
                    loading="lazy"
                />
            )}
            <span
                className="cursor-default select-none"
                title={showTooltip ? address : undefined}
            >
                {withLink ? (
                    <EtherscanLink network={network} address={address}>
                        {displayAddress}
                    </EtherscanLink>
                ) : (
                    displayAddress
                )}
            </span>

            {showCopy && (
                <CopyToClipboard
                    text={address}
                    onCopy={() => toast.success("Address copied")}
                >
                    <button
                        type="button"
                        className="ml-2 p-1 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 rounded"
                        aria-label="Copy address"
                    >
                        <FaCopy />
                    </button>
                </CopyToClipboard>
            )}
        </div>
    );
};

export default AddressDisplay;
