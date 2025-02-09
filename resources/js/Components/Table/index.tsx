import EmptyData from "@/Components/Table/EmptyData";
import TableBody from "@/Components/Table/TableBody";
import TableHeader from "@/Components/Table/TableHeader";
import {
    useReactTable,
    getCoreRowModel,
    ColumnDef,
    getSortedRowModel,
} from "@tanstack/react-table";

interface TableProps<Data extends object> {
    columns: ColumnDef<Data, any>[];
    rows: Data[];
    emptyStatement?: string;
    emptyAction?: () => void;
    emptyActionTitle?: string;
}

const Table = <Data extends object>({
    columns,
    rows,
    emptyStatement,
    emptyAction,
    emptyActionTitle,
}: TableProps<Data>) => {
    const table = useReactTable({
        columns: columns,
        data: rows,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div className="w-full h-fit overflow-x-auto overflow-y-hidden">
            <table className="w-full">
                <TableHeader headerGroups={table.getHeaderGroups()} />
                <TableBody rowModel={table.getRowModel()} />
            </table>
            {(rows.length === 0 || !rows) && (
                <EmptyData
                    statement={emptyStatement}
                    action={emptyAction}
                    actionTitle={emptyActionTitle}
                />
            )}
        </div>
    );
};

export default Table;
