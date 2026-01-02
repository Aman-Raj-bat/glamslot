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
        <div className="space-y-6">
            {/* Create Slot Section */}
            <div className="bg-white p-6 rounded shadow border">
                <h3 className="text-lg font-bold mb-4">Add New Slot</h3>
                <form onSubmit={handleCreateSlot} className="flex gap-4 items-end flex-wrap">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input
                            type="date"
                            className="border rounded p-2"
                            value={newDate}
                            onChange={(e) => setNewDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                        <input
                            type="time"
                            className="border rounded p-2"
                            value={newTime}
                            onChange={(e) => setNewTime(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Add Slot
                    </button>
                </form>
                {createError && <p className="text-red-500 text-sm mt-2">{createError}</p>}
            </div>

            {/* Slots List */}
            <div className="bg-white rounded shadow border overflow-hidden">
                <div className="p-4 border-b">
                    <h2 className="text-xl font-bold">Manage Slots</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booked By</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {slots.map((slot) => (
                                <tr key={slot._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {new Date(slot.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {slot.time}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${slot.isBooked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                            {slot.isBooked ? 'Booked' : 'Available'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {slot.isBooked && slot.bookedBy ? (
                                            <div>
                                                <div>{slot.bookedBy.name}</div>
                                                <div className="text-xs">{slot.bookedBy.phone}</div>
                                            </div>
                                        ) : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {!slot.isBooked && (
                                            <button
                                                onClick={() => handleDeleteSlot(slot._id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {slots.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                        No slots found.
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
