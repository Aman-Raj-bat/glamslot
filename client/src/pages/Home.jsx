import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="flex flex-col items-center">
            {/* Hero Section */}
            <div className="w-full max-w-4xl text-center py-20 px-4">
                <span className="inline-block py-1 px-3 rounded-full bg-pink-100 text-pink-600 text-sm font-semibold mb-6 animate-fade-in-up">
                    ✨ Check out our new online booking
                </span>
                <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
                    Beauty, <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">Reimagined.</span>
                </h1>
                <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Experience premium salon services tailored just for you.
                    From hair styling to skincare, we bring out your best version.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                        to="/book"
                        className="bg-gray-900 text-white font-bold py-4 px-10 rounded-full shadow-xl hover:bg-gray-800 transform hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 text-lg w-full sm:w-auto"
                    >
                        Book Appointment
                    </Link>
                </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl px-4 py-16">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-6 text-2xl">
                        ✂️
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Expert Stylists</h3>
                    <p className="text-gray-600">Our team of certified professionals ensures you get the look you desire.</p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6 text-2xl">
                        💎
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Premium Products</h3>
                    <p className="text-gray-600">We only use top-tier brands that are safe and effective for your skin and hair.</p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-2xl">
                        📅
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Easy Booking</h3>
                    <p className="text-gray-600">Schedule your visit in seconds with our hassle-free online booking system.</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
