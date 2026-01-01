import { Outlet, Link } from 'react-router-dom';

const MainLayout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-white shadow p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <Link to="/" className="text-xl font-bold text-pink-600">GlamSlot</Link>
                    <nav className="space-x-4">
                        <Link to="/" className="hover:text-pink-600">Home</Link>
                        <Link to="/book" className="hover:text-pink-600">Book Appointment</Link>
                        <Link to="/admin/login" className="hover:text-pink-600">Admin</Link>
                    </nav>
                </div>
            </header>
            <main className="flex-grow container mx-auto p-4">
                <Outlet />
            </main>
            <footer className="bg-gray-100 p-4 text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} GlamSlot. All rights reserved.
            </footer>
        </div>
    );
};

export default MainLayout;
