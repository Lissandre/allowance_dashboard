import type { RowData } from "@tanstack/react-table";
import { PageProps as InertiaPageProps } from "@inertiajs/core";

declare module "@tanstack/react-table" {
    interface ColumnMeta<TData extends RowData, TValue> {
        className?: string;
    }
}

export interface Allowance {
    id: number;
    contract_address: `0x${string}`;
    owner_address: `0x${string}`;
    spender_address: `0x${string}`;
    allowance_amount: string;
    created_at: string;
    updated_at: string;
}

export interface PageProps extends InertiaPageProps {
    allowances?: Allowance[];
    flash?: {
        success?: string;
        error?: string;
    };
}
