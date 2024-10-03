import React, { useEffect, useState } from 'react';
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import DocumentUpload from './DocumentUpload';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      loadDashboardData();
    }
  }, []);

  const loadDashboardData = async () => {
    try {
      const res = await axios.get('/api/user/dashboard');
      setUserData(res.data);
    } catch (err) {
      console.error('Error loading dashboard data', err.response.data);
    }
  };

  return (
    <div>
      {userData ? (
        <div>
          <h1>Welcome, {userData.fullName}</h1>
          <p>Email: {userData.email}</p>
          {/* Display contract and rent status */}
          <DocumentUpload />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;
