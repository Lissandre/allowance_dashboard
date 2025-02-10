import type { Allowance, PageProps } from "@/Types";
import Table from "@/Components/Table";
import MainLayout from "@/Layouts/MainLayout";
import { Link, usePage } from "@inertiajs/react";
import { createColumnHelper } from "@tanstack/react-table";
import { formatEther, parseEther } from "viem";
import AddressDisplay from "@/Components/AddressDisplay";
import RevokeButton from "@/Components/RevokeButton";

const OverviewAllowances = () => {
    const { allowances = [] } = usePage<PageProps>().props;

    const columnHelper = createColumnHelper<Allowance>();
    const columns = [
        columnHelper.accessor("contract_address", {
            header: "Contract",
            cell: (cell) => {
                return <AddressDisplay address={cell.getValue()} withLink />;
            },
        }),
        columnHelper.accessor("owner_address", {
            header: "Owner",
            cell: (cell) => {
                return <AddressDisplay address={cell.getValue()} withLink />;
            },
        }),
        columnHelper.accessor("spender_address", {
            header: "Spender",
            cell: (cell) => {
                return <AddressDisplay address={cell.getValue()} withLink />;
            },
        }),
        columnHelper.accessor("allowance_amount", {
            header: "Amount",
            meta: {
                className: "justify-start text-right flex-row-reverse",
            },
            cell: (cell) => formatEther(parseEther(cell.getValue())),
        }),
        columnHelper.display({
            header: "Actions",
            meta: {
                className: "justify-end",
            },
            cell: (cell) => {
                const allowance = cell.row.original;
                return (
                    <div className="flex items-center justify-end gap-2">
                        <RevokeButton allowance={allowance} />
                        <Link
                            as="button"
                            href={`/allowances/${allowance.id}`}
                            className="text-white bg-gray-900 px-4 py-2 rounded disabled:opacity-50 border border-gray-900"
                        >
                            Update
                        </Link>
                    </div>
                );
            },
        }),
    ];
    return (
        <>
            <Table rows={allowances} columns={columns} />
        </>
    );
};

OverviewAllowances.layout = (page: React.ReactNode) => (
    <MainLayout children={page} />
);

export default OverviewAllowances;
