import React, { useState } from 'react';

// To ensure the code runs in a single file, all components and interfaces must be defined here.

// --- Interface Definitions ---
interface UserData {
  id: string;
  name: string;
  email: string;
  position: 'user' | 'admin';
  // Added 'N/A' status for initial state
  plateRequestStatus?: 'pending' | 'in-progress' | 'completed' | 'N/A'; 
}

// --- Component 1: PaymentButton (Placeholder) ---
interface PaymentButtonProps {
    onPaymentSuccess: () => void;
}
const PaymentButton: React.FC<PaymentButtonProps> = ({ onPaymentSuccess }) => {
    return (
        <div className="mt-4 p-4 border border-blue-300 rounded-lg bg-blue-50">
            <h4 className="font-semibold text-blue-800">Payment Required</h4>
            <p className="text-sm text-blue-600">Please complete the payment to proceed with your plate request.</p>
            <button 
                onClick={onPaymentSuccess} 
                className="mt-2 w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
            >
                Simulate Payment & Send to Processing
            </button>
        </div>
    );
};


// --- Component 2: PlateRegistrationForm (Placeholder) ---
interface PlateRegistrationFormProps {
    onSubmit: () => void;
    onPaymentSuccess: () => void; 
}
const PlateRegistrationForm: React.FC<PlateRegistrationFormProps> = ({ onSubmit }) => {
    const [vehicleDetails, setVehicleDetails] = useState({ color: '', chassis: '' });
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this data would be sent to the backend before calling onSubmit
        console.log("Submitting vehicle details:", vehicleDetails);
        onSubmit(); // Notify parent of submission (sets status to 'pending')
    };

    return (
        <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-white shadow-lg">
            <h4 className="text-lg font-bold mb-4">New Plate Registration Form</h4>
            <form onSubmit={handleSubmit} className="space-y-3">
                <input 
                    type="text" 
                    placeholder="Vehicle Color" 
                    value={vehicleDetails.color}
                    onChange={(e) => setVehicleDetails({...vehicleDetails, color: e.target.value})}
                    required
                    className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                />
                <input 
                    type="text" 
                    placeholder="Chassis Number" 
                    value={vehicleDetails.chassis}
                    onChange={(e) => setVehicleDetails({...vehicleDetails, chassis: e.target.value})}
                    required
                    className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button 
                    type="submit" 
                    className="w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 transition font-semibold"
                >
                    Submit a Request
                </button>
            </form>
        </div>
    );
};


// --- Component 3: PlateNumberRequest ---
interface PlateNumberRequestProps {
  user: UserData;
  onPlateRequestSubmit: () => void;
  onPaymentSuccess: () => void;
}

const PlateNumberRequest: React.FC<PlateNumberRequestProps> = ({
  user,
  onPlateRequestSubmit,
  onPaymentSuccess,
}) => {
  const [showPlateForm, setShowPlateForm] = useState(false);

  const handleFormSubmit = () => {
      // Passes control to the App component handler
      onPlateRequestSubmit();
      setShowPlateForm(false);
  };
  
  // Determine if a request can be made (only if not already pending/in-progress)
  const canRequestNewPlate = user.plateRequestStatus !== 'in-progress' && user.plateRequestStatus !== 'pending';

  return (
    <div className="plate-request-status p-6 bg-white rounded-xl shadow-2xl">
      <h3 className="text-2xl font-extrabold text-gray-800 mb-4 border-b pb-2">Plate Number Request Status</h3>
      
      <div className="text-lg mb-4 flex items-center">
        Current Status: 
        <strong className={`ml-2 px-3 py-1 rounded-full text-white font-semibold text-sm ${
            user.plateRequestStatus === 'completed' ? 'bg-green-600' :
            user.plateRequestStatus === 'in-progress' ? 'bg-yellow-600' :
            user.plateRequestStatus === 'pending' ? 'bg-red-600' :
            'bg-gray-500'
        }`}>
            {user.plateRequestStatus || 'N/A'}
        </strong>
      </div>

      {/* Show Request button if form is hidden AND user is allowed to make a new request */}
      {!showPlateForm && canRequestNewPlate && (
        <button 
            onClick={() => setShowPlateForm(true)}
            className="text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg p-3 mt-4 transition duration-300 font-bold shadow-md"
        >
            Request New Plate Number
        </button>
      )}

      {/* Show Plate Registration Form if state is true */}
      {showPlateForm && (
        // Passing the onPaymentSuccess handler down, though the form's onSubmit 
        // will trigger the 'pending' status, leading to the PaymentButton display.
        <PlateRegistrationForm onSubmit={handleFormSubmit} onPaymentSuccess={onPaymentSuccess} />
      )}

      {/* Show Payment button only if status is 'pending' */}
      {user.plateRequestStatus === 'pending' && <PaymentButton onPaymentSuccess={onPaymentSuccess} />}
      
      {/* Inform user if the request is being processed */}
      {user.plateRequestStatus === 'in-progress' && (
          <p className="mt-4 p-3 bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500 rounded">
              Your request is currently under administrative review.
          </p>
      )}
    </div>
  );
};


// --- Main App Component ---
function App() {
    // Load Tailwind CSS for styling
    // NOTE: In a real React app, you would configure Tailwind normally, 
    // but here we load the script for styling.
    
    // Initial user state: 'N/A' means no request started yet.
    const [user, setUser] = useState<UserData>({ 
        id: 'u123', 
        name: 'Jane Doe', 
        email: 'jane@example.com', 
        position: 'user', 
        plateRequestStatus: 'N/A' 
    });

    // Handler 1: Sets status to PENDING after the form is submitted
    const handleFormSubmit = () => {
        console.log("App: Form Submitted. Setting status to 'pending' (Awaiting Payment).");
        setUser(prev => ({ ...prev, plateRequestStatus: 'pending' }));
    };
    
    // Handler 2: Sets status to IN-PROGRESS after payment is complete
    const handlePaymentSuccess = () => {
        console.log("App: Payment success. Setting status to 'in-progress' (Under Review).");
        setUser(prev => ({ ...prev, plateRequestStatus: 'in-progress' }));
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-start justify-center p-8 font-sans">
            <script src="https://cdn.tailwindcss.com"></script>
            <div className="w-full max-w-xl">
                <h1 className="text-4xl font-black text-center text-indigo-700 mb-8">AdaQ Plate Request Simulation</h1>
                
                {/* Status/Debug Bar */}
                <div className="mb-6 p-4 bg-white rounded-xl shadow-lg border border-gray-200">
                    <h2 className="text-xl font-semibold mb-2 text-gray-700">User Dashboard Controls</h2>
                    <div className="flex flex-col space-y-2 text-sm">
                        <span>Current User Status: <strong className="text-indigo-600 font-bold">{user.plateRequestStatus}</strong></span>
                        <div className="flex space-x-2 pt-2 border-t mt-2">
                             <button 
                                onClick={() => setUser(prev => ({...prev, plateRequestStatus: 'N/A'}))}
                                className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition text-xs"
                            >
                                Reset Status
                            </button>
                            <button 
                                onClick={() => setUser(prev => ({...prev, plateRequestStatus: 'completed'}))}
                                className="px-3 py-1 bg-green-200 text-green-800 rounded-md hover:bg-green-300 transition text-xs"
                            >
                                Simulate Admin Approval
                            </button>
                        </div>
                    </div>
                </div>

                <PlateNumberRequest
                    user={user}
                    onPlateRequestSubmit={handleFormSubmit}
                    onPaymentSuccess={handlePaymentSuccess}
                />
            </div>
        </div>
    );
}

export default App;
