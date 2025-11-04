import React, { useState } from 'react';

interface UserRequestData {
  id: string;
  name: string;
  email: string;
  nin: string;
  passport: string;
  vehicleColor: string;
  vehicleChassisNumber: string;
  position: string;
  plateRequestStatus: 'started' | 'in-progress' | 'completed' | 'pending';
}

interface AdminDashboardProps {
  userRequests: UserRequestData[];
  onUpdateStatus: (id: string, newStatus: UserRequestData['plateRequestStatus']) => void;
  onDeleteRequest: (id: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ userRequests, onUpdateStatus, onDeleteRequest }) => {
  const [filterStatus, setFilterStatus] = useState<'all' | UserRequestData['plateRequestStatus']>(null);

  const filteredRequests = filterStatus === 'all' || !filterStatus
    ? userRequests
    : userRequests.filter(req => req.plateRequestStatus === filterStatus);

  return (
    <div className="admin-dashboard-container">
      <h2>Admin Dashboard</h2>

      <div className="filter-controls">
        <button onClick={() => setFilterStatus(null)} className={!filterStatus || filterStatus === 'all' ? 'active' : ''}>All</button>
        <button onClick={() => setFilterStatus('pending')} className={filterStatus === 'pending' ? 'active' : ''}>Pending</button>
        <button onClick={() => setFilterStatus('started')} className={filterStatus === 'started' ? 'active' : ''}>Started</button>
        <button onClick={() => setFilterStatus('in-progress')} className={filterStatus === 'in-progress' ? 'active' : ''}>In-Progress</button>
        <button onClick={() => setFilterStatus('completed')} className={filterStatus === 'completed' ? 'active' : ''}>Completed</button>
      </div>

      {filteredRequests.length === 0 ? (
        <p>No requests to display.</p>
      ) : (
        <div className="requests-list">
          {filteredRequests.map((request) => (
            <div key={request.id} className="request-card">
              <h3>Request ID: {request.id}</h3>
              <p><strong>Name:</strong> {request.name}</p>
              <p><strong>Email:</strong> {request.email}</p>
              <p><strong>NIN:</strong> {request.nin}</p>
              <p><strong>Passport:</strong> {request.passport}</p>
              <p><strong>Vehicle:</strong> {request.vehicleColor} (Chassis: {request.vehicleChassisNumber})</p>
              <p><strong>Position:</strong> {request.position}</p>
              <p><strong>Status:</strong> <span className={`status-${request.plateRequestStatus}`}>{request.plateRequestStatus}</span></p>
              <div className="status-actions">
                <select
                  value={request.plateRequestStatus}
                  onChange={(e) => onUpdateStatus(request.id, e.target.value as UserRequestData['plateRequestStatus'])}
                >
                  <option value="pending">Pending</option>
                  <option value="started">Started</option>
                  <option value="in-progress">In-Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <button 
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this request?')) {
                      onDeleteRequest(request.id);
                    }
                  }}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
