import { InputHTMLAttributes, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, className, error, ...props }, ref) => {
        return (
            <label className="block text-sm font-medium text-gray-700">
                <span>{label}</span>
                <input
                    ref={ref}
                    className={twMerge(
                        "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-400 focus:ring focus:ring-gray-300/50",
                        error &&
                            "border-red-500 focus:border-red-500 focus:ring-red-500",
                        className
                    )}
                    {...props}
                />

                {error && <p className="text-sm text-red-600">{error}</p>}
            </label>
        );
    }
);

export default Input;
