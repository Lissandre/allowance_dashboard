import { render, screen, fireEvent } from "@/test/test-utils";
import Input from "@/Components/Inputs";
import { describe, it, expect, vi } from "vitest";

describe("Input", () => {
    it("renders with label", () => {
        render(<Input label="Test Input" />);
        expect(screen.getByLabelText("Test Input")).toBeInTheDocument();
    });

    it("shows error message when provided", () => {
        render(<Input label="Test Input" error="Error message" />);
        expect(screen.getByText("Error message")).toBeInTheDocument();
    });

    it("forwards ref correctly", () => {
        const ref = vi.fn();
        render(<Input label="Test Input" ref={ref} />);
        expect(ref).toHaveBeenCalled();
    });

    it("handles value changes", () => {
        const handleChange = vi.fn();
        render(<Input label="Test Input" onChange={handleChange} />);

        const input = screen.getByLabelText("Test Input");
        fireEvent.change(input, { target: { value: "test" } });

        expect(handleChange).toHaveBeenCalled();
    });
});
