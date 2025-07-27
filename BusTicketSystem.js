import React, { useState } from 'react';
import { QrCode } from 'lucide-react';

// Main component for the Bus Ticket Booking System
const BusTicketSystem = () => {
  // State to manage the current step in the booking process
  const [currentStep, setCurrentStep] = useState(1);
  
  // State to store all the data for the ticket
  const [ticketData, setTicketData] = useState({
    busColor: '',
    busNumber: '',
    busRoute: '',
    startingStop: '',
    endingStop: '',
    bookingTime: '',
    fare: '',
    discountedFare: '',
    ticketCount: 1
  });

  // State to control the visibility of the final ticket
  const [showTicket, setShowTicket] = useState(false);
  
  // State to store the generated transaction ID
  const [transactionId, setTransactionId] = useState('');
  
  // State to control the visibility of the QR code modal
  const [showQRModal, setShowQRModal] = useState(false);
  
  // State to store the data for the QR code
  const [qrData, setQrData] = useState('');

  /**
   * Generates a random string for the QR code data.
   * This mimics a specific encrypted format.
   * @returns {string} A randomly generated string for the QR code.
   */
  const generateQRData = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    let result = 'gAAAAA';
    // Generate a random string of 160 characters
    for (let i = 0; i < 160; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    result += '==';
    return result;
  };

  /**
   * Generates a unique transaction ID based on the specified date.
   * Format: T{DDMMYYYY}{12 random alphanumeric chars}
   * @returns {string} The generated transaction ID.
   */
  const generateTransactionId = () => {
    const dateStr = '27072025'; // Using the specified date: July 27, 2025
    const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
    
    let randomStr = '';
    // Generate 12 random uppercase alphanumeric characters
    for (let i = 0; i < 12; i++) {
      randomStr += upperChars.charAt(Math.floor(Math.random() * upperChars.length));
    }
    
    // Randomly replace 1 or 2 characters with lowercase letters
    const numLowercase = Math.random() < 0.5 ? 1 : 2;
    for (let i = 0; i < numLowercase; i++) {
      const randomPos = Math.floor(Math.random() * 12);
      const randomLower = lowerChars.charAt(Math.floor(Math.random() * lowerChars.length));
      randomStr = randomStr.substring(0, randomPos) + randomLower + randomStr.substring(randomPos + 1);
    }
    
    return `T${dateStr}${randomStr}`;
  };

  /**
   * Gets the Tailwind CSS background color class based on the bus type.
   * @param {string} busType - The color/type of the bus.
   * @returns {string} The corresponding Tailwind CSS class.
   */
  const getBackgroundColor = (busType) => {
    switch(busType) {
      case 'Red': return 'bg-red-500';
      case 'Blue Dark': return 'bg-blue-800';
      case 'Blue Light': return 'bg-blue-400';
      case 'Orange': return 'bg-orange-500';
      default: return 'bg-red-500'; // Default color
    }
  };

  /**
   * Calculates the discounted fare (10% discount).
   * @param {string} originalFare - The original fare amount.
   * @returns {string} The discounted fare, formatted to 2 decimal places.
   */
  const calculateDiscountedFare = (originalFare) => {
    const discount = parseFloat(originalFare) * 0.9;
    return discount.toFixed(2);
  };

  /**
   * Returns the specified date and time for the booking.
   * @returns {string} The formatted date and time string.
   */
  const getBookingDateTime = () => {
    return '27 Jul 25 | 12:28 PM'; // Using the specified date and time
  };

  /**
   * Handles moving to the next step or generating the ticket.
   */
  const handleNext = () => {
    if (currentStep < 8) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final step: Generate all ticket data
      const discounted = calculateDiscountedFare(ticketData.fare);
      const txnId = generateTransactionId();
      const qrDataGenerated = generateQRData();
      
      setTicketData(prev => ({ 
        ...prev, 
        discountedFare: discounted,
        bookingTime: getBookingDateTime()
      }));
      setTransactionId(txnId);
      setQrData(qrDataGenerated);
      setShowTicket(true); // Display the ticket view
    }
  };

  /**
   * Updates the ticket data state when a user interacts with a form field.
   * @param {string} field - The field in the ticketData object to update.
   * @param {any} value - The new value for the field.
   */
  const handleInputChange = (field, value) => {
    setTicketData(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Resets the entire booking process to its initial state.
   */
  const resetBooking = () => {
    setCurrentStep(1);
    setTicketData({
      busColor: '',
      busNumber: '',
      busRoute: '',
      startingStop: '',
      endingStop: '',
      bookingTime: '',
      fare: '',
      discountedFare: '',
      ticketCount: 1
    });
    setShowTicket(false);
    setTransactionId('');
    setShowQRModal(false);
    setQrData('');
  };

  // Render the final ticket view if showTicket is true
  if (showTicket) {
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;
    const backgroundColorClass = getBackgroundColor(ticketData.busColor);

    return (
      <div className={`min-h-screen ${backgroundColorClass} p-4 font-sans`}>
        {/* Header Section */}
        <div className="flex justify-between items-center text-white mb-8">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚠️</span>
            <span className="text-lg">Issue with ticket?</span>
          </div>
          <button 
            onClick={resetBooking}
            className="underline text-white"
          >
            Book Another Ticket
          </button>
        </div>

        {/* Ticket Card */}
        <div className="bg-white rounded-lg p-6 mx-auto max-w-md shadow-lg">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Transport Dept. of Delhi</h2>
          </div>

          <div className="flex justify-between items-center mb-4 pb-2 border-b-2 border-black">
            <span className="text-2xl font-semibold">{ticketData.busNumber}</span>
            <span className="text-xl font-semibold">₹{ticketData.discountedFare}</span>
          </div>

          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="text-sm text-gray-600">Bus Route</div>
              <div className="text-xl font-semibold">{ticketData.busRoute}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Fare</div>
              <div className="text-xl font-semibold">₹{ticketData.fare}</div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="text-sm text-gray-600">Booking Time</div>
              <div className="text-lg">{ticketData.bookingTime}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Tickets</div>
              <div className="text-lg">{ticketData.ticketCount}</div>
            </div>
          </div>

          <div className="mb-3">
            <div className="text-sm text-gray-600">Starting stop</div>
            <div className="text-lg font-medium">{ticketData.startingStop}</div>
          </div>

          <div className="mb-4">
            <div className="text-sm text-gray-600">Ending stop</div>
            <div className="text-lg font-medium">{ticketData.endingStop}</div>
          </div>

          <div className="text-center mb-4">
            <div className="text-sm font-mono text-gray-500">{transactionId}</div>
          </div>

          <div className="mb-4">
            <button 
              onClick={() => setShowQRModal(true)}
              className="w-full bg-green-200 border-2 border-green-400 rounded-lg py-3 flex items-center justify-center gap-2 hover:bg-green-300 transition-colors"
            >
              <QrCode className="w-6 h-6" />
              <span className="text-lg font-semibold">Show QR code</span>
            </button>
          </div>

          <div className="text-center">
            <img 
              src="https://cxotoday.com/wp-content/uploads/2024/05/ONDC-Logo.png" 
              alt="ONDC Network" 
              className="h-12 mx-auto"
              onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/200x50/cccccc/000000?text=ONDC+Logo'; }}
            />
          </div>
        </div>

        {/* QR Code Modal */}
        {showQRModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" onClick={() => setShowQRModal(false)}>
            <div className="bg-white rounded-lg p-6 max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-xl font-semibold text-center mb-4">QR Code</h3>
              <div className="flex justify-center mb-4">
                <img 
                  src={qrCodeUrl} 
                  alt="QR Code" 
                  className="w-48 h-48 border border-gray-300"
                />
              </div>
              <div className="text-center text-sm text-gray-600 mb-4">
                 <p className="font-semibold mb-1">Scan this code with the conductor</p>
                 <div className="font-mono text-xs break-all bg-gray-100 p-2 rounded max-h-20 overflow-y-auto">
                   {qrData}
                 </div>
              </div>
              <button
                onClick={() => setShowQRModal(false)}
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render the booking form
  return (
    <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center font-sans">
      <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-xl p-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Delhi Bus Ticket Booking
        </h1>
        
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-2 text-center">Step {currentStep} of 8</div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${(currentStep / 8) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step 1: Select Bus Type */}
        {currentStep === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Select Bus Type</h2>
            <div className="space-y-3">
              {['Red', 'Blue Dark', 'Blue Light', 'Orange'].map(color => (
                <button
                  key={color}
                  onClick={() => handleInputChange('busColor', color)}
                  className={`w-full p-4 rounded-lg border-2 text-left font-semibold transition-all ${
                    ticketData.busColor === color 
                      ? `border-${color.split(' ')[0].toLowerCase()}-500 bg-${color.split(' ')[0].toLowerCase()}-50 ring-2 ring-${color.split(' ')[0].toLowerCase()}-400`
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {color === 'Red' && '🔴'}
                  {color === 'Blue Dark' && '🔵'}
                  {color === 'Blue Light' && '💧'}
                  {color === 'Orange' && '🟠'}
                  {' '}{color} Bus
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Enter Bus Number */}
        {currentStep === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Enter Bus Number</h2>
            <input
              type="text"
              placeholder="e.g., DL1PD6008"
              value={ticketData.busNumber}
              onChange={(e) => handleInputChange('busNumber', e.target.value.toUpperCase())}
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <div className="text-sm text-gray-500 mt-2">
              Enter the bus registration number.
            </div>
          </div>
        )}

        {/* Step 3: Enter Bus Route */}
        {currentStep === 3 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Enter Bus Route</h2>
            <input
              type="text"
              placeholder="e.g., 740, OMS(-), etc."
              value={ticketData.busRoute}
              onChange={(e) => handleInputChange('busRoute', e.target.value)}
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
             <div className="text-sm text-gray-500 mt-2">
              Enter the route code or name.
            </div>
          </div>
        )}

        {/* Step 4: Starting Stop */}
        {currentStep === 4 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Starting Stop</h2>
            <input
              type="text"
              placeholder="e.g., D Block Janak Puri"
              value={ticketData.startingStop}
              onChange={(e) => handleInputChange('startingStop', e.target.value)}
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
             <div className="text-sm text-gray-500 mt-2">
              Enter your boarding stop name.
            </div>
          </div>
        )}

        {/* Step 5: Ending Stop */}
        {currentStep === 5 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Ending Stop</h2>
            <input
              type="text"
              placeholder="e.g., Uttam Nagar Terminal"
              value={ticketData.endingStop}
              onChange={(e) => handleInputChange('endingStop', e.target.value)}
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <div className="text-sm text-gray-500 mt-2">
              Enter your destination stop name.
            </div>
          </div>
        )}

        {/* Step 6: Enter Fare */}
        {currentStep === 6 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Enter Fare Amount</h2>
            <input
              type="number"
              placeholder="e.g., 10.00"
              value={ticketData.fare}
              onChange={(e) => handleInputChange('fare', e.target.value)}
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
              step="1"
              min="0"
            />
            <div className="text-sm text-gray-500 mt-2">
              Enter the original fare per ticket in rupees.
            </div>
          </div>
        )}
        
        {/* Step 7: Number of Tickets */}
        {currentStep === 7 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Number of Tickets</h2>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(count => (
                <button
                  key={count}
                  onClick={() => handleInputChange('ticketCount', count)}
                  className={`w-full p-4 rounded-lg border-2 transition-all ${
                    ticketData.ticketCount === count 
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-400' 
                      : 'border-gray-300 hover:border-blue-300'
                  }`}
                >
                  {count} Ticket{count > 1 ? 's' : ''}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 8: Booking Summary */}
        {currentStep === 8 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Confirm Booking</h2>
            <div className="space-y-2 text-base p-4 bg-gray-50 rounded-lg border">
              <div className="flex justify-between"><span className="text-gray-600">Bus Type:</span><span className="font-medium">{ticketData.busColor}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Bus Number:</span><span className="font-medium">{ticketData.busNumber}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Route:</span><span className="font-medium">{ticketData.busRoute}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">From:</span><span className="font-medium text-right">{ticketData.startingStop}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">To:</span><span className="font-medium text-right">{ticketData.endingStop}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Tickets:</span><span className="font-medium">{ticketData.ticketCount}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Original Fare:</span><span className="font-medium">₹{parseFloat(ticketData.fare).toFixed(2)}</span></div>
              <div className="flex justify-between border-t pt-2 mt-2">
                <span className="font-semibold">You Pay (10% off):</span>
                <span className="font-bold text-green-600 text-lg">₹{calculateDiscountedFare(ticketData.fare)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-8">
          {currentStep > 1 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
            >
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={
              (currentStep === 1 && !ticketData.busColor) ||
              (currentStep === 2 && !ticketData.busNumber) ||
              (currentStep === 3 && !ticketData.busRoute) ||
              (currentStep === 4 && !ticketData.startingStop) ||
              (currentStep === 5 && !ticketData.endingStop) ||
              (currentStep === 6 && (!ticketData.fare || ticketData.fare <= 0)) ||
              (currentStep === 7 && !ticketData.ticketCount)
            }
            className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {currentStep === 8 ? 'Generate Ticket' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusTicketSystem;

