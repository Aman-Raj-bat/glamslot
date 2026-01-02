import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AdminAppointments from '../components/AdminAppointments';
import AdminSlots from '../components/AdminSlots';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('appointments');

    return (
        <div className="p-8 bg-gray-50 min-h-screen font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Dashboard</h1>
                        <p className="text-gray-500 mt-1">Manage your appointment schedule efficiently</p>
                    </div>
                    <div className="flex items-center gap-4 mt-4 md:mt-0">
                        <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                            {user?.email}
                        </span>
                        <button
                            onClick={logout}
                            className="bg-gray-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-md hover:shadow-lg transform active:scale-95 text-sm"
                        >
                            Log Out
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex mb-8 bg-white p-1.5 rounded-xl shadow-sm border border-gray-100 w-fit">
                    <button
                        className={`px-6 py-2.5 font-bold rounded-lg transition-all duration-200 ${activeTab === 'appointments'
                            ? 'bg-gray-900 text-white shadow-md'
                            : 'bg-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        onClick={() => setActiveTab('appointments')}
                    >
                        Appointments
                    </button>
                    <button
                        className={`px-6 py-2.5 font-bold rounded-lg transition-all duration-200 ${activeTab === 'slots'
                            ? 'bg-gray-900 text-white shadow-md'
                            : 'bg-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900'
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
        </div>
    );
};

export default AdminDashboard;
