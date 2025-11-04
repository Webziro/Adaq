import React from 'react';

interface PaymentButtonProps {
  amount: number;
  onSuccess: () => void;
  onClose: () => void;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ amount, onSuccess, onClose }) => {
  const handlePayment = () => {
    // In a real application, you would integrate with Paystack's SDK here.
    // This is a placeholder for demonstration purposes.
    console.log(`Initiating payment for amount: ${amount}`);
    alert(`Simulating payment of ${amount}. In a real app, this would redirect to Paystack.`);
    // Simulate success after a delay
    setTimeout(() => {
      onSuccess();
    }, 2000);
  };

  return (
    <button onClick={handlePayment} className="payment-button">
      Pay Now (₦{amount})
    </button>
  );
};

export default PaymentButton;
