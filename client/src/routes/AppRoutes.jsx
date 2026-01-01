import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import BookAppointment from '../pages/BookAppointment';
import BookingSuccess from '../pages/BookingSuccess';
import AdminLogin from '../pages/AdminLogin';
import AdminDashboard from '../pages/AdminDashboard';
import ProtectedAdminRoute from '../components/ProtectedAdminRoute';
import MainLayout from '../layouts/MainLayout';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes - Wrapped in MainLayout */}
            <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/book" element={<BookAppointment />} />
                <Route path="/success" element={<BookingSuccess />} />
                <Route path="/admin/login" element={<AdminLogin />} />
            </Route>

            {/* Protected Admin Routes */}
            <Route element={<ProtectedAdminRoute />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                {/* Add more admin routes here */}
            </Route>

            {/* 404 Fallback */}
            <Route path="*" element={<div className="p-8">404 - Page Not Found</div>} />
        </Routes>
    );
};

export default AppRoutes;
