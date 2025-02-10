import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import OverviewAllowances from "@/Pages/Allowances/Index";
import { usePage } from "@inertiajs/react";

// Mock the modules
vi.mock("@inertiajs/react", () => ({
    usePage: vi.fn(),
    Link: ({ children, ...props }: any) => (
        <button {...props}>{children}</button>
    ),
}));

vi.mock("@/Components/AddressDisplay", () => ({
    default: ({ address }: any) => (
        <span data-testid="mock-address">{address}</span>
    ),
}));

vi.mock("@/Components/RevokeButton", () => ({
    default: () => <button data-testid="mock-revoke-button">Revoke</button>,
}));

describe("OverviewAllowances", () => {
    const mockAllowances = [
        {
            id: 1,
            contract_address: "0x1234567890123456789012345678901234567890",
            owner_address: "0x1234567890123456789012345678901234567891",
            spender_address: "0x1234567890123456789012345678901234567892",
            allowance_amount: "1000000000000000000", // 1 ETH
        },
        {
            id: 2,
            contract_address: "0x1234567890123456789012345678901234567893",
            owner_address: "0x1234567890123456789012345678901234567894",
            spender_address: "0x1234567890123456789012345678901234567895",
            allowance_amount: "2000000000000000000", // 2 ETH
        },
    ];

    beforeEach(() => {
        (usePage as any).mockReturnValue({
            props: {
                allowances: mockAllowances,
            },
        });
    });

    it("renders the table", () => {
        render(<OverviewAllowances />);

        const table = screen.getByRole("table");
        expect(table).toBeInTheDocument();
    });

    it("renders with empty allowances array", () => {
        (usePage as any).mockReturnValue({
            props: {
                allowances: [],
            },
        });

        render(<OverviewAllowances />);

        const table = screen.getByRole("table");
        expect(table.querySelectorAll("tr")).toHaveLength(1);
    });

    it("creates correct column configuration", () => {
        render(<OverviewAllowances />);

        const table = screen.getByRole("table");
        expect(table.querySelectorAll("th")).toHaveLength(5);
    });

    it("has correct layout wrapper", () => {
        const TestComponent = OverviewAllowances;
        expect(TestComponent.layout).toBeDefined();

        const testElement = <div>Test Content</div>;
        const wrappedElement = TestComponent.layout(testElement);

        expect(wrappedElement.type.name).toBe("MainLayout");
        expect(wrappedElement.props.children).toBe(testElement);
    });
});

describe("OverviewAllowances Columns", () => {
    const mockAllowance = {
        id: 1,
        contract_address: "0x1234567890123456789012345678901234567890",
        owner_address: "0x1234567890123456789012345678901234567891",
        spender_address: "0x1234567890123456789012345678901234567892",
        allowance_amount: "1000000000000000000",
    };

    beforeEach(() => {
        (usePage as any).mockReturnValue({
            props: {
                allowances: [mockAllowance],
            },
        });
    });

    it("renders address displays correctly", () => {
        render(<OverviewAllowances />);

        const addressDisplays = screen.getAllByTestId("mock-address");
        expect(addressDisplays).toHaveLength(3);
        expect(addressDisplays[0]).toHaveTextContent(
            mockAllowance.contract_address
        );
        expect(addressDisplays[1]).toHaveTextContent(
            mockAllowance.owner_address
        );
        expect(addressDisplays[2]).toHaveTextContent(
            mockAllowance.spender_address
        );
    });

    it("renders action buttons", () => {
        render(<OverviewAllowances />);

        const revokeButton = screen.getByTestId("mock-revoke-button");
        expect(revokeButton).toBeInTheDocument();

        const updateButton = screen.getByText("Update");
        expect(updateButton).toBeInTheDocument();
        expect(updateButton).toHaveAttribute("href", "/allowances/1");
    });
});
