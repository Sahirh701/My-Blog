import { Navigate } from 'react-router-dom';
import supabase from './supabaseClient';

const ProtectedRoute = ({ children }) => {
  const user = supabase.auth.user();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;