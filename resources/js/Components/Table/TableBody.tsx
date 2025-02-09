import { flexRender, RowModel } from "@tanstack/react-table";
import { twMerge } from "tailwind-merge";

interface TableBodyProps<Data extends object> {
    rowModel: RowModel<Data>;
}

const TableBody = <Data extends object>({ rowModel }: TableBodyProps<Data>) => {
    return (
        <tbody className="divide-y divide-gray-100 bg-white">
            {rowModel.rows.map((row, index) => (
                <tr key={index}>
                    {row.getVisibleCells().map((cell) => (
                        <td
                            key={cell.id}
                            className={twMerge(
                                "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900",
                                cell.column.columnDef.meta?.className
                            )}
                        >
                            {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                            )}
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>
    );
};

export default TableBody;
