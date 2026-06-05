import React, { useState, useEffect } from 'react';
import { Form, Button, Col, Row, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from '../components/CheckoutSteps.jsx';
import { savePaymentMethod } from '../slices/cartSlice';

const PaymentScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 🛡️ Guard: Instantly send back to shipping if address components are missing
  useEffect(() => {
    if (!shippingAddress || !shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  // Set default state selection value
  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  const submitHandler = (e) => {
    e.preventDefault();
    
    // Save selected provider string into Redux and local memory
    dispatch(savePaymentMethod(paymentMethod));
    
    // Advance into the final stage: Place Order!
    navigate('/placeorder');
  };

  return (
    <div className='container mt-4'>
      {/* Row 1: Structural wrapper to keep the progress arrows perfectly horizontal and centered */}
      <Row className='justify-content-center'>
        <Col xs={12} md={6}>
          <CheckoutSteps step1 step2 step3 />
        </Col>
      </Row>

      {/* Row 2: Clean form card layout stack positioned neatly underneath */}
      <Row className='justify-content-md-center'>
        <Col xs={12} md={6}>
          <Card className='p-4 border-0 shadow-sm bg-white mt-2' style={{ borderRadius: '16px' }}>
            <Card.Body>
              <h2 className='fw-bold text-dark mb-4'>Payment Method</h2>
              
              <Form onSubmit={submitHandler}>
                <Form.Group className='mb-4'>
                  <Form.Label as='legend' className='small fw-bold text-muted text-uppercase mb-3' style={{ letterSpacing: '0.5px' }}>
                    Select Gateway
                  </Form.Label>
                  <Col>
                    
                    {/* PAYPAL OR CREDIT CARD RADIO OPTION */}
                    <Form.Check
                      type='radio'
                      label='PayPal or Credit Card'
                      id='PayPal'
                      name='paymentMethod'
                      value='PayPal'
                      checked={paymentMethod === 'PayPal'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className='mb-3 fw-semibold text-dark'
                      style={{ fontSize: '1.05rem' }}
                    />

                    {/* STRIPE RADIO OPTION */}
                    <Form.Check
                      type='radio'
                      label='Stripe Gateway'
                      id='Stripe'
                      name='paymentMethod'
                      value='Stripe'
                      checked={paymentMethod === 'Stripe'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className='fw-semibold text-dark'
                      style={{ fontSize: '1.05rem' }}
                    />

                  </Col>
                </Form.Group>

                <Button type='submit' variant='dark' className='w-100 py-2 fw-bold shadow-sm rounded'>
                  Continue to Review
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PaymentScreen;