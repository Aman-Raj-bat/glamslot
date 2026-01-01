import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedAdminRoute = () => {
    const { user } = useAuth();
    const location = useLocation();

    // Check if user exists and has admin role
    // Adjust 'role' property based on your actual backend response
    const isAdmin = user && (user.role === 'admin' || user.isAdmin);

    if (!user) {
        // Redirect to login if not authenticated
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    if (!isAdmin) {
        // Redirect to home if authenticated but not admin
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedAdminRoute;
