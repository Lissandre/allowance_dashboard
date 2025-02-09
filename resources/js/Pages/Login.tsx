import MainLayout from "@/Layouts/MainLayout";

const Login = () => {
    return (
        <div className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold mb-4">
                Please connect a wallet to access your dashboard
            </h1>
        </div>
    );
};

Login.layout = (page: React.ReactNode) => <MainLayout children={page} />;

export default Login;
