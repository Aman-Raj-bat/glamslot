import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AdminAppointments from '../components/AdminAppointments';
import AdminSlots from '../components/AdminSlots';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('appointments');

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <p className="text-gray-600">Welcome back, {user?.name || 'Admin'}!</p>
                </div>
                <button
                    onClick={logout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                >
                    Logout
                </button>
            </div>

            {/* Tabs */}
            <div className="flex mb-6 space-x-4 border-b border-gray-300 pb-2">
                <button
                    className={`px-4 py-2 font-medium rounded ${activeTab === 'appointments'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    onClick={() => setActiveTab('appointments')}
                >
                    Appointments
                </button>
                <button
                    className={`px-4 py-2 font-medium rounded ${activeTab === 'slots'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    onClick={() => setActiveTab('slots')}
                >
                    Slot Management
                </button>
            </div>

            {/* Content */}
            <div className="transition-all duration-300">
                {activeTab === 'appointments' ? (
                    <AdminAppointments />
                ) : (
                    <AdminSlots />
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
