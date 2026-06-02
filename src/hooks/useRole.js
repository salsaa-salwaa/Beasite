import { useState, useEffect } from 'react';
import { getRole, setRole } from '../role';

export const useRole = () => {
  const [role, setLocalRole] = useState(getRole());

  const set = (newRole) => {
    setRole(newRole);
    setLocalRole(newRole);
  };

  useEffect(() => {
    // sync with localStorage changes from other tabs
    const onStorage = () => setLocalRole(getRole());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return { role, setRole: set };
};
