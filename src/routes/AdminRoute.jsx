import { Navigate } from 'react-router';

import useAdmin from '../hooks/useAdmin';
import useAuth from '../hooks/useAuth';


const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { isAdmin, isLoading } = useAdmin();

  if (loading || isLoading) return (
    <div className="route-spinner-wrap">
      <div className="route-spinner" />
    </div>
  );

  if (!user || !isAdmin) return <Navigate to="/" replace />;

  return children;
};

export default AdminRoute;