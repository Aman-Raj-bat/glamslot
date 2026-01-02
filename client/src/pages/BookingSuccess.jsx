import { Link, useLocation } from 'react-router-dom';

const BookingSuccess = () => {
    const location = useLocation();
    const appointment = location.state?.appointment;

    // Helper to format date
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        try {
            return new Date(dateStr).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 animate-fade-in bg-gray-50 py-12">
            <div className="bg-white p-10 rounded-3xl shadow-xl max-w-lg w-full flex flex-col items-center transform transition-all hover:scale-105 duration-500">
                <div className="bg-green-100 p-6 rounded-full mb-8 animate-bounce">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Booking Confirmed!</h1>

                {appointment ? (
                    <>
                        <p className="text-lg text-gray-500 mb-10">
                            You're all set, <span className="font-bold text-gray-900">{appointment.name}</span>!
                        </p>

                        <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 w-full mb-10 space-y-4 shadow-inner">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 font-medium">Date</span>
                                <span className="text-gray-900 font-bold text-lg">{formatDate(appointment.date)}</span>
                            </div>
                            <div className="border-t border-gray-200"></div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 font-medium">Time</span>
                                <span className="text-gray-900 font-bold text-lg">{appointment.time}</span>
                            </div>
                            <div className="border-t border-gray-200"></div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 font-medium">Service</span>
                                <span className="text-gray-900 font-bold text-lg">Salon Visit</span>
                            </div>
                        </div>
                    </>
                ) : (
                    <p className="text-gray-600 mb-8">
                        Your appointment has been successfully scheduled. Check your email for details.
                    </p>
                )}

                <Link
                    to="/"
                    className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform active:scale-95 text-lg"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default BookingSuccess;
