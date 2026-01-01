import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const { user, logout } = useAuth();

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <button
                    onClick={logout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </div>
            <p className="mb-4">Welcome back, {user?.name}!</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded shadow border">
                    <h3 className="font-bold text-lg">Appointments</h3>
                    <p className="text-3xl mt-2">12</p>
                </div>
                <div className="bg-white p-6 rounded shadow border">
                    <h3 className="font-bold text-lg">Revenue</h3>
                    <p className="text-3xl mt-2">$1,250</p>
                </div>
                <div className="bg-white p-6 rounded shadow border">
                    <h3 className="font-bold text-lg">New Customers</h3>
                    <p className="text-3xl mt-2">5</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
