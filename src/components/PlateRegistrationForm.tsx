import React, { useState } from 'react';
import PaymentButton from './PaymentButton';

interface PlateRegistrationFormProps {
  onSubmit: (formData: any) => void;
  onPaymentSuccess: () => void; // New prop for payment success
}

const PlateRegistrationForm: React.FC<PlateRegistrationFormProps> = ({ onSubmit, onPaymentSuccess }) => {
  const [name, setName] = useState('');
  const [ninNumber, setNinNumber] = useState('');
  const [passport, setPassport] = useState('');
  const [vehicleColor, setVehicleColor] = useState('');
  const [vehicleChassisNumber, setVehicleChassisNumber] = useState('');
  const [position, setPosition] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name,
      ninNumber,
      passport,
      vehicleColor,
      vehicleChassisNumber,
      position,
    };
    setFormData(data);
    setShowPayment(true);
    onSubmit(data); // Pass data to parent component immediately, then handle payment
  };

  const handlePaymentSuccess = () => {
    onPaymentSuccess();
    setShowPayment(false);
    // Optionally clear form or redirect
  };

  const handlePaymentClose = () => {
    setShowPayment(false);
    alert('Payment was closed. Please try again to complete your registration.');
  };

  if (showPayment) {
    return (
      <div className="payment-section">
        <h2>Complete Your Payment</h2>
        <p>Your request has been submitted. Please complete the payment to finalize.</p>
        <PaymentButton
          amount={5000} // Example amount
          onSuccess={handlePaymentSuccess}
          onClose={handlePaymentClose}
        />
        <button onClick={handlePaymentClose} className="cancel-payment-button">Cancel Payment</button>
      </div>
    );
  }

  return (
    <div className="plate-registration-form-container">
      <h2>New Plate Number Request</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="ninNumber">NIN Number (10 digits):</label>
          <input
            type="text"
            id="ninNumber"
            value={ninNumber}
            onChange={(e) => setNinNumber(e.target.value)}
            maxLength={10}
            pattern="[0-9]{10}"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="passport">Passport:</label>
          <input
            type="text"
            id="passport"
            value={passport}
            onChange={(e) => setPassport(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="vehicleColor">Vehicle Color:</label>
          <input
            type="text"
            id="vehicleColor"
            value={vehicleColor}
            onChange={(e) => setVehicleColor(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="vehicleChassisNumber">Vehicle Chassis Number (18 digits):</label>
          <input
            type="text"
            id="vehicleChassisNumber"
            value={vehicleChassisNumber}
            onChange={(e) => setVehicleChassisNumber(e.target.value)}
            maxLength={18}
            pattern="[A-Za-z0-9]{18}"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="position">Position:</label>
          <input
            type="text"
            id="position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit Request</button>
      </form>
    </div>
  );
};

export default PlateRegistrationForm;
