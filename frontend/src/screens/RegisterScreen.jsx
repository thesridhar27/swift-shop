import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Card, InputGroup } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { createUserWithEmailAndPassword, sendEmailVerification, signOut } from 'firebase/auth'; 
import { auth } from '../firebaseConfig';
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineMail, AiOutlineLock, AiOutlineUser } from 'react-icons/ai';
import axios from 'axios';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Controls showing the "Check Your Email" success screen view
  const [emailSent, setEmailSent] = useState(false);

  const navigate = useNavigate();
  const { search } = useLocation();
  const redirect = new URLSearchParams(search).get('redirect') || '/';
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    if (userInfo) navigate(redirect);
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // 🛡️ Client-side normalization matching MongoDB Atlas criteria
    const cleanEmail = email ? email.toLowerCase().trim() : '';

    try {
      // 1️⃣ Register user configuration profile container in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      const firebaseUser = userCredential.user;

      // 2️⃣ Dispatches out-of-band email activation link
      await sendEmailVerification(firebaseUser);

      // 3️⃣ Save standard account inside your own MongoDB backend database
      await axios.post('http://localhost:5000/api/users', { 
        name, 
        email: cleanEmail, 
        password 
      });

      // 4️⃣ 🛡️ CRITICAL FIX: Sign out immediately and await it fully so local cache unmounts cleanly
      await signOut(auth);

      // 5️⃣ Switch view state notice card display layout
      setEmailSent(true);
    } catch (err) {
      // If Firebase failed because the email already exists, force a logout fallback cleanup
      if (auth.currentUser) {
        await signOut(auth);
      }
      alert(err.response?.data?.message || err.message || 'Registration pipeline failed');
    }
  };

  return (
    <div className='auth-wrapper' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Card className='auth-card p-4 my-5' style={{ width: '100%', maxWidth: '450px', borderRadius: '16px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Card.Body>
          {emailSent ? (
            /* SUCCESS VERIFICATION NOTICE SCREEN DISPLAY VIEW */
            <div className='text-center py-4'>
              <h2 className='fw-bold text-dark mb-3'>Verify Your Email</h2>
              <p className='text-muted'>
                We have sent a verification link to <strong className='text-dark'>{email.toLowerCase().trim()}</strong>.
              </p>
              <p className='small text-muted mb-4'>
                Please check your inbox (and spam folder) and click the link to activate your account.
              </p>
              <Button as={Link} to='/login' variant='dark' className='w-100 py-2 fw-bold'>
                Go to Login Page
              </Button>
            </div>
          ) : (
            /* STANDARD REGISTRATION INPUT SIGNUP VIEW */
            <>
              <div className='text-center mb-4'>
                <h2 className='fw-bold text-dark'>Create Account</h2>
                <p className='text-muted'>Join the SwiftShop community</p>
              </div>
              
              <Form onSubmit={submitHandler}>
                <Form.Group className='mb-3' controlId='regName'>
                  <Form.Label className='small fw-bold text-uppercase text-muted'>Full Name</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className='bg-light border-end-0'><AiOutlineUser /></InputGroup.Text>
                    <Form.Control
                      type='text'
                      placeholder='Enter your name'
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </InputGroup>
                </Form.Group>

                <Form.Group className='mb-3' controlId='regEmail'>
                  <Form.Label className='small fw-bold text-uppercase text-muted'>Email Address</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className='bg-light border-end-0'><AiOutlineMail /></InputGroup.Text>
                    <Form.Control
                      type='email'
                      placeholder='name@example.com'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </InputGroup>
                </Form.Group>

                <Form.Group className='mb-3' controlId='regPassword'>
                  <Form.Label className='small fw-bold text-uppercase text-muted'>Password</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className='bg-light border-end-0'><AiOutlineLock /></InputGroup.Text>
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
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

                <Form.Group className='mb-4' controlId='regConfirmPassword'>
                  <Form.Label className='small fw-bold text-uppercase text-muted'>Confirm Password</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className='bg-light border-end-0'><AiOutlineLock /></InputGroup.Text>
                    <Form.Control
                      type='password'
                      placeholder='Confirm password'
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </InputGroup>
                </Form.Group>

                <Button type='submit' variant='dark' className='w-100 mb-3 py-2 fw-bold shadow-sm'>
                  Register
                </Button>
              </Form>

              <div className='text-center mt-3 small text-muted'>
                Already have an account? <Link to='/login' className='text-dark fw-bold text-decoration-none'>Login here</Link>
              </div>
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default RegisterScreen;