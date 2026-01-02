import { useState, useEffect } from 'react';
import api from '../services/api';

const AdminSlots = () => {
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Form state
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');
    const [createError, setCreateError] = useState('');

    const fetchSlots = async () => {
        try {
            const response = await api.get('/slots');
            if (response.data.success) {
                setSlots(response.data.data);
            }
        } catch (err) {
            setError('Failed to fetch slots');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSlots();
    }, []);

    const handleCreateSlot = async (e) => {
        e.preventDefault();
        setCreateError('');

        if (!newDate || !newTime) {
            setCreateError('Please select both date and time');
            return;
        }

        try {
            const payload = {
                slots: [
                    { date: newDate, time: newTime }
                ]
            };

            const response = await api.post('/slots', payload);

            if (response.data.success) {
                // Refresh list
                await fetchSlots();
                // Reset form
                setNewDate('');
                setNewTime('');
            }
        } catch (err) {
            setCreateError(err.response?.data?.error || 'Failed to create slot');
        }
    };

    const handleDeleteSlot = async (id) => {
        if (!window.confirm('Are you sure you want to delete this slot?')) return;

        try {
            const response = await api.delete(`/slots/${id}`);
            if (response.data.success) {
                setSlots(prev => prev.filter(slot => slot._id !== id));
            }
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to delete slot');
        }
    };

    if (loading) return <div className="p-4">Loading slots...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;

    return (
        <div className="space-y-8">
            {/* Create Slot Section */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold mb-6 text-gray-800">Add New Availability</h3>
                <form onSubmit={handleCreateSlot} className="flex flex-col sm:flex-row gap-6 items-end">
                    <div className="w-full sm:w-1/3">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                        <input
                            type="date"
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50 focus:bg-white transition"
                            value={newDate}
                            onChange={(e) => setNewDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>
                    <div className="w-full sm:w-1/3">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Time</label>
                        <input
                            type="time"
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50 focus:bg-white transition"
                            value={newTime}
                            onChange={(e) => setNewTime(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full sm:w-auto bg-blue-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-blue-700 hover:shadow-lg transition-all transform active:scale-95"
                    >
                        Add Slot
                    </button>
                </form>
                {createError && (
                    <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                        {createError}
                    </div>
                )}
            </div>

            {/* Slots List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-xl font-bold text-gray-800">Current Slots</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Booked By</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {slots.map((slot) => (
                                <tr key={slot._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {new Date(slot.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {slot.time}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border 
                                            ${slot.isBooked ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                                            {slot.isBooked ? 'Booked' : 'Available'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {slot.isBooked && slot.bookedBy ? (
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900">{slot.bookedBy.name}</span>
                                                <span className="text-xs text-gray-400">{slot.bookedBy.phone}</span>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {!slot.isBooked && (
                                            <button
                                                onClick={() => handleDeleteSlot(slot._id)}
                                                className="text-red-600 hover:text-red-900 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors"
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {slots.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-400 flex flex-col items-center justify-center">
                                        <span className="text-3xl mb-2">🕒</span>
                                        <span>No slots created yet.</span>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminSlots;
