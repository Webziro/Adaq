import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import QRCodeScanner from './components/QRCodeScanner';
import AdminDashboard from './components/AdminDashboard';
import axios from 'axios'; // Import axios
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode
import AdminLogin from './components/AdminLogin'; // Import AdminLogin component
import './App.css';

interface UserData {
  id: string;
  name: string;
  email: string;
  nin?: string;
  passport?: string;
  vehicleColor?: string;
  vehicleChassisNumber?: string;
  position: 'user' | 'admin';
  plateRequestStatus?: 'pending' | 'started' | 'in-progress' | 'completed';
}

type AppView = 'login' | 'register' | 'dashboard' | 'qrscanner' | 'admin' | 'admin-login';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [userRequests, setUserRequests] = useState<any[]>([]); // To store requests fetched from backend
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          handleLogout();
        } else {
          // Simulate fetching user data based on token
          // In a real app, you would make an API call to /api/auth/me to get full user data
          const userPosition = decoded.user.position;
          setIsLoggedIn(true);
          setIsAdmin(userPosition === 'admin');
          setUser({ 
            id: decoded.user.id,
            name: 'Loaded User',
            email: decoded.user.email || '',
            nin: '',
            passport: '',
            vehicleColor: '',
            vehicleChassisNumber: '',
            position: userPosition,
            plateRequestStatus: 'pending',
          });
          fetchUserRequests(token, userPosition);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        handleLogout();
      }
    } else {
      setIsLoggedIn(false);
      setIsAdmin(false);
      setUser(null);
      // Determine initial view based on path, if admin path, redirect to admin login
      if (window.location.pathname.startsWith('/admin')) {
        setCurrentView('admin-login');
      } else {
        setCurrentView('login');
      }
    }
  }, [token]);

  const fetchUserRequests = async (authToken: string, position: string) => {
    try {
      const config = {
        headers: {
          'x-auth-token': authToken,
        },
      };
      const res = await axios.get('http://localhost:5000/api/requests', config);
      setUserRequests(res.data);
    } catch (error) {
      console.error('Failed to fetch user requests:', error);
    }
  };

  const handleLogin = (userData: any) => {
    const newToken = localStorage.getItem('token');
    setToken(newToken);
    // The useEffect will handle setting isLoggedIn, isAdmin, user, and currentView
  };

  const handleAdminLogin = (userData: any) => {
    const newToken = localStorage.getItem('token');
    setToken(newToken);
    // The useEffect will handle setting isLoggedIn, isAdmin, user, and currentView
  };

  const handleRegister = (userData: any) => {
    const newToken = localStorage.getItem('token');
    setToken(newToken);
    // The useEffect will handle setting isLoggedIn, isAdmin, user, and currentView
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const handlePlateRequestSubmit = async (formData: { vehicleColor: string, vehicleChassisNumber: string }) => {
    try {
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };
      const res = await axios.post('http://localhost:5000/api/requests', formData, config);
      console.log('New Plate Request Submitted:', res.data);
      if (user) {
        setUser({ ...user, plateRequestStatus: res.data.plateRequestStatus });
      }
      fetchUserRequests(token!, user?.position || 'user');
    } catch (error) {
      console.error('Failed to submit plate request:', error);
    }
  };

  const handlePaymentSuccess = () => {
    // This will ideally trigger a backend update for payment status
    // For now, we'll just refetch requests
    if (token && user) {
      fetchUserRequests(token, user.position);
    }
  };

  const handleScanComplete = (scannedUserData: UserData) => {
    console.log('QR Scan Complete:', scannedUserData);
    alert(`Scanned User: ${scannedUserData.name}, Status: ${scannedUserData.plateRequestStatus}`);
    // Optionally, update user requests in admin dashboard if admin is logged in
  };

  const handleUpdateUserRequestStatus = async (id: string, newStatus: UserData['plateRequestStatus']) => {
    try {
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };
      const res = await axios.put(`http://localhost:5000/api/requests/${id}/status`, { status: newStatus }, config);
      console.log('Updated request status:', res.data);
      fetchUserRequests(token!, user?.position || 'user');
    } catch (error) {
      console.error('Failed to update request status:', error);
    }
  };

  const handleDeleteUserRequest = async (id: string) => {
    try {
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };
      await axios.delete(`http://localhost:5000/api/requests/${id}`, config);
      console.log('Request deleted:', id);
      fetchUserRequests(token!, user?.position || 'user');
    } catch (error) {
      console.error('Failed to delete request:', error);
    }
  };

  const handleUpdateProfile = async (profileData: FormData) => {
    try {
      const config = {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'multipart/form-data',
        },
      };
      // Assume profileData can contain both text fields and the passportImage file
      const res = await axios.put('http://localhost:5000/api/profile', profileData, config);
      console.log('Profile updated:', res.data);

      if (profileData.has('passportImage')) {
        const imageRes = await axios.post('http://localhost:5000/api/profile/passport', profileData, config);
        console.log('Passport image uploaded:', imageRes.data);
      }
      // Re-fetch user data to update the UI with new profile info
      fetchUserRequests(token!, user?.position || 'user'); // This might need a dedicated fetchUser function
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };
return (
  <div className="app-container">
      <header className="app-header">
        <h1>Welcome to AdaQ</h1>
        <p>A Plate Number Verification System</p>
        <nav>
          {!isLoggedIn ? (
            <>
              {currentView === 'admin-login' ? (
                <button onClick={() => setCurrentView('login')} className={currentView === 'login' ? 'active' : ''}>User Login</button>
              ) : (
                <>
                  <button onClick={() => setCurrentView('login')} className={currentView === 'login' ? 'active' : ''}>Login</button>
                  <button onClick={() => setCurrentView('register')} className={currentView === 'register' ? 'active' : ''}>Register</button>
                </>
              )}
              <button onClick={() => setCurrentView('admin-login')} className={currentView === 'admin-login' ? 'active' : ''}>Admin Login</button>
            </>
          ) : (
            <>
              <button onClick={() => setCurrentView('dashboard')} className={currentView === 'dashboard' ? 'active' : ''}>Dashboard</button>
              <button onClick={() => setCurrentView('qrscanner')} className={currentView === 'qrscanner' ? 'active' : ''}>Scan QR</button>
              {isAdmin && (
                <button onClick={() => setCurrentView('admin')} className={currentView === 'admin' ? 'active' : ''}>Admin Dashboard</button>
              )}
              <button onClick={handleLogout}>Logout</button>
            </>
          )}
        </nav>
      </header>
      <main className="app-main">
        {currentView === 'login' && <Login onLogin={handleLogin} />}
        {currentView === 'register' && <Register onRegister={handleRegister} />}
        {currentView === 'admin-login' && <AdminLogin onLogin={handleAdminLogin} />}
        {currentView === 'dashboard' && isLoggedIn && user && (
          <Dashboard user={user} onPlateRequestSubmit={handlePlateRequestSubmit} onPaymentSuccess={handlePaymentSuccess} onUpdateProfile={handleUpdateProfile} />
        )}
        {currentView === 'qrscanner' && isLoggedIn && (
          <QRCodeScanner onScanComplete={handleScanComplete} />
        )}
        {currentView === 'admin' && isLoggedIn && isAdmin && (
          <AdminDashboard 
            userRequests={userRequests} 
            onUpdateStatus={handleUpdateUserRequestStatus} 
            onDeleteRequest={handleDeleteUserRequest} 
          />
        )}
      </main>
    </div>
  )};
  

export default App;
