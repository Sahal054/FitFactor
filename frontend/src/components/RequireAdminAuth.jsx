import { Navigate, useLocation } from 'react-router-dom';
import { api } from '../services/api';

export default function RequireAdminAuth({ children }) {
  const location = useLocation();

  if (!api.isAdminAuthenticated()) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return children;
}
