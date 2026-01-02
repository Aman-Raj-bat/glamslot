import { useState, useEffect } from 'react';
import api from '../services/api';

const AdminAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchAppointments = async () => {
        try {
            const response = await api.get('/appointments');
            if (response.data.success) {
                setAppointments(response.data.data);
            }
        } catch (err) {
            setError('Failed to fetch appointments');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleUpdateStatus = async (id, status) => {
        try {
            const response = await api.patch(`/appointments/${id}/status`, { status });
            if (response.data.success) {
                // Update local state
                setAppointments(prev => prev.map(app =>
                    app._id === id ? { ...app, status: status } : app
                ));
            }
        } catch (err) {
            alert('Failed to update status');
            console.error(err);
        }
    };

    if (loading) return <div className="p-4">Loading appointments...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-xl font-bold text-gray-800">Appointments Management</h2>
                <div className="bg-white px-3 py-1 rounded-full border border-gray-200 text-sm text-gray-500 shadow-sm">
                    Total: <span className="font-semibold text-gray-900">{appointments.length}</span>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Contact</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date/Time</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {appointments.map((app) => (
                            <tr key={app._id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-bold text-gray-900">{app.name}</div>
                                    <div className="text-xs text-gray-400 sm:hidden">{app.phone}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                                    <div className="text-sm text-gray-500 font-mono bg-gray-50 px-2 py-0.5 rounded inline-block">{app.phone}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{new Date(app.date).toLocaleDateString()}</div>
                                    <div className="text-xs text-gray-400">{app.time}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border 
                                        ${app.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' :
                                            app.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                                                'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex space-x-3 opacity-100 sm:opacity-60 group-hover:opacity-100 transition-opacity">
                                        {app.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleUpdateStatus(app._id, 'approved')}
                                                    className="text-green-600 hover:text-green-800 font-semibold bg-green-50 hover:bg-green-100 px-3 py-1 rounded-lg transition-colors"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(app._id, 'cancelled')}
                                                    className="text-red-600 hover:text-red-800 font-semibold bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        )}
                                        {app.status === 'approved' && (
                                            <button
                                                onClick={() => handleUpdateStatus(app._id, 'cancelled')}
                                                className="text-red-600 hover:text-red-800 font-semibold hover:bg-red-50 px-3 py-1 rounded-lg transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {appointments.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center text-gray-400 flex flex-col items-center justify-center">
                                    <span className="text-3xl mb-2">📭</span>
                                    <span>No appointments found.</span>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminAppointments;
