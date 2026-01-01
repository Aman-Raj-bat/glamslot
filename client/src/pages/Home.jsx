import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
            <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 mb-6 py-2">
                GlamSlot
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl">
                Experience premium salon services tailored just for you. Book your exclusive appointment today.
            </p>

            <div className="space-y-4 md:space-y-0 md:space-x-4">
                <Link
                    to="/book"
                    className="inline-block bg-pink-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-pink-700 transform hover:scale-105 transition-all duration-300"
                >
                    Book Appointment
                </Link>
                <Link
                    to="/admin/login"
                    className="inline-block bg-white text-gray-700 border border-gray-300 font-semibold py-3 px-8 rounded-full hover:bg-gray-50 transition-colors duration-300"
                >
                    Admin Login
                </Link>
            </div>
        </div>
    );
};

export default Home;
