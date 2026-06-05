import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import axios from 'axios';

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await axios.get(`http://localhost:5000/api/orders/${orderId}`, config);
        setOrder(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to pull order logs.');
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, userInfo, navigate]);

  // 🇮🇳 Localized Comma Formatter Engine
  const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num || 0);
  };

  if (loading) return <div className='container mt-5 text-center fw-bold text-muted'>Loading Order Receipt...</div>;
  if (error) return <div className='container mt-5 alert alert-danger border-0'>{error}</div>;

  return (
    <div className='container mt-4'>
      <h2 className='fw-bold text-dark mb-1'>Order Details</h2>
      <p className='text-muted small mb-4'>ID Reference: <span className='text-dark fw-semibold'>{order._id}</span></p>

      <Row>
        {/* Left Tracking Info Column */}
        <Col md={8}>
          <ListGroup variant='flush' className='shadow-sm rounded bg-white p-3 mb-4'>
            
            {/* Customer Details & Shipping Status */}
            <ListGroup.Item className='border-0 px-0'>
              <h4 className='fw-bold text-dark mb-3'>Shipping Information</h4>
              <p className='mb-1'><strong>Customer: </strong> {order.user?.name}</p>
              <p className='mb-3'><strong>Email: </strong> <a href={`mailto:${order.user?.email}`} className='text-decoration-none'>{order.user?.email}</a></p>
              <p className='mb-3 text-muted'>
                <strong className='text-dark'>Address: </strong> 
                {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <div className='alert alert-success border-0 py-2 m-0 small rounded-3 fw-bold'>Delivered on {new Date(order.deliveredAt).toLocaleString()}</div>
              ) : (
                <div className='alert alert-warning border-0 py-2 m-0 small rounded-3 fw-bold text-dark'>📦 Dispatched / Pending Delivery</div>
              )}
            </ListGroup.Item>

            <hr className='text-muted my-3' />

            {/* Payment Method Status */}
            <ListGroup.Item className='border-0 px-0'>
              <h4 className='fw-bold text-dark mb-3'>Payment Gateway</h4>
              <p className='mb-3 text-muted'><strong className='text-dark'>Method: </strong>{order.paymentMethod}</p>
              {order.isPaid ? (
                <div className='alert alert-success border-0 py-2 m-0 small rounded-3 fw-bold'>Paid on {new Date(order.paidAt).toLocaleString()}</div>
              ) : (
                <div className='alert alert-danger border-0 py-2 m-0 small rounded-3 fw-bold'>⏳ Awaiting Gateway Payment Clearance</div>
              )}
            </ListGroup.Item>

            <hr className='text-muted my-3' />

            {/* Itemized Inventory List */}
            <ListGroup.Item className='border-0 px-0'>
              <h4 className='fw-bold text-dark mb-4'>Items Purchased</h4>
              <ListGroup variant='flush'>
                {order.orderItems.map((item, index) => (
                  <ListGroup.Item key={index} className='px-0 py-3 border-bottom-0'>
                    <Row className='align-items-center'>
                      <Col md={2} xs={3}>
                        <Image src={item.image} alt={item.name} fluid rounded />
                      </Col>
                      <Col md={6} xs={9}>
                        <Link to={`/product/${item.product}`} className='text-dark fw-bold text-decoration-none'>{item.name}</Link>
                      </Col>
                      <Col md={4} xs={12} className='mt-2 mt-md-0 text-md-end fw-semibold text-muted'>
                        {item.qty} x ₹{formatCurrency(item.price)} = <span className='text-dark fw-bold'>₹{formatCurrency(item.qty * item.price)}</span>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </ListGroup.Item>
          </ListGroup>
        </Col>

        {/* Right Pricing Summary Column */}
        <Col md={4}>
          <Card className='p-3 shadow-sm border-0 bg-light' style={{ borderRadius: '12px' }}>
            <Card.Body>
              <h4 className='fw-bold text-dark mb-4'>Summary Receipt</h4>
              <ListGroup variant='flush' className='bg-transparent'>
                <ListGroup.Item className='bg-transparent d-flex justify-content-between border-0 px-0 py-2 text-muted'>
                  <span>Items Total</span>
                  <span className='fw-semibold text-dark'>₹{formatCurrency(order.itemsPrice)}</span>
                </ListGroup.Item>
                <ListGroup.Item className='bg-transparent d-flex justify-content-between border-0 px-0 py-2 text-muted'>
                  <span>Shipping Cost</span>
                  <span className='fw-semibold text-dark'>{order.shippingPrice === 0 ? 'FREE' : `₹${formatCurrency(order.shippingPrice)}`}</span>
                </ListGroup.Item>
                <ListGroup.Item className='bg-transparent d-flex justify-content-between border-0 px-0 py-2 text-muted'>
                  <span>Tax (18% GST)</span>
                  <span className='fw-semibold text-dark'>₹{formatCurrency(order.taxPrice)}</span>
                </ListGroup.Item>
                <hr className='text-muted my-2' />
                <ListGroup.Item className='bg-transparent d-flex justify-content-between border-0 px-0 py-2'>
                  <span className='fw-bold text-dark h5 mb-0'>Grand Total</span>
                  <span className='fw-bold text-success h4 mb-0'>₹{formatCurrency(order.totalPrice)}</span>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OrderScreen;