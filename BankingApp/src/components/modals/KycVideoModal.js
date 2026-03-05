// src/components/modals/KycVideoModal.js
import React, { useState, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import './Modals.css';

const KycVideoModal = ({ isOpen, onClose, kycId }) => {
  const [step, setStep] = useState(1);
  const [faceCaptured, setFaceCaptured] = useState(false);
  const [faceImageUrl, setFaceImageUrl] = useState(null);
  const [aadharUploaded, setAadharUploaded] = useState(false);
  const [panUploaded, setPanUploaded] = useState(false);
  const [documentsUploaded, setDocumentsUploaded] = useState(false);
  const [aadharPreview, setAadharPreview] = useState(null);
  const [panPreview, setPanPreview] = useState(null);
  const [locationObtained, setLocationObtained] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [location, setLocation] = useState('');
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);
  const { showAlert, currentUser } = useAppContext();
  const maskedPhone =
    currentUser?.phone && String(currentUser.phone).length >= 4
      ? `+91 ******${String(currentUser.phone).slice(-4)}`
      : '+91 **********';

  const updateKycStep = async (payload) => {
    if (!kycId) return;
    try {
      await fetch(
        `${process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api"}/kyc/${kycId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("bankfinance_user") || "{}").token || ""
            }`,
          },
          body: JSON.stringify(payload),
        }
      );
    } catch (e) {
      console.error("Failed to update KYC", e);
    }
  };

  if (!isOpen) return null;

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      showAlert('Camera started', 'success');
    } catch (err) {
      showAlert('Camera access denied', 'error');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const captureFace = async () => {
    if (!videoRef.current || !canvasRef.current) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Ensure video has loaded a frame
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      showAlert('Please wait for camera to start properly, then try again.', 'warning');
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/png');
    setFaceCaptured(true);
    setFaceImageUrl(dataUrl);
    showAlert('Face captured!', 'success');
    await updateKycStep({ faceVerified: true, faceImage: dataUrl });

    // Turn off camera after successful capture
    stopCamera();
  };

  const handleFileUpload = async (type, event) => {
    const file = event?.target?.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const dataUrl = reader.result;

      if (type === 'Aadhar') {
        setAadharPreview(dataUrl);
        setAadharUploaded(true);
        await updateKycStep({ documentsVerified: true, aadharImage: dataUrl });
      } else if (type === 'PAN') {
        setPanPreview(dataUrl);
        setPanUploaded(true);
        await updateKycStep({ panImage: dataUrl });
      }

      const docsDone = (type === 'Aadhar' ? true : aadharUploaded) && (type === 'PAN' ? true : panUploaded);
      setDocumentsUploaded(docsDone);
      showAlert(`${type} uploaded successfully`, 'success');
    };

    reader.readAsDataURL(file);
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation(
            `Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)}`
          );
          setLocationObtained(true);
          showAlert('Location verified', 'success');
          await updateKycStep({ locationVerified: true, location: loc });
        },
        (error) => {
          showAlert('Location error: ' + error.message, 'error');
        }
      );
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      if (value && index < 5) {
        document.getElementById(`kycOtp${index + 2}`)?.focus();
      }
      
      if (newOtp.every(d => d)) {
        setOtpVerified(true);
        showAlert('OTP entered', 'info');
      }
    }
  };

  const handleNext = () => {
    if (step === 1 && !faceCaptured) {
      showAlert('Capture face first', 'warning');
      return;
    }
    if (step === 2 && !documentsUploaded) {
      showAlert('Upload documents first', 'warning');
      return;
    }
    if (step === 3 && !locationObtained) {
      showAlert('Get location first', 'warning');
      return;
    }
    if (step < 4) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleComplete = async () => {
    if (!otpVerified) {
      showAlert('Verify OTP first', 'warning');
      return;
    }
    await updateKycStep({ otpVerified: true });
    showAlert('KYC completed successfully!', 'success');
    stopCamera();
    onClose();
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Video KYC Verification</h2>
          <button className="modal-close" onClick={handleClose}>&times;</button>
        </div>
        <div className="modal-body">
          {step === 1 && (
            <div className="kyc-step-content">
              <div className="camera-container">
                <video ref={videoRef} id="cameraFeed" autoPlay playsInline></video>
                {/* Hidden canvas for capturing snapshot */}
                <canvas ref={canvasRef} style={{ display: 'none' }} />
              </div>
              <div className="camera-controls">
                <button className="btn btn-primary" onClick={startCamera}>
                  <i className="fas fa-camera"></i> Start
                </button>
                <button className="btn btn-success" onClick={captureFace} disabled={!streamRef.current}>
                  <i className="fas fa-camera-retro"></i> Capture
                </button>
              </div>
              {faceCaptured && (
                <div className="face-preview" style={{ marginTop: '1rem' }}>
                  <p style={{ color: 'var(--success-color)' }}>
                    <i className="fas fa-check-circle"></i> Face captured!
                  </p>
                  {faceImageUrl && (
                    <img
                      src={faceImageUrl}
                      alt="Captured face"
                      style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', marginTop: '0.5rem' }}
                    />
                  )}
                </div>
              )}
            </div>
          )}
          
          {step === 2 && (
            <div className="kyc-step-content kyc-docs-step" style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div className="docs-upload-left" style={{ flex: '1 1 220px' }}>
                <div
                  className="upload-area"
                  style={{ cursor: 'pointer' }}
                  onClick={() => document.getElementById('aadharInput').click()}
                >
                  <i className="fas fa-cloud-upload-alt"></i>
                  <h3>Upload Aadhar Card</h3>
                  <p>Click to upload</p>
                  <input 
                    type="file" 
                    id="aadharInput" 
                    style={{ display: 'none' }} 
                    accept="image/*"
                    onChange={(e) => handleFileUpload('Aadhar', e)}
                  />
                </div>
                
                <div
                  className="upload-area"
                  style={{ cursor: 'pointer', marginTop: '1rem' }}
                  onClick={() => document.getElementById('panInput').click()}
                >
                  <i className="fas fa-cloud-upload-alt"></i>
                  <h3>Upload PAN Card</h3>
                  <p>Click to upload</p>
                  <input 
                    type="file" 
                    id="panInput" 
                    style={{ display: 'none' }} 
                    accept="image/*"
                    onChange={(e) => handleFileUpload('PAN', e)}
                  />
                </div>
              </div>

              <div className="docs-preview-right" style={{ flex: '1 1 220px' }}>
                {aadharPreview && (
                  <div style={{ marginBottom: '1rem' }}>
                    <h4>Aadhar Preview</h4>
                    <img
                      src={aadharPreview}
                      alt="Aadhar preview"
                      style={{ maxWidth: '100%', maxHeight: '160px', borderRadius: '8px' }}
                    />
                  </div>
                )}
                {panPreview && (
                  <div>
                    <h4>PAN Preview</h4>
                    <img
                      src={panPreview}
                      alt="PAN preview"
                      style={{ maxWidth: '100%', maxHeight: '160px', borderRadius: '8px' }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
            
          {step === 3 && (
            <div className="kyc-step-content">
              <div className="location-info">
                <h4>Your Location:</h4>
                <div className="location-detail">
                  <i className="fas fa-map-marker-alt" style={{ color: 'var(--danger-color)', fontSize: '1.5rem' }}></i>
                  <div>
                    <strong>{location || 'Not obtained'}</strong>
                  </div>
                </div>
                <button className="btn btn-primary" onClick={getLocation}>
                  <i className="fas fa-location-arrow"></i> Get Location
                </button>
              </div>
            </div>
          )}
          
          {step === 4 && (
            <div className="kyc-step-content">
              <h4>Mobile OTP Verification</h4>
              <p>OTP sent to {maskedPhone}</p>
              
              <div className="otp-group">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    className="otp-input"
                    id={`kycOtp${index + 1}`}
                    value={otp[index]}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                  />
                ))}
              </div>
              
              <button
                className="btn btn-link"
                onClick={() => showAlert('For demo, OTP entered here only', 'info')}
              >
                Resend OTP
              </button>
            </div>
          )}
          
          <div className="modal-actions">
            {step > 1 && (
              <button className="btn btn-warning" onClick={handlePrev}>
                Previous
              </button>
            )}
            {step < 4 ? (
              <button className="btn btn-primary" onClick={handleNext}>
                Next Step
              </button>
            ) : (
              <button className="btn btn-success" onClick={handleComplete}>
                Complete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KycVideoModal;