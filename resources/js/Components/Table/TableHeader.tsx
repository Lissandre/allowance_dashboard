import { flexRender, HeaderGroup } from "@tanstack/react-table";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { twMerge } from "tailwind-merge";

interface TableHeaderProps<Data extends object> {
    headerGroups: HeaderGroup<Data>[];
}

const TableHeader = <Data extends object>({
    headerGroups,
}: TableHeaderProps<Data>) => {
    return (
        <thead>
            {headerGroups.map((headerGroup) => {
                return (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <th
                                onClick={header.column.getToggleSortingHandler()}
                                key={header.id}
                                colSpan={header.colSpan}
                                className={
                                    "bg-gray-100 first:rounded-l-md last:rounded-r-md overflow-hidden px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                }
                            >
                                <div
                                    className={twMerge(
                                        "flex items-center gap-2 w-full",
                                        header.column.columnDef.meta?.className
                                    )}
                                >
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                    {header.column.getIsSorted() ? (
                                        header.column.getIsSorted() ===
                                        "desc" ? (
                                            <FaCaretDown />
                                        ) : (
                                            <FaCaretUp />
                                        )
                                    ) : null}
                                </div>
                            </th>
                        ))}
                    </tr>
                );
            })}
        </thead>
    );
};

export default TableHeader;
