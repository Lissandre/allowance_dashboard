import Loader from "@/Components/Loader";
import { router } from "@inertiajs/react";
import { FC, useState } from "react";
import { toast } from "sonner";
import { injected, useAccount, useConnect, useDisconnect } from "wagmi";
import { FaSignOutAlt } from "react-icons/fa";
import AddressDisplay from "@/Components/AddressDisplay";

const Address: FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { address, isConnected } = useAccount();
    const { connect } = useConnect();
    const { disconnect } = useDisconnect();

    const handleConnect = async () => {
        if (isLoading) return;
        setIsLoading(true);
        const id = crypto.randomUUID();
        try {
            connect(
                {
                    connector: injected(),
                },
                {
                    onSuccess: (result) => {
                        router.post(
                            "/login",
                            { address: result.accounts[0] },
                            {
                                onSuccess: () => {
                                    toast.success("Successfully logged in", {
                                        id,
                                    });
                                    setIsLoading(false);
                                },
                                onError: () => {
                                    toast.error("Failed to login", {
                                        id,
                                    });
                                    setIsLoading(false);
                                },
                            }
                        );
                        setIsLoading(false);
                    },
                    onError: () => {
                        toast.error("Failed to connect wallet", {
                            id,
                        });
                        setIsLoading(false);
                    },
                }
            );
        } catch (error) {
            toast.error("Failed to connect wallet", {
                id,
            });
            setIsLoading(false);
        }
    };

    const handleDisconnect = () => {
        disconnect(
            {},
            {
                onSuccess: () => {
                    toast.success("Successfully disconnected wallet");
                },
                onError: () => {
                    toast.error("Failed to disconnect wallet");
                },
            }
        );
        router.post("/disconnect");
    };

    return (
        <div className="bg-white rounded-md flex gap-4 p-4 group">
            {isConnected && address ? (
                <div className="flex items-center space-x-4">
                    <AddressDisplay
                        address={address}
                        showCopy={false}
                        showTooltip={false}
                    />
                    <button
                        onClick={handleDisconnect}
                        title="Disconnect Wallet"
                    >
                        <FaSignOutAlt />
                    </button>
                </div>
            ) : (
                <button
                    onClick={handleConnect}
                    className="bg-black px-4 py-2 rounded text-white flex gap-2"
                >
                    {isLoading ? (
                        <>
                            <Loader />
                            Connecting...
                        </>
                    ) : (
                        "Connect Wallet"
                    )}
                </button>
            )}
        </div>
    );
};

export default Address;
