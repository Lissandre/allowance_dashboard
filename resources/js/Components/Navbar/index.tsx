import { Link, usePage } from "@inertiajs/react";
import { useAccount } from "wagmi";

interface NavRoute {
    path: string;
    label: string;
    exact?: boolean;
}

const Navbar = () => {
    const { url } = usePage();
    const { isConnected } = useAccount();

    const routes: NavRoute[] = [
        { path: "/allowances", label: "Overview", exact: true },
        { path: "/allowances/create", label: "Add" },
    ];

    const getLinkStyles = (route: NavRoute): string => {
        const baseStyles = "px-4 py-2 transition-colors duration-200";

        const isActive = route.exact
            ? url === route.path
            : url.startsWith(route.path);

        return `${baseStyles} ${
            isActive
                ? "text-black underline underline-offset-4"
                : "text-gray-600"
        }`;
    };

    return (
        <nav className="bg-white rounded-md flex gap-4 p-4">
            <Link href="/">
                <img
                    className="h-8"
                    src="/assets/images/logo.svg"
                    alt="Company logo"
                    title="Return to homepage"
                />
            </Link>
            {isConnected &&
                routes.map((route) => (
                    <Link
                        key={route.path}
                        href={route.path}
                        className={getLinkStyles(route)}
                    >
                        {route.label}
                    </Link>
                ))}
        </nav>
    );
};

export default Navbar;
