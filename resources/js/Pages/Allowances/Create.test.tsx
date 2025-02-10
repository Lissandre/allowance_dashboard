import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AllowanceForm from "@/Pages/Allowances/Create";
import {
    useAccount,
    useWriteContract,
    useWaitForTransactionReceipt,
} from "wagmi";

vi.mock("@inertiajs/react", () => ({
    router: {
        post: vi.fn(),
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

vi.mock("sonner", () => ({
    toast: {
        loading: vi.fn(),
        success: vi.fn(),
        error: vi.fn(),
    },
}));

describe("AllowanceForm", () => {
    const mockAddress = "0x1234567890123456789012345678901234567890";
    const mockWriteContract = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        // Setup default mocks
        (useAccount as any).mockReturnValue({ address: mockAddress });
        (useWriteContract as any).mockReturnValue({
            writeContract: mockWriteContract,
            data: null,
        });
        (useWaitForTransactionReceipt as any).mockReturnValue({
            isLoading: false,
        });
    });

    it("renders the form with all required fields", () => {
        render(<AllowanceForm />);

        expect(screen.getByLabelText(/Contract Address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Owner Address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Spender Address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Allowance Amount/i)).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /Add Allowance/i })
        ).toBeInTheDocument();
    });

    it("pre-fills owner address with connected wallet address", () => {
        render(<AllowanceForm />);

        const ownerInput = screen.getByLabelText(
            /Owner Address/i
        ) as HTMLInputElement;
        expect(ownerInput.value).toBe(mockAddress);
    });

    it("handles transaction failure", async () => {
        mockWriteContract.mockRejectedValueOnce(
            new Error("Transaction failed")
        );

        render(<AllowanceForm />);

        await userEvent.type(
            screen.getByLabelText(/Contract Address/i),
            mockAddress
        );
        await userEvent.type(
            screen.getByLabelText(/Spender Address/i),
            mockAddress
        );
        await userEvent.type(screen.getByLabelText(/Allowance Amount/i), "100");

        const submitButton = screen.getByRole("button", {
            name: /Add Allowance/i,
        });
        await userEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Transaction failed/i)).toBeInTheDocument();
        });
    });

    it("shows loading state during transaction", async () => {
        (useWaitForTransactionReceipt as any).mockReturnValue({
            isLoading: true,
        });

        render(<AllowanceForm />);

        const submitButton = screen.getByRole("button");
        expect(submitButton).toBeDisabled();
        expect(screen.getByText(/Processing/i)).toBeInTheDocument();
    });
});
