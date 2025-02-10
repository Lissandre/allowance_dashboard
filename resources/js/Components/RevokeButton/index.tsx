import { config } from "@/Lib/wagmi";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import { erc20Abi } from "viem";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";

type RevokedButtonProps = {
    allowance: {
        id: number;
        contract_address: `0x${string}`;
        spender_address: `0x${string}`;
    };
};

const RevokedButton = ({ allowance }: RevokedButtonProps) => {
    const { id: allowance_id, contract_address, spender_address } = allowance;
    const { writeContract, data: hash } = useWriteContract();
    const { isLoading } = useWaitForTransactionReceipt({
        hash,
    });

    const handleRevoke = async () => {
        const id = toast.loading("Preparing to revoke allowance...");
        await writeContract(
            {
                address: contract_address,
                abi: erc20Abi,
                functionName: "approve",
                args: [spender_address, 0n],
            },
            {
                onError: () => {
                    toast.error("Failed to revoke allowance", {
                        id,
                    });
                },
                onSuccess: async (txHash) => {
                    toast.loading("Waiting for transaction confirmation...", {
                        id,
                    });

                    try {
                        const receipt = await waitForTransactionReceipt(
                            config,
                            {
                                hash: txHash,
                            }
                        );

                        if (receipt.status === "success") {
                            toast.success("Allowance successfully revoked", {
                                id,
                            });
                            router.delete(`/allowances/${allowance_id}`);
                        } else {
                            throw new Error("Transaction failed");
                        }
                    } catch (error) {
                        toast.error("Transaction failed", { id });
                    }
                },
            }
        );
    };

    return (
        <button
            onClick={handleRevoke}
            disabled={isLoading}
            className="text-gray-900 bg-white px-4 py-2 rounded disabled:opacity-50 border border-gray-900"
        >
            {isLoading ? "Revoking..." : "Revoke"}
        </button>
    );
};

export default RevokedButton;
