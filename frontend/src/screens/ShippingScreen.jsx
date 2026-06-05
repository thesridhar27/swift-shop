import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveShippingAddress } from '../slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps.jsx'; 

const ShippingScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const { userInfo } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [address, setAddress] = useState(shippingAddress?.address || '');
  const [city, setCity] = useState(shippingAddress?.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
  const [country, setCountry] = useState(shippingAddress?.country || '');

  // 🛡️ Redirect to login page if user is unauthenticated
  useEffect(() => {
    if (!userInfo) {
      navigate('/login?redirect=/shipping');
    }
  }, [userInfo, navigate]);

  // 🔄 Listens for Redux data cache drops and forces inputs to sync cleanly
  useEffect(() => {
    setAddress(shippingAddress?.address || '');
    setCity(shippingAddress?.city || '');
    setPostalCode(shippingAddress?.postalCode || '');
    setCountry(shippingAddress?.country || '');
  }, [shippingAddress]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate('/payment');
  };

  return (
    /* 🌟 FIXED: Outer structural alignment frame centering components both vertically and horizontally */
    <div 
      className='shipping-wrapper d-flex flex-column align-items-center justify-content-center' 
      style={{ minHeight: '85vh', width: '100%', padding: '20px 0' }}
    >
      <div className='container'>
        {/* Row 1: Structural wrapper to keep progress steps wide and centered */}
        <Row className='justify-content-center mb-2'>
          <Col xs={12} md={6}>
            <CheckoutSteps step1 step2 />
          </Col>
        </Row>

        {/* Row 2: Clean form card stack positioned neatly underneath */}
        <Row className='justify-content-center'>
          <Col xs={12} md={6}>
            <Card className='p-4 border-0 shadow-sm bg-white' style={{ borderRadius: '16px' }}>
              <Card.Body>
                {/* 🌟 FIXED: Centered heading text align matching layout standards */}
                <h2 className='fw-bold text-dark text-center mb-4'>Shipping Details</h2>
                
                <Form onSubmit={submitHandler}>
                  <Form.Group controlId='address' className='mb-3'>
                    <Form.Label className='small fw-bold text-muted text-uppercase'>Street Address</Form.Label>
                    <Form.Control
                      type='text'
                      placeholder='Enter street address'
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      className='py-2'
                    />
                  </Form.Group>

                  <Form.Group controlId='city' className='mb-3'>
                    <Form.Label className='small fw-bold text-muted text-uppercase'>City</Form.Label>
                    <Form.Control
                      type='text'
                      placeholder='Enter city'
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      className='py-2'
                    />
                  </Form.Group>

                  <Form.Group controlId='postalCode' className='mb-3'>
                    <Form.Label className='small fw-bold text-muted text-uppercase'>Postal Code</Form.Label>
                    <Form.Control
                      type='text'
                      placeholder='Enter postal code'
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      required
                      className='py-2'
                    />
                  </Form.Group>

                  <Form.Group controlId='country' className='mb-4'>
                    <Form.Label className='small fw-bold text-muted text-uppercase'>Country</Form.Label>
                    <Form.Control
                      type='text'
                      placeholder='Enter country'
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      required
                      className='py-2'
                    />
                  </Form.Group>

                  <Button type='submit' variant='dark' className='w-100 py-2 fw-bold shadow-sm rounded'>
                    Continue to Payment
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ShippingScreen;