import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';

// Hook de autenticación
export const useAuth = () => useContext(AuthContext);
