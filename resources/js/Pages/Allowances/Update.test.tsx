import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@/test/test-utils";
import userEvent from "@testing-library/user-event";
import AllowanceUpdate from "@/Pages/Allowances/Update";
import {
    useAccount,
    useWriteContract,
    useWaitForTransactionReceipt,
} from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";
import { toast } from "sonner";
import { router } from "@inertiajs/react";

vi.mock("@inertiajs/react", () => ({
    router: {
        patch: vi.fn(),
    },
}));

vi.mock("wagmi", async (importOriginal) => {
    const actual = (await importOriginal()) as object;
    return {
        ...actual,
        useAccount: vi.fn(),
        useWriteContract: vi.fn(),
        useWaitForTransactionReceipt: vi.fn(),
    };
});

vi.mock("wagmi/actions", () => ({
    waitForTransactionReceipt: vi.fn(),
}));

vi.mock("sonner", async (importOriginal) => {
    const actual = (await importOriginal()) as object;
    return {
        ...actual,
        toast: {
            loading: vi.fn(),
            success: vi.fn(),
            error: vi.fn(),
        },
    };
});

describe("AllowanceUpdate", () => {
    const mockAddress = "0x1234567890123456789012345678901234567890";
    const mockAllowance = {
        id: 1,
        contract_address: mockAddress,
        owner_address: mockAddress,
        spender_address: mockAddress,
        allowance_amount: "100",
    };
    const mockWriteContractFn = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        (useAccount as any).mockReturnValue({ address: mockAddress });
        (useWriteContract as any).mockReturnValue({
            writeContract: mockWriteContractFn,
            data: null,
        });
        (useWaitForTransactionReceipt as any).mockReturnValue({
            isLoading: false,
        });
    });

    it("renders the form with pre-filled values", () => {
        render(<AllowanceUpdate allowance={mockAllowance} />);

        expect(screen.getByLabelText(/Contract Address/i)).toHaveValue(
            mockAllowance.contract_address
        );
        expect(screen.getByLabelText(/Owner Address/i)).toHaveValue(
            mockAllowance.owner_address
        );
        expect(screen.getByLabelText(/Spender Address/i)).toHaveValue(
            mockAllowance.spender_address
        );
        expect(screen.getByLabelText(/New Allowance Amount/i)).toHaveValue(
            mockAllowance.allowance_amount
        );
    });

    it("disables read-only fields", () => {
        render(<AllowanceUpdate allowance={mockAllowance} />);

        expect(screen.getByLabelText(/Contract Address/i)).toBeDisabled();
        expect(screen.getByLabelText(/Owner Address/i)).toBeDisabled();
        expect(screen.getByLabelText(/Spender Address/i)).toBeDisabled();
        expect(
            screen.getByLabelText(/New Allowance Amount/i)
        ).not.toBeDisabled();
    });

    it("shows error when connected wallet does not match owner", () => {
        (useAccount as any).mockReturnValue({
            address: "0x9876543210987654321098765432109876543210",
        });

        render(<AllowanceUpdate allowance={mockAllowance} />);

        expect(
            screen.getByText(
                /Connected wallet does not match the allowance owner/i
            )
        ).toBeInTheDocument();
    });

    it("successfully updates allowance", async () => {
        const mockTxHash = "0xmocktxhash";

        mockWriteContractFn.mockImplementation(async (config, callbacks) => {
            const txHash = mockTxHash;
            await callbacks.onSuccess(txHash);
            return txHash;
        });

        (waitForTransactionReceipt as any).mockResolvedValueOnce({
            status: "success",
        });

        render(<AllowanceUpdate allowance={mockAllowance} />);

        const amountInput = screen.getByLabelText(/New Allowance Amount/i);
        await userEvent.clear(amountInput);
        await userEvent.type(amountInput, "200");

        const submitButton = screen.getByRole("button", {
            name: /Update Allowance/i,
        });
        await userEvent.click(submitButton);

        await waitFor(() => {
            expect(mockWriteContractFn).toHaveBeenCalled();
            expect(toast.success).toHaveBeenCalledWith(
                "Allowance successfully approved",
                expect.anything()
            );
            expect(router.patch).toHaveBeenCalledWith(
                `/allowances/${mockAllowance.id}`,
                expect.any(Object)
            );
        });
    });

    it("handles transaction failure", async () => {
        mockWriteContractFn.mockRejectedValueOnce(
            new Error("Transaction failed")
        );

        render(<AllowanceUpdate allowance={mockAllowance} />);

        const submitButton = screen.getByRole("button", {
            name: /Update Allowance/i,
        });
        await userEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Transaction failed/i)).toBeInTheDocument();
        });
    });

    it("shows loading state during transaction", () => {
        (useWaitForTransactionReceipt as any).mockReturnValue({
            isLoading: true,
        });

        render(<AllowanceUpdate allowance={mockAllowance} />);

        const submitButton = screen.getByRole("button");
        expect(submitButton).toBeDisabled();
        expect(screen.getByText(/Processing/i)).toBeInTheDocument();
    });
});
