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
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 animate-fade-in bg-gray-50">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-lg w-full flex flex-col items-center">
                <div className="bg-green-100 p-4 rounded-full mb-6 animate-bounce-slow">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h1 className="text-3xl font-extrabold text-gray-800 mb-3">Appointment Booked!</h1>

                {appointment ? (
                    <>
                        <p className="text-gray-600 mb-8">
                            Thank you, <span className="font-semibold text-pink-600">{appointment.name}</span>. We're looking forward to seeing you.
                        </p>

                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 w-full mb-8 space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 font-medium">Date</span>
                                <span className="text-gray-900 font-bold">{formatDate(appointment.date)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 font-medium">Time</span>
                                <span className="text-gray-900 font-bold">{appointment.time}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 font-medium">Service</span>
                                <span className="text-gray-900 font-bold">Salon Visit</span>
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
                    className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-all duration-300 shadow-md hover:shadow-lg transform active:scale-95"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default BookingSuccess;
