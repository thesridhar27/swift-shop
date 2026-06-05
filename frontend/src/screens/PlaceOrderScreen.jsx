import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import CheckoutSteps from '../components/CheckoutSteps.jsx';
import { clearCartItems } from '../slices/cartSlice';

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems, shippingAddress, paymentMethod } = cart;

  // 🛡️ Guards: Redirect back if core shipping details or payment methods are missing
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    } else if (!paymentMethod) {
      navigate('/payment');
    }
  }, [shippingAddress.address, paymentMethod, navigate]);

  // 📈 Financial Calculations Data Conversions
  const itemsPriceRaw = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPriceRaw = itemsPriceRaw > 500 ? 0 : 50; // Free shipping over ₹500
  const taxPriceRaw = Number((0.18 * itemsPriceRaw).toFixed(2)); // 18% GST standard calculation
  const totalPriceRaw = itemsPriceRaw + shippingPriceRaw + taxPriceRaw;

  // 🇮🇳 Indian Currency Localized Comma Formatter Engine
  const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const placeOrderHandler = async () => {
    try {
      const userInfo = localStorage.getItem('userInfo')
        ? JSON.parse(localStorage.getItem('userInfo'))
        : null;

      if (!userInfo || !userInfo.token) {
        alert('Please log in again to place your order.');
        navigate('/login');
        return;
      }

      // Authorization header containing user JWT token validation
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      // 🔥 Send payload array directly to Express backend
      const { data } = await axios.post(
        'http://localhost:5000/api/orders',
        {
          orderItems: cartItems,
          shippingAddress,
          paymentMethod,
          itemsPrice: Number(itemsPriceRaw.toFixed(2)),
          taxPrice: Number(taxPriceRaw.toFixed(2)),
          shippingPrice: Number(shippingPriceRaw.toFixed(2)),
          totalPrice: Number(totalPriceRaw.toFixed(2)),
        },
        config
      );

      alert('Order Placed and Saved to Database Successfully!');
      
      // Wipe cart contents from local memory and Redux global tree
      dispatch(clearCartItems());
      
      // 🔄 Redirect directly to their unique, permanent live digital receipt view!
      navigate(`/order/${data._id}`);
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to place order.');
    }
  };

  return (
    <div className='container mt-4'>
      {/* Structural horizontal steps header layout element */}
      <CheckoutSteps step1 step2 step3 step4 />

      <Row className='mt-4'>
        {/* Left Column: Delivery coordinates and product maps */}
        <Col md={8}>
          <ListGroup variant='flush' className='shadow-sm rounded bg-white p-3 mb-4'>
            <ListGroup.Item className='border-0 px-0'>
              <h4 className='fw-bold text-dark mb-3'>Delivery Location</h4>
              <p className='text-muted m-0'>
                <strong className='text-dark'>Address: </strong> 
                {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}
              </p>
            </ListGroup.Item>

            <hr className='text-muted my-3' />

            <ListGroup.Item className='border-0 px-0'>
              <h4 className='fw-bold text-dark mb-3'>Payment Gateway</h4>
              <p className='text-muted m-0'>
                <strong className='text-dark'>Method: </strong>{paymentMethod}
              </p>
            </ListGroup.Item>

            <hr className='text-muted my-3' />

            <ListGroup.Item className='border-0 px-0'>
              <h4 className='fw-bold text-dark mb-4'>Review Items</h4>
              {cartItems.length === 0 ? (
                <div className='alert alert-info'>Your shopping cart is completely empty.</div>
              ) : (
                <ListGroup variant='flush'>
                  {cartItems.map((item, index) => (
                    <ListGroup.Item key={index} className='px-0 py-3 border-bottom-0'>
                      <Row className='align-items-center'>
                        <Col md={2} xs={3}>
                          <Image src={item.image} alt={item.name} fluid rounded />
                        </Col>
                        <Col md={6} xs={9}>
                          <Link to={`/product/${item._id}`} className='text-dark fw-bold text-decoration-none'>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4} xs={12} className='mt-2 mt-md-0 text-md-end fw-semibold text-muted'>
                          {item.qty} x ₹{formatCurrency(item.price)} = <span className='text-dark fw-bold'>₹{formatCurrency(item.qty * item.price)}</span>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        {/* Right Column: Calculations totals sticky invoice summary panel */}
        <Col md={4}>
          <Card className='p-3 shadow-sm border-0 bg-light' style={{ borderRadius: '12px' }}>
            <Card.Body>
              <h4 className='fw-bold text-dark mb-4'>Order Summary</h4>
              
              <ListGroup variant='flush' className='bg-transparent'>
                <ListGroup.Item className='bg-transparent d-flex justify-content-between border-0 px-0 py-2 text-muted'>
                  <span>Items Total</span>
                  <span className='fw-semibold text-dark'>₹{formatCurrency(itemsPriceRaw)}</span>
                </ListGroup.Item>

                <ListGroup.Item className='bg-transparent d-flex justify-content-between border-0 px-0 py-2 text-muted'>
                  <span>Shipping Fee</span>
                  <span className='fw-semibold text-dark'>{shippingPriceRaw === 0 ? 'FREE' : `₹${formatCurrency(shippingPriceRaw)}`}</span>
                </ListGroup.Item>

                <ListGroup.Item className='bg-transparent d-flex justify-content-between border-0 px-0 py-2 text-muted'>
                  <span>Tax (18% GST)</span>
                  <span className='fw-semibold text-dark'>₹{formatCurrency(taxPriceRaw)}</span>
                </ListGroup.Item>

                <hr className='text-muted my-2' />

                <ListGroup.Item className='bg-transparent d-flex justify-content-between border-0 px-0 py-2'>
                  <span className='fw-bold text-dark h5 mb-0'>Grand Total</span>
                  <span className='fw-bold text-success h4 mb-0'>₹{formatCurrency(totalPriceRaw)}</span>
                </ListGroup.Item>

                <ListGroup.Item className='bg-transparent border-0 px-0 pt-4'>
                  <Button
                    type='button'
                    className='btn-dark w-100 py-2.5 shadow-sm fw-bold rounded text-uppercase'
                    style={{ letterSpacing: '0.5px' }}
                    disabled={cartItems.length === 0}
                    onClick={placeOrderHandler}
                  >
                    Place Order
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PlaceOrderScreen;