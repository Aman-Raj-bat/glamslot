import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const parsedFrom = location.state?.from?.pathname || '/admin/dashboard';

        try {
            const response = await api.post('/auth/login', { email, password });

            if (response.data.success) {
                // Backend might not return role, so we inject it for ProtectedRoute check
                const adminUser = { ...response.data.admin, role: 'admin' };
                login(adminUser, response.data.token);
                navigate(parsedFrom, { replace: true });
            }
        } catch (error) {
            const msg = error.response?.data?.error || 'Login failed. Please check your credentials.';
            alert(msg);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 mb-2">GlamSlot Admin</h1>
                    <p className="text-gray-500 text-sm">Sign in to manage bookings & slots</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition bg-gray-50 focus:bg-white"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@glamslot.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition bg-gray-50 focus:bg-white"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform active:scale-95"
                    >
                        Sign In
                    </button>
                    <div className="text-center mt-4 text-xs text-gray-400">
                        Protected System • Authorized Access Only
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
