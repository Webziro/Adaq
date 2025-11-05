import React, { useState } from 'react';
import PlateRegistrationForm from './PlateRegistrationForm';
import PaymentButton from './PaymentButton';

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

interface DashboardProps {
  user: UserData;
  onPlateRequestSubmit: (formData: { vehicleColor: string, vehicleChassisNumber: string }) => void;
  onPaymentSuccess: () => void; 
  onUpdateProfile: (profileData: FormData) => void; // New prop for profile update
}

const Dashboard: React.FC<DashboardProps> = ({ user, onPlateRequestSubmit, onPaymentSuccess, onUpdateProfile }) => {
  const [showPlateForm, setShowPlateForm] = useState(false);
  const [showProfileUpdateForm, setShowProfileUpdateForm] = useState(false);
  const [profileFormData, setProfileFormData] = useState({
    nin: user.nin || '',
    vehicleColor: user.vehicleColor || '',
    vehicleChassisNumber: user.vehicleChassisNumber || '',
    passportImage: null as File | null,
  });

  const handleProfileFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === 'passportImage' && files) {
      setProfileFormData({ ...profileFormData, passportImage: files[0] });
    } else {
      setProfileFormData({ ...profileFormData, [name]: value });
    }
  };

  const handleProfileFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    if (profileFormData.nin) formData.append('nin', profileFormData.nin);
    if (profileFormData.vehicleColor) formData.append('vehicleColor', profileFormData.vehicleColor);
    if (profileFormData.vehicleChassisNumber) formData.append('vehicleChassisNumber', profileFormData.vehicleChassisNumber);
    if (profileFormData.passportImage) formData.append('passportImage', profileFormData.passportImage);

    onUpdateProfile(formData);
    setShowProfileUpdateForm(false);
  };

  const handleFormSubmit = (formData: { vehicleColor: string, vehicleChassisNumber: string }) => {
    onPlateRequestSubmit(formData);
    // setShowPlateForm(false); // Do not hide form yet, wait for payment
  };

  const handlePaymentSuccessClick = () => {
    onPaymentSuccess();
    setShowPlateForm(false);
    alert('Payment successful! Your plate request is now being processed.');
  };

  return (
    <div className="dashboard-container">
      
      <div className="user-details">
        <h3>Your Details</h3>
        <p><strong>Email:</strong> {user.email}</p>
        {user.nin && <p><strong>NIN Number:</strong> {user.nin}</p>}
        {user.passport && <p><strong>Passport:</strong> <img src={`http://localhost:5000${user.passport}`} alt="Passport" style={{width: '100px'}} /></p>}
        {user.vehicleColor && <p><strong>Vehicle Color:</strong> {user.vehicleColor}</p>}
        {user.vehicleChassisNumber && <p><strong>Vehicle Chassis Number:</strong> {user.vehicleChassisNumber}</p>}
        {/* <p><strong>Position:</strong> {user.position}</p> */}
        <button onClick={() => setShowProfileUpdateForm(!showProfileUpdateForm)}>
          {showProfileUpdateForm ? 'Cancel Profile Update' : 'Update Profile'}
        </button>

        {showProfileUpdateForm && (
          <form onSubmit={handleProfileFormSubmit} className="profile-update-form">
            <div className="form-group">
              <label htmlFor="nin">NIN:</label>
              <input
                type="text"
                id="nin"
                name="nin"
                value={profileFormData.nin}
                onChange={handleProfileFormChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="vehicleColor">Vehicle Color:</label>
              <input
                type="text"
                id="vehicleColor"
                name="vehicleColor"
                value={profileFormData.vehicleColor}
                onChange={handleProfileFormChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="vehicleChassisNumber">Vehicle Chassis Number:</label>
              <input
                type="text"
                id="vehicleChassisNumber"
                name="vehicleChassisNumber"
                value={profileFormData.vehicleChassisNumber}
                onChange={handleProfileFormChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="passportImage">Passport Image:</label>
              <input
                type="file"
                id="passportImage"
                name="passportImage"
                accept="image/*"
                onChange={handleProfileFormChange}
              />
            </div>
            <button type="submit">Save Profile</button>
          </form>
        )}
      </div>
      
      <div className="plate-request-status">
        <h3>Plate Number Request Status</h3>
        <p>Your request is currently: <strong>{user.plateRequestStatus || 'N/A'}</strong></p>
        {user.plateRequestStatus === 'pending' && (
          <PaymentButton 
            amount={5000} // Example amount
            onSuccess={handlePaymentSuccessClick}
            onClose={() => {}}
          />
        )}
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <p>Request or Renew your Number</p>
        {!showPlateForm && user.plateRequestStatus !== 'in-progress' && (
          <button onClick={() => setShowPlateForm(true)}>Request Now</button>
        )}
        {showPlateForm && (
          <PlateRegistrationForm onSubmit={handleFormSubmit} onPaymentSuccess={handlePaymentSuccessClick} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
