import Address from "@/Components/Wallet";
import Navbar from "@/Components/Navbar";
import { Head } from "@inertiajs/react";
import { FC } from "react";

interface MainLayoutProps {
    title?: string;
    children: React.ReactNode;
}

const MainLayout: FC<MainLayoutProps> = ({ title, children }) => {
    return (
        <>
            <Head title={title} />
            <div className="flex flex-col container">
                <div className="z-50 container fixed w-full top-0 flex justify-between py-4">
                    <Navbar />
                    <Address />
                </div>
                <div className="min-h-svh h-full py-24">{children}</div>
            </div>
        </>
    );
};

export default MainLayout;
