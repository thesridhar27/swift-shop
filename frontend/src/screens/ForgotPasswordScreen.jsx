import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Card, InputGroup } from 'react-bootstrap';
import { AiOutlineMail, AiOutlineArrowLeft } from 'react-icons/ai';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(false);
    try {
      setLoading(true);
      // Fire Firebase reset handler template
      await sendPasswordResetEmail(auth, email.trim());
      setEmailSent(true);
    } catch (err) {
      alert(err.message || 'Failed to process password reset request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='auth-wrapper d-flex align-items-center justify-content-center' style={{ minHeight: '80vh' }}>
      <Card className='auth-card p-4 shadow' style={{ width: '100%', maxWidth: '420px', borderRadius: '16px' }}>
        <Card.Body>
          {emailSent ? (
            /* VIEW ONE: SUCCESS RECOVERY NOTICE */
            <div className='text-center py-3'>
              <h3 className='fw-bold text-dark mb-3'>Link Sent!</h3>
              <p className='text-muted small'>
                A password recovery link has been safely transmitted to <strong className='text-dark'>{email}</strong>.
              </p>
              <p className='text-muted small mb-4'>
                Please inspect your inbox or spam directory to complete updating your credentials.
              </p>
              <Button as={Link} to='/login' variant='dark' className='btn-auth w-100 py-2 fw-bold shadow-sm'>
                Return to Login
              </Button>
            </div>
          ) : (
            /* VIEW TWO: EMAIL REQUEST FORM */
            <>
              <div className='mb-4'>
                <Link to='/login' className='text-muted text-decoration-none small d-inline-flex align-items-center gap-1 mb-2'>
                  <AiOutlineArrowLeft /> Back to Sign In
                </Link>
                <h2 className='fw-bold text-dark mt-2'>Reset Password</h2>
                <p className='text-muted small'>Enter your verified account email to recover access permissions.</p>
              </div>

              <Form onSubmit={submitHandler}>
                <Form.Group className='mb-4' controlId='email'>
                  <Form.Label className='small fw-bold text-uppercase text-muted' style={{ letterSpacing: '0.5px' }}>Email Address</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className='bg-light border-end-0 text-muted'><AiOutlineMail /></InputGroup.Text>
                    <Form.Control
                      type='email'
                      placeholder='Enter your email'
                      className='border-start-0 py-2'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </InputGroup>
                </Form.Group>

                <Button 
                  type='submit' 
                  className='btn-auth w-100 py-2 fw-bold shadow-sm'
                  disabled={loading}
                  variant='dark'
                >
                  {loading ? 'Sending Link...' : 'Send Recovery Link'}
                </Button>
              </Form>
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default ForgotPasswordScreen;