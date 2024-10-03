import React, { useEffect, useState } from 'react';
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';

const AdminDashboard = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      loadApplications();
    }
  }, []);

  const loadApplications = async () => {
    try {
      const res = await axios.get('/api/admin/applications');
      setApplications(res.data);
    } catch (err) {
      console.error('Error loading applications', err.response.data);
    }
  };

  const updateApplicationStatus = async (id, status, message) => {
    try {
      await axios.put(`/api/admin/applications/${id}`, { status, message });
      loadApplications(); // Reload applications
    } catch (err) {
      console.error('Error updating application', err.response.data);
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <h2>Pending Applications</h2>
      <ul>
        {applications.map(application => (
          <li key={application._id}>
            <h3>{application.businessName} ({application.businessLocation})</h3>
            <p>{application.businessType}</p>
            <p>{application.businessDescription}</p>
            <button onClick={() => updateApplicationStatus(application._id, 'approved', 'Approved successfully')}>
              Approve
            </button>
            <button onClick={() => updateApplicationStatus(application._id, 'rejected', 'Business does not meet criteria')}>
              Reject
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const viewDocuments = (application) => {
    return (
      <ul>
        {application.documents.map((doc) => (
          <li key={doc._id}>
            <p>{doc.title}</p>
            <a href={`/${doc.filePath}`} target="_blank" rel="noopener noreferrer">
              View Document
            </a>
          </li>
        ))}
      </ul>
    );
  };
  

export default AdminDashboard;
