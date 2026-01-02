import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const BookAppointment = () => {
    const navigate = useNavigate();

    // State
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [formData, setFormData] = useState({ name: '', phone: '' });
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // Fetch slots when date changes
    useEffect(() => {
        const fetchSlots = async () => {
            setLoading(true);
            setError(null);
            setSelectedSlot(null); // Reset selection on date change
            try {
                // api.get uses baseURL from setup
                const response = await api.get(`/slots/available`, {
                    params: { date }
                });
                // Backend returns { success: true, count: N, data: [...] }
                const availableSlots = response.data.data || [];
                setSlots(availableSlots);
            } catch (err) {
                console.error("Failed to fetch slots", err);
                setError("Failed to load time slots. Please try again.");
                setSlots([]);
            } finally {
                setLoading(false);
            }
        };

        if (date) {
            fetchSlots();
        }
    }, [date]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // Restrict phone input to numbers only
        if (name === 'phone') {
            const numericValue = value.replace(/\D/g, '');
            if (numericValue.length <= 10) {
                setFormData(prev => ({ ...prev, [name]: numericValue }));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // Validation
    const isPhoneValid = formData.phone.length === 10;
    const isFormValid = selectedSlot && formData.name.trim().length > 0 && isPhoneValid;

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isFormValid) {
            setError("Please fill in all fields correctly.");
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            // Payload matches backend expectations: name, phone, date, time
            const payload = {
                date,
                time: selectedSlot,
                name: formData.name,
                phone: formData.phone
            };

            const response = await api.post('/appointments', payload);

            // Redirect to success page with appointment details
            // Backend returns { success: true, data: { ... } }
            navigate('/success', {
                state: {
                    appointment: payload // Or use response.data.data if preferred, but payload is sufficient for display
                }
            });
        } catch (err) {
            console.error("Booking failed", err);
            // Extract error message if available
            // Backend returns { success: false, error: "..." }
            const msg = err.response?.data?.error || "Failed to book appointment. The slot might be taken.";
            setError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Book Your Visit</h1>
                    <p className="text-gray-500">Select a date and time to reserve your spot.</p>
                </div>

                {/* Date Selection */}
                <div className="mb-10">
                    <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Select Date</label>
                    <input
                        type="date"
                        value={date}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all duration-200 text-lg"
                    />
                </div>

                {/* Slots Selection */}
                <div className="mb-10">
                    <div className="flex justify-between items-center mb-4">
                        <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider">Available Time Slots</label>
                        {slots.length > 0 && <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full">{slots.length} slots available</span>}
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 animate-pulse">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="h-12 bg-gray-100 rounded-xl"></div>
                            ))}
                        </div>
                    ) : error && !slots.length ? (
                        <div className="p-6 text-center text-red-500 bg-red-50 rounded-xl border border-red-100 font-medium">{error}</div>
                    ) : slots.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center">
                            <span className="text-3xl mb-2">📅</span>
                            <p>No slots available for this date.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                            {slots.map((slot) => {
                                const isSelected = selectedSlot === slot.time;
                                return (
                                    <button
                                        key={slot._id}
                                        type="button"
                                        onClick={() => setSelectedSlot(slot.time)}
                                        className={`relative py-3 px-2 rounded-xl text-sm font-semibold transition-all duration-200 border-2 ${isSelected
                                                ? 'bg-pink-600 text-white border-pink-600 shadow-lg transform -translate-y-1'
                                                : 'bg-white text-gray-600 border-gray-100 hover:border-pink-200 hover:bg-pink-50/50'
                                            }`}
                                    >
                                        {slot.time}
                                        {isSelected && (
                                            <span className="absolute -top-2 -right-2 bg-white text-pink-600 rounded-full p-0.5 shadow-sm border border-gray-100">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Booking Form */}
                <form onSubmit={handleSubmit} className={`space-y-6 pt-8 border-t border-gray-100 transition-opacity duration-500 ${selectedSlot ? 'opacity-100' : 'opacity-50 pointer-events-none filter blur-[1px]'}`}>
                    {error && slots.length > 0 && (
                        <div className="p-4 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="e.g. Jane Doe"
                                className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition bg-gray-50 focus:bg-white"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                            <div className="relative">
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="10 digits"
                                    className={`w-full p-3.5 border rounded-xl focus:ring-2 outline-none transition bg-gray-50 focus:bg-white ${formData.phone && formData.phone.length !== 10
                                            ? 'border-red-300 focus:ring-red-200'
                                            : 'border-gray-200 focus:ring-pink-500 focus:border-transparent'
                                        }`}
                                    required
                                />
                                {formData.phone.length === 10 && (
                                    <div className="absolute right-3 top-3.5 text-green-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!isFormValid || submitting}
                        className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 transform ${!isFormValid || submitting
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                            : 'bg-gray-900 text-white hover:bg-gray-800 hover:shadow-xl hover:-translate-y-0.5'
                            }`}
                    >
                        {submitting ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </span>
                        ) : 'Confirm Booking'}
                    </button>
                    {!selectedSlot && <p className="text-center text-sm text-gray-400">Please select a time slot to continue</p>}
                </form>
            </div>
        </div>
    );
};

export default BookAppointment;
