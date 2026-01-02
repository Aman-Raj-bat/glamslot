import { Outlet, Link } from 'react-router-dom';

const MainLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 transition-all duration-300">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-80 transition-opacity">
                        GlamSlot
                    </Link>
                    <nav className="space-x-8">
                        <Link to="/" className="text-gray-600 hover:text-pink-600 font-medium transition-colors">Home</Link>
                        <Link
                            to="/book"
                            className="bg-pink-600 text-white px-5 py-2.5 rounded-full font-medium hover:bg-pink-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            Book Appointment
                        </Link>
                    </nav>
                </div>
            </header>
            <main className="flex-grow container mx-auto px-4 py-8">
                <Outlet />
            </main>
            <footer className="bg-white border-t border-gray-100 py-8 text-center text-sm text-gray-500">
                <p>&copy; {new Date().getFullYear()} GlamSlot. Premium Salon Services.</p>
            </footer>
        </div>
    );
};

export default MainLayout;
