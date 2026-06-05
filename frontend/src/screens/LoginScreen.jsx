import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Card, InputGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineMail, AiOutlineLock, AiOutlinePhone } from 'react-icons/ai';
import { RecaptchaVerifier, signInWithPhoneNumber, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import axios from 'axios';
import { setCredentials } from '../slices/userSlice';
import { fetchUserCart } from '../slices/cartSlice';

const LoginScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirect = new URLSearchParams(search).get('redirect') || '/';
  const { userInfo } = useSelector((state) => state.user);

  // Layout View Controls
  const [isPhoneLogin, setIsPhoneLogin] = useState(false);
  const [showOtpScreen, setShowOtpScreen] = useState(false);

  // Form Inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  
  // OTP Individual Digits State
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);

  // Technical verification holders
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    if (userInfo) navigate(redirect);
  }, [navigate, redirect, userInfo]);

  // Handle Countdown timer for OTP screen
  useEffect(() => {
    let interval;
    if (showOtpScreen && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [showOtpScreen, timer]);

  // Secure Email Sign-In with Email Verification Shield Check
  const emailSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      // 1. Attempt to validate credentials against Firebase first
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // 2. STOP them right here if they haven't verified their email activation link!
      if (!firebaseUser.emailVerified) {
        alert('Your email address is not verified yet. Please check your inbox for the activation link.');
        return;
      }

      // 3. Grab account state from your MongoDB backend database
      const { data } = await axios.post('http://localhost:5000/api/users/login', { email, password });
      dispatch(setCredentials({ ...data }));
      
      // 4. Fetch saved cart items from MongoDB to restore layout
      dispatch(fetchUserCart()); 
      navigate(redirect);
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Invalid Email or Password');
    }
  };

  // Setup Hidden Recaptcha required by Firebase Phone Auth
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {}
      });
    }
  };

  // Request OTP from Firebase SMS Gateways
  const sendOtpHandler = async (e) => {
    e.preventDefault();
    if (!phoneNumber.startsWith('+91')) {
      alert('Please include your country code, e.g., +919999999999');
      return;
    }
    try {
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const formatPhone = phoneNumber.trim();
      
      const confirmation = await signInWithPhoneNumber(auth, formatPhone, appVerifier);
      setConfirmationResult(confirmation);
      setShowOtpScreen(true);
      setTimer(30);
    } catch (err) {
      alert(err.message || 'Error sending SMS OTP');
    }
  };

  // Auto-focus logic for 6 individual OTP fields
  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;

    let newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Shift focus to next block if filled
    if (element.value !== "" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Verify OTP and complete sign-in against MongoDB database
  const verifyOtpHandler = async (e) => {
    e.preventDefault();
    const finalOtp = otp.join("");
    if (finalOtp.length !== 6) {
      alert("Please fill all 6 digits");
      return;
    }

    try {
      const result = await confirmationResult.confirm(finalOtp);
      const phoneNo = result.user.phoneNumber;

      // 🛡️ CRITICAL FIXED PROPERTY MAP: Changing payload key parameter name from 'phoneNumber' 
      // to exactly match 'phone' so your Express userController.js destructures it accurately!
      const { data } = await axios.post('http://localhost:5000/api/users/phone-login', { phone: phoneNo });
      dispatch(setCredentials({ ...data }));
      
      // Fetch saved cart items from MongoDB to restore layout
      dispatch(fetchUserCart()); 
      navigate(redirect);
    } catch (err) {
      alert(err.response?.data?.message || 'Invalid OTP code typed');
    }
  };

  return (
    <div className='auth-wrapper'>
      {/* Invisible verification hook used behind the scenes by Google */}
      <div id="recaptcha-container"></div>

      <Card className='auth-card p-4' style={{ width: '100%', maxWidth: '420px' }}>
        <Card.Body>
          <div className='text-center mb-4'>
            <h2 className='fw-bold text-dark'>SwiftShop</h2>
            <p className='text-muted'>
              {showOtpScreen ? 'Verify Security Token' : isPhoneLogin ? 'Sign in with Mobile' : 'Login to your account'}
            </p>
          </div>

          {/* VIEW ONE: OTP VERIFICATION DISPLAY SCREEN */}
          {showOtpScreen ? (
            <Form onSubmit={verifyOtpHandler}>
              <div className="text-center mb-4">
                <span className="small text-muted d-block mb-1">Code sent to <strong>{phoneNumber}</strong></span>
                <span className="auth-toggle-link" onClick={() => setShowOtpScreen(false)}>Change Number</span>
              </div>

              <Form.Group className='mb-4 text-center'>
                <Form.Label className='small fw-bold d-block mb-3'>ENTER 6-DIGIT OTP</Form.Label>
                <div className="d-flex justify-content-center align-items-center">
                  {otp.map((data, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      className="form-control otp-field"
                      value={data}
                      onChange={(e) => handleOtpChange(e.target, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      ref={(el) => (inputRefs.current[index] = el)}
                    />
                  ))}
                </div>
              </Form.Group>

              <Button type='submit' className='btn-auth w-100 mb-3'>
                Verify & Login
              </Button>

              <div className="text-center small text-muted">
                {timer > 0 ? (
                  <span>Resend code in <strong className="text-dark">{timer}s</strong></span>
                ) : (
                  <span className="auth-toggle-link" onClick={sendOtpHandler}>Resend Code</span>
                )}
              </div>
            </Form>
          ) : (
            /* VIEW TWO: INITIAL DISPLAYS (EMAIL OR PHONE MODES) */
            <Form onSubmit={isPhoneLogin ? sendOtpHandler : emailSubmitHandler}>
              
              {/* PHONE INPUT FLOW */}
              {isPhoneLogin ? (
                <Form.Group className='mb-4'>
                  <Form.Label className='small fw-bold'>MOBILE NUMBER</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className='bg-light border-end-0'><AiOutlinePhone /></InputGroup.Text>
                    <Form.Control
                      type='tel'
                      className='border-start-0'
                      placeholder='+91 9999999999'
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                    />
                  </InputGroup>
                </Form.Group>
              ) : (
                /* STANDARD EMAIL INPUT FLOW */
                <>
                  <Form.Group className='mb-3'>
                    <Form.Label className='small fw-bold'>EMAIL ADDRESS</Form.Label>
                    <InputGroup>
                      <InputGroup.Text className='bg-light border-end-0'><AiOutlineMail /></InputGroup.Text>
                      <Form.Control
                        type='email'
                        className='border-start-0'
                        placeholder='Enter email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className='mb-2'>
                    <Form.Label className='small fw-bold'>PASSWORD</Form.Label>
                    <InputGroup>
                      <InputGroup.Text className='bg-light border-end-0'><AiOutlineLock /></InputGroup.Text>
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        className='border-start-0 border-end-0'
                        placeholder='Enter password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <InputGroup.Text 
                        className='bg-light border-start-0'
                        style={{ cursor: 'pointer' }}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                      </InputGroup.Text>
                    </InputGroup>
                  </Form.Group>

                  <div className='d-flex justify-content-between mb-4'>
                    <Form.Check type='checkbox' label='Remember me' className='small' />
                    <Link to='/forgot-password' style={{ fontSize: '0.85rem' }} className='text-dark text-decoration-none'>Forgot Password?</Link>
                  </div>
                </>
              )}

              <Button type='submit' className='btn-auth w-100 mb-4 shadow'>
                {isPhoneLogin ? 'Send Secure OTP' : 'Sign In'}
              </Button>

              <div className='text-center border-top pt-3 small'>
                <span className="auth-toggle-link" onClick={() => setIsPhoneLogin(!isPhoneLogin)}>
                  {isPhoneLogin ? 'Login with Email instead' : 'Login with Phone Number (OTP)'}
                </span>
              </div>
            </Form>
          )}

          {!showOtpScreen && (
            <div className='text-center mt-3 small'>
              Don't have an account? <Link to='/register' className='text-dark fw-bold'>Register Now</Link>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default LoginScreen;