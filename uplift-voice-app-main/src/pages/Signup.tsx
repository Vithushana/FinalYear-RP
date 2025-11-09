
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

// --- Mock Data for Position Details Modal ---
const positionData = {
  'Central Province': {
    'District A': {
      'North Region': ['Policy Advisor', 'Support Staff'],
      'South Region': ['Community Manager'],
    },
    'District B': {
      'East Region': ['Department Head', 'Regional Officer'],
      'West Region': ['Support Staff'],
    },
  },
  'Western Province': {
    'District X': {
      'City Region': ['Policy Advisor', 'Community Manager'],
      'Rural Region': ['Regional Officer'],
    },
  },
};

// Helper function to get the list of provinces
const getProvinces = () => Object.keys(positionData);

// --- Position Selection Modal Component ---
const PositionModal = ({ onClose, onSelect }) => {
  const [selections, setSelections] = useState({
    province: '',
    district: '',
    region: '',
    designation: '',
  });

  // Derived state: options available based on current selections
  const districts = selections.province ? Object.keys(positionData[selections.province]) : [];
  const regions = (selections.province && selections.district) ? Object.keys(positionData[selections.province][selections.district]) : [];
  const designations = (selections.province && selections.district && selections.region)
    ? positionData[selections.province][selections.district][selections.region]
    : [];
  
  // Handlers for nested selections
  const handleSelectChange = (name, value) => {
    setSelections(prev => {
      let newState = { ...prev, [name]: value };
      
      // Reset subsequent fields on change
      if (name === 'province') newState = { ...newState, district: '', region: '', designation: '' };
      if (name === 'district') newState = { ...newState, region: '', designation: '' };
      if (name === 'region') newState = { ...newState, designation: '' };
      
      return newState;
    });
  };

  const handleConfirm = () => {
    if (selections.designation) {
      // Pass the final selected designation back to the parent form
      const fullPath = `${selections.designation} (${selections.province}, ${selections.district})`;
      onSelect(fullPath);
    } else {
      // Handle case where OK is clicked but designation isn't selected
      alert("Please select a Designation before confirming.");
    }
  };

  const isComplete = selections.designation !== '';

  return (
    // Modal Overlay
    <div className="fixed inset-0 z-50 bg-gray-900/50 flex items-center justify-center p-4" onClick={onClose}>
      {/* Modal Card (stop clicks from bubbling to overlay) */}
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 opacity-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="position-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h3 id="position-modal-title" className="text-xl font-semibold text-[#1A4776]">Select Position Details</h3>
        </div>

        {/* Content Body (Inputs) */}
        <div className="p-6 space-y-4">
          
          {/* Province */}
          <div>
            <Label htmlFor="modal-province">Province</Label>
            <div className="relative">
              <select
                id="modal-province"
                value={selections.province}
                onChange={(e) => handleSelectChange('province', e.target.value)}
                className="appearance-none flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <option value="" disabled>Select Province</option>
                {getProvinces().map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* District */}
          <div>
            <Label htmlFor="modal-district">District</Label>
            <div className="relative">
              <select
                id="modal-district"
                value={selections.district}
                onChange={(e) => handleSelectChange('district', e.target.value)}
                className="appearance-none flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50"
                disabled={!selections.province}
              >
                <option value="" disabled>Select District</option>
                {districts.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Region */}
          <div>
            <Label htmlFor="modal-region">Region</Label>
            <div className="relative">
              <select
                id="modal-region"
                value={selections.region}
                onChange={(e) => handleSelectChange('region', e.target.value)}
                className="appearance-none flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50"
                disabled={!selections.district}
              >
                <option value="" disabled>Select Region</option>
                {regions.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
          
          {/* Designation */}
          <div>
            <Label htmlFor="modal-designation">Designation</Label>
            <div className="relative">
              <select
                id="modal-designation"
                value={selections.designation}
                onChange={(e) => handleSelectChange('designation', e.target.value)}
                className="appearance-none flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50"
                disabled={!selections.region}
              >
                <option value="" disabled>Select Designation</option>
                {designations.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

        </div>

        {/* Footer (OK Button) */}
        <div className="p-6 border-t border-gray-200 flex justify-end">
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={!isComplete}
            className={`bg-gradient-to-r from-[#1A4776] to-[#1688DF] text-white transition-opacity ${!isComplete ? 'opacity-50 cursor-not-allowed' : 'shadow-md'}`}
          >
            OK
          </Button>
        </div>
      </div>
    </div>
  );
};

// --- OTP Modal Component) ---
const OTPModal = ({ email, onClose, onVerifySuccess }) => {
  const [otp, setOtp] = useState(new Array(4).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const inputsRef = useRef([]);

  useEffect(() => {
    inputsRef.current[0].focus();
  }, []);

  const handleChange = (e, index) => {
    const { value } = e.target;
    if (/^[0-9]$/.test(value) || value === '') {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move focus to next input
      if (value !== '' && index < 3) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const code = otp.join('');
    
    if (code.length < 4) {
      setError('Please enter all 4 digits.');
      return;
    }
    
    setIsLoading(true);
    setError('');

    // --- Simulate OTP Verification ---
    setTimeout(() => {
      if (code === '1234') {
        onVerifySuccess(); 
      } else {
        setError('Invalid code. Please try again.');
        setIsLoading(false);
        setOtp(new Array(4).fill('')); 
        inputsRef.current[0].focus(); 
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-900/50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-sm transform transition-all duration-300 scale-100 opacity-100 p-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Enter OTP</h3>
        <p className="text-gray-600 mb-6">
          Please enter the 4-digit code sent to your email.
        </p>
        
        <form onSubmit={handleSubmit}>
          {/* OTP Input Boxes */}
          <div className="flex justify-center gap-3 mb-6">
            {otp.map((digit, index) => (
              <Input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputsRef.current[index] = el)}
                className="w-14 h-14 text-center text-2xl font-bold border-gray-300"
                disabled={isLoading}
              />
            ))}
          </div>

          {error && (
            <div className="p-3 rounded-lg text-sm bg-red-100 text-red-700 mb-4">
              {error}
            </div>
          )}

          {/* Enter Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#1A4776] to-[#1688DF] text-white shadow-lg hover:opacity-95"
          >
            {isLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...</>
            ) : (
              'Enter'
            )}
          </Button>
        </form>

        <p className="text-sm text-gray-500 mt-6">
          Didn't receive the code?{' '}
          <button className="font-medium text-blue-600 hover:underline">
            Resend OTP
          </button>
        </p>
      </div>
    </div>
  );
};

// --- Main Application Component ---
const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    position: 'Select your position details',
    phone: '',
    email: '',
    password: '',
    agreed: false,
    securityCode: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.agreed) {
      setMessage('You must agree to all statements to sign up.');
      return;
    }
    
    setIsSubmitting(true);
    setMessage('');

    console.log('Form Data Submitted, sending OTP...:', formData);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsOtpModalOpen(true);
    }, 2000);
  };

  const handleOtpSuccess = () => {
    setIsOtpModalOpen(false);
    navigate('/index');
  };

 // --- Modal Control Functions ---
  const openPositionModal = () => setIsModalOpen(true);
  const closePositionModal = () => setIsModalOpen(false);

  const handlePositionSelect = (newPosition) => {
    setFormData(prev => ({ ...prev, position: newPosition }));
    setIsModalOpen(false); 
  };
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-8xl bg-white overflow-hidden">
        
        <div className="grid lg:grid-cols-2">
          
          {/* Left Panel - Branding and Illustration */}
          <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-white text-center" 
           style={{
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                <img src="/mic.png" alt="Voice Up" className="mb-4 w-20 h-20" />
            <h1
              className="text-5xl font-extrabold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#1A4776] to-[#1688DF]"
            >
              VOICE UP
            </h1>
            <p
              className="text-xl max-w-xl leading-relaxed bg-clip-text text-transparent bg-gradient-to-r from-[#1A4776] to-[#1688DF]"
              style={{
                fontFamily: 'Joan, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
              }}
            >
              Empowering you to serve better — we streamline your tasks and relay every citizen's voice directly to you
            </p>
      <div className="flex items-center justify-center w-full">
        <img src="/img.png" alt="Voice Up" className="mx-auto w-100 max-w-full h-auto object-contain" />
      </div>
          </div>

          {/* Right Panel - Create Account Form */}
          <div className="p-8 sm:p-12 lg:p-16">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#1A4776] to-[#1688DF] mb-5 text-center lg:text-center">
              Create Account
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* 1. Name */}
              <div>
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="relative">
                <Label htmlFor="position-trigger">Position</Label>
                <button
                  type="button" 
                  id="position-trigger"
                  onClick={openPositionModal} 
                  className="
                    appearance-none flex h-10 w-full rounded-lg border border-gray-300 bg-white 
                    px-3 py-2 text-sm ring-offset-white focus-visible:outline-none 
                    focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed 
                    disabled:opacity-50 **text-left** **justify-start** **items-center**
                  "
                >
                  {/* 3. Display the Selected Value */}
                  <span className={`${formData.position ? 'text-gray-900' : 'text-gray-500'}`}>
                    {formData.position || "Select Designation"}
                  </span>
                </button>
              </div>

              {/* 3. Phone Number */}
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              
              {/* 4. Email */}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* 5. Password */}
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* 6. I agree checkbox */}
              <div className="pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    id="agreed"
                    checked={formData.agreed}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, agreed: Boolean(checked) }))
                    }
                  />
                  <span className="text-gray-600 font-normal">I agree to all the statements</span>
                </label>
              </div>

              {/* 7. Security Code */}
              <div>
                <Label htmlFor="securityCode">Security Code</Label>
                <Input
                  id="securityCode"
                  name="securityCode"
                  type="text"
                  placeholder="Enter security code"
                  value={formData.securityCode}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Submission Message */}
              {message && (
                <div className={`p-3 rounded-lg text-sm ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {message}
                </div>
              )}

              {/* Sign Up Button */}
              <div className="pt-4">
                <Button
                  className="w-full bg-gradient-to-r from-[#1A4776] to-[#1688DF] text-white shadow-lg hover:opacity-95"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait</>
                  ) : (
                    'Sign Up'
                  )}
                </Button>
              </div>

            </form>
          </div>
        </div>
      </div>
      {/* Render Position Modal */}
      {isModalOpen && (
        <PositionModal 
          onClose={closePositionModal} 
          onSelect={handlePositionSelect} 
        />
      )}
      
      {/* --- NEW --- */}
      {/* Render OTP Modal */}
      {isOtpModalOpen && (
        <OTPModal 
          email={formData.email}
          onClose={() => setIsOtpModalOpen(false)}
          onVerifySuccess={handleOtpSuccess}
        />
      )}
    </div>
  );
};

export default Signup;