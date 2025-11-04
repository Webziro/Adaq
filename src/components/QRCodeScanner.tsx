import React, { useState } from 'react';

interface UserData {
  name: string;
  email: string;
  nin: string;
  passport: string;
  vehicleColor: string;
  vehicleChassisNumber: string;
  position: string;
  plateRequestStatus: 'started' | 'in-progress' | 'completed' | 'pending';
}

interface QRCodeScannerProps {
  onScanComplete: (data: UserData) => void;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ onScanComplete }) => {
  const [scanning, setScanning] = useState(false);
  const [qrData, setQrData] = useState<string | null>(null);

  const simulateScan = () => {
    setScanning(true);
    // Simulate a delay for scanning
    setTimeout(() => {
      // Simulate scanned QR code data
      const dummyQRData = {
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        nin: '1098765432',
        passport: 'PQR789UVW',
        vehicleColor: 'Green',
        vehicleChassisNumber: '0987654321FEDCBA',
        position: 'Driver',
        plateRequestStatus: 'completed',
      };
      setQrData(JSON.stringify(dummyQRData));
      setScanning(false);
      onScanComplete(dummyQRData);
    }, 3000);
  };

  return (
    <div className="qr-scanner-container">
      <h2>QR Code Scanner</h2>
      {!scanning && !qrData && (
        <button onClick={simulateScan} className="scan-button">Start Scan</button>
      )}
      {scanning && <p>Scanning...</p>}
      {qrData && (
        <div className="scanned-data">
          <h3>Scanned Information:</h3>
          <pre>{qrData}</pre>
        </div>
      )}
    </div>
  );
};

export default QRCodeScanner;
