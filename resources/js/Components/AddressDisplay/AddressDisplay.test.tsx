import { render, screen } from "@/test/test-utils";
import { describe, it, expect, vi } from "vitest";
import AddressDisplay from "@/Components/AddressDisplay";
import userEvent from "@testing-library/user-event";

window.prompt = vi.fn();
vi.mock("wagmi", async (importOriginal) => {
    const actual = (await importOriginal()) as object;
    return {
        ...actual,
        useEnsName: vi.fn().mockReturnValue({
            data: null,
            isLoading: false,
            error: null,
        }),
        useEnsAvatar: vi.fn().mockReturnValue({
            data: null,
            isLoading: false,
            error: null,
        }),
    };
});

describe("AddressDisplay", () => {
    const address = "0x1234567890123456789012345678901234567890" as const;

    it("displays truncated address", () => {
        render(<AddressDisplay address={address} />);
        expect(screen.getByText("0x1234...7890")).toBeInTheDocument();
    });

    it("shows copy button by default", () => {
        render(<AddressDisplay address={address} />);
        expect(
            screen.getByRole("button", { name: /copy/i })
        ).toBeInTheDocument();
    });

    it("hides copy button when showCopy is false", () => {
        render(<AddressDisplay address={address} showCopy={false} />);
        expect(
            screen.queryByRole("button", { name: /copy/i })
        ).not.toBeInTheDocument();
    });

    it("copies address to clipboard when copy button is clicked", async () => {
        const user = userEvent.setup();
        render(<AddressDisplay address={address} />);

        const copyButton = screen.getByRole("button", { name: /copy/i });
        await user.click(copyButton);

        expect(screen.getByText(/Address copied/i)).toBeInTheDocument();
    });

    it("renders as link when withLink is true", () => {
        render(<AddressDisplay address={address} withLink={true} />);
        expect(screen.getByRole("link")).toHaveAttribute(
            "href",
            expect.stringContaining(address)
        );
    });
});
