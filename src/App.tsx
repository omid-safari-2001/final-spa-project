import { useState } from 'react';
import LoginPage from './pages/LoginPage';
import DomainsPage from './pages/DomainsPage';

function App() {
  // Read token from localStorage on initial render
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('auth_token'));

  const handleLoginSuccess = () => {
    setToken(localStorage.getItem('auth_token'));
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setToken(null);
  };

  return (
    <>
      {token ? (
        <DomainsPage onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={handleLoginSuccess} />
      )}
    </>
  );
}

export default App;