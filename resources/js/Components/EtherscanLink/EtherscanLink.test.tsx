import { render, screen } from "@/test/test-utils";
import EtherscanLink from "@/Components/EtherscanLink";
import { describe, it, expect } from "vitest";

describe("EtherscanLink", () => {
    const mockAddress = "0x1234567890123456789012345678901234567890";

    it("renders correct link for mainnet", () => {
        render(
            <EtherscanLink address={mockAddress} network="mainnet">
                Test Link
            </EtherscanLink>
        );

        const link = screen.getByRole("link");
        expect(link).toHaveAttribute(
            "href",
            `https://etherscan.io/address/${mockAddress}`
        );
    });

    it("renders correct link for holesky", () => {
        render(
            <EtherscanLink address={mockAddress} network="holesky">
                Test Link
            </EtherscanLink>
        );

        const link = screen.getByRole("link");
        expect(link).toHaveAttribute(
            "href",
            `https://holesky.etherscan.io/address/${mockAddress}`
        );
    });

    it("opens link in new tab", () => {
        render(<EtherscanLink address={mockAddress}>Test Link</EtherscanLink>);

        const link = screen.getByRole("link");
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noreferrer");
    });
});
