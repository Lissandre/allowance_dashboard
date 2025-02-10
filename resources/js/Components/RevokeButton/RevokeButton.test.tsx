import { describe, it, expect } from "vitest";
import RevokeButton from "@/Components/RevokeButton";
import { render } from "@/test/test-utils";

describe("RevokeButton", () => {
    const mockAllowance = {
        id: 1,
        contract_address: "0x1234567890123456789012345678901234567890" as const,
        spender_address: "0x0987654321098765432109876543210987654321" as const,
    };

    it("renders revoke button", () => {
        const screen = render(<RevokeButton allowance={mockAllowance} />);
        expect(screen.getByRole("button")).toHaveTextContent(/revoke/i);
    });
});
