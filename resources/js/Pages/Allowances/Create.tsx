import React, { useState } from "react";
import {
    useAccount,
    useWriteContract,
    useWaitForTransactionReceipt,
} from "wagmi";
import { isAddress, parseUnits } from "viem";
import { router } from "@inertiajs/react";
import { erc20Abi } from "viem";
import MainLayout from "@/Layouts/MainLayout";
import Loader from "@/Components/Loader";
import Input from "@/Components/Inputs";
import { toast } from "sonner";
import { waitForTransactionReceipt } from "wagmi/actions";
import { config } from "@/Lib/wagmi";

const AllowanceForm = () => {
    const { address } = useAccount();
    const [formData, setFormData] = useState({
        contract_address: "",
        owner_address: address || "",
        spender_address: "",
        allowance_amount: "",
    });
    const [error, setError] = useState("");
    const { writeContract, data: hash } = useWriteContract();
    const { isLoading } = useWaitForTransactionReceipt({
        hash,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            if (!isAddress(formData.contract_address)) {
                setError("Invalid contract address format");
                return;
            }
            if (!isAddress(formData.spender_address)) {
                setError("Invalid spender address format");
                return;
            }
            const id = toast.loading("Waiting for wallet approval...");
            await writeContract(
                {
                    address: formData.contract_address,
                    abi: erc20Abi,
                    functionName: "approve",
                    args: [
                        formData.spender_address,
                        parseUnits(formData.allowance_amount, 18),
                    ],
                },
                {
                    onError: (error) => {
                        setError(error.message);
                        toast.error("Failed to approve allowance on-chain", {
                            id: id,
                        });
                    },
                    onSuccess: async (txHash) => {
                        toast.loading(
                            "Waiting for transaction confirmation...",
                            { id }
                        );

                        try {
                            const receipt = await waitForTransactionReceipt(
                                config,
                                {
                                    hash: txHash,
                                }
                            );

                            if (receipt.status === "success") {
                                toast.success(
                                    "Allowance successfully approved",
                                    { id }
                                );
                                await router.post("/allowances", formData);
                            } else {
                                throw new Error("Transaction failed");
                            }
                        } catch (error) {
                            setError("Transaction failed");
                            toast.error("Transaction failed", { id });
                        }
                    },
                }
            );
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to approve allowance on-chain"
            );
        }
    };

    return (
        <div className="flex justify-center">
            <form onSubmit={handleSubmit} className="w-full max-w-md mt-8">
                <div className="space-y-4">
                    <Input
                        label="Contract Address (ERC-20 Token)"
                        type="text"
                        name="contract_address"
                        value={formData.contract_address}
                        onChange={handleChange}
                        placeholder="0x..."
                        required
                        pattern="^0x[a-fA-F0-9]{40}$"
                        title="Please enter a valid Ethereum address"
                    />
                    <Input
                        label="Owner Address"
                        type="text"
                        name="owner_address"
                        value={formData.owner_address}
                        onChange={handleChange}
                        className="bg-gray-100"
                        placeholder="Connected wallet address"
                        required
                        pattern="^0x[a-fA-F0-9]{40}$"
                        title="Please enter a valid Ethereum address"
                    />
                    <Input
                        label="Spender Address"
                        type="text"
                        name="spender_address"
                        value={formData.spender_address}
                        onChange={handleChange}
                        placeholder="0x..."
                        required
                        pattern="^0x[a-fA-F0-9]{40}$"
                        title="Please enter a valid Ethereum address"
                    />
                    <Input
                        label="Allowance Amount"
                        type="text"
                        name="allowance_amount"
                        value={formData.allowance_amount}
                        onChange={handleChange}
                        placeholder="Enter amount"
                        required
                        pattern="^\d*\.?\d*$"
                        title="Please enter a valid number"
                    />

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                            <div className="flex">
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">
                                        {error}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="shadow-sm w-full bg-black text-white rounded hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 py-4 px-8 mt-8"
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <Loader />
                            Processing
                        </span>
                    ) : (
                        "Add Allowance"
                    )}
                </button>
            </form>
        </div>
    );
};

AllowanceForm.layout = (page: React.ReactNode) => (
    <MainLayout children={page} />
);

export default AllowanceForm;
