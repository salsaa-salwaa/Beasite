export const getRole = () => {
  return localStorage.getItem('role') || null;
};

export const setRole = (role) => {
  if (role) {
    localStorage.setItem('role', role);
  } else {
    localStorage.removeItem('role');
  }
};
