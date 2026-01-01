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
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-gray-100 my-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Book Your Visit</h1>

            {/* Date Selection */}
            <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                <input
                    type="date"
                    value={date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition"
                />
            </div>

            {/* Slots Selection */}
            <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-3">Available Time Slots</label>

                {loading ? (
                    <div className="text-center py-8 text-gray-500 animate-pulse">Checking availability...</div>
                ) : error && !slots.length ? (
                    <div className="text-center py-8 text-red-500 bg-red-50 rounded-lg border border-red-100">{error}</div>
                ) : slots.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-gray-100">
                        No slots available for this date. Please try another day.
                    </div>
                ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {slots.map((slot) => (
                            <button
                                key={slot._id}
                                type="button"
                                onClick={() => setSelectedSlot(slot.time)}
                                className={`py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 border ${selectedSlot === slot.time
                                    ? 'bg-pink-600 text-white border-pink-600 shadow-md transform scale-105'
                                    : 'bg-white text-gray-700 border-gray-200 hover:border-pink-300 hover:bg-pink-50'
                                    }`}
                            >
                                {slot.time}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Booking Form */}
            <form onSubmit={handleSubmit} className="space-y-6 pt-6 border-t border-gray-100">
                {error && slots.length > 0 && <div className="text-red-500 text-sm">{error}</div>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="e.g. Jane Doe"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="10 digits only"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                            required
                        />
                        {formData.phone && formData.phone.length !== 10 && (
                            <p className="text-xs text-red-500 mt-1">Must be exactly 10 digits</p>
                        )}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={!isFormValid || submitting}
                    className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 ${!isFormValid || submitting
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:shadow-xl hover:opacity-95'
                        }`}
                >
                    {submitting ? 'Confirming...' : 'Confirm Booking'}
                </button>
            </form>
        </div>
    );
};

export default BookAppointment;
