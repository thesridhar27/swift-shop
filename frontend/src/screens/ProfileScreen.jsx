import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Table, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [errorOrders, setErrorOrders] = useState(null);

  const navigate = useNavigate();

  // Extract authentication token payload cleanly from storage
  const userInfo = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;

  useEffect(() => {
    // Safety Guard: Force kick to login if session doesn't exist
    if (!userInfo) {
      navigate('/login');
      return;
    }

    // Assign initial defaults
    setName(userInfo.name || '');
    setEmail(userInfo.email || '');

    const fetchMyOrders = async () => {
      try {
        setLoadingOrders(true);
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await axios.get('http://localhost:5000/api/orders/myorders', config);
        setOrders(data);
        setLoadingOrders(false);
      } catch (err) {
        setErrorOrders(err.response?.data?.message || err.message || 'Failed to load order history.');
        setLoadingOrders(false);
      }
    };

    if (userInfo.token) {
      fetchMyOrders();
    }
  }, [navigate]);

  // 🔥 UPDATED: Submit Handler to fire profile details cleanly without password parameters
  const submitHandler = async (e) => {
    e.preventDefault();
    
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      // Execute network transaction to user update api endpoint (Only name and email sent)
      const { data } = await axios.put(
        'http://localhost:5000/api/users/profile',
        { name, email: email.toLowerCase().trim() },
        config
      );

      // Overwrite local memory snapshot session with fresh profile metadata credentials
      localStorage.setItem('userInfo', JSON.stringify(data));
      
      alert('Profile details modified and synchronized with MongoDB successfully!');
      
      // Force quick page refresh to synchronize header context bindings instantly
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to save updated profile credentials.');
    }
  };

  // 🇮🇳 Localized Indian Numbering System Comma Formatter Engine
  const formatCurrency = (num) => {
    const safeNum = num && !isNaN(num) ? Number(num) : 0;
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(safeNum);
  };

  if (!userInfo) {
    return <div className='container mt-5 text-center fw-bold text-muted'>Redirecting to session gate...</div>;
  }

  return (
    <div className='container mt-4'>
      <Row>
        {/* Left Column: Form component to modify profile values inside a beautiful Card */}
        <Col md={4} className='mb-4'>
          <Card className='p-4 border-0 shadow-sm bg-white' style={{ borderRadius: '16px' }}>
            <Card.Body>
              <h2 className='fw-bold text-dark mb-4'>User Profile</h2>
              <Form onSubmit={submitHandler}>
                <Form.Group controlId='name' className='mb-3'>
                  <Form.Label className='small fw-bold text-muted text-uppercase'>Name</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className='py-2 shadow-sm'
                    required
                  />
                </Form.Group>

                <Form.Group controlId='email' className='mb-4'>
                  <Form.Label className='small fw-bold text-muted text-uppercase'>Email Address</Form.Label>
                  <Form.Control
                    type='email'
                    placeholder='Enter email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='py-2 shadow-sm'
                    required
                  />
                </Form.Group>

                <Button type='submit' variant='dark' className='w-100 py-2 fw-bold rounded shadow-sm text-uppercase'>
                  Update Profile
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Right Column: Historical Order Tracking Table */}
        <Col md={8}>
          <h2 className='fw-bold text-dark mb-4'>My Orders</h2>
          {loadingOrders ? (
            <div className='alert alert-light border shadow-sm p-3 text-muted fw-semibold'>
              🔄 Loading your secure purchase history...
            </div>
          ) : errorOrders ? (
            <div className='alert alert-danger border-0 shadow-sm'>{errorOrders}</div>
          ) : orders.length === 0 ? (
            <div className='alert alert-info border-0 shadow-sm p-3 rounded-3'>
              You haven't placed any orders yet.{' '}
              <Link to='/' className='fw-bold text-decoration-none ms-1'>
                Start shopping!
              </Link>
            </div>
          ) : (
            <Table striped hover responsive className='table-sm align-middle shadow-sm rounded bg-white overflow-hidden' style={{ borderRadius: '8px' }}>
              <thead className='table-dark small text-uppercase'>
                <tr>
                  <th className='py-3 ps-3'>ID</th>
                  <th className='py-3'>Date</th>
                  <th className='py-3'>Total</th>
                  <th className='py-3'>Paid</th>
                  <th className='py-3'>Delivered</th>
                  <th className='py-3 pe-3 text-center'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className='py-3 ps-3 small fw-semibold text-muted'>{order._id}</td>
                    <td className='py-3 text-nowrap'>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className='py-3 fw-bold text-dark'>₹{formatCurrency(order.totalPrice)}</td>
                    <td className='py-3'>
                      {order.isPaid ? (
                        <span className='badge bg-success-subtle text-success border border-success-subtle px-2.5 py-1.5 rounded-3 fw-bold'>
                          {new Date(order.paidAt).toLocaleDateString('en-IN')}
                        </span>
                      ) : (
                        <span className='badge bg-danger-subtle text-danger border border-danger-subtle px-2.5 py-1.5 rounded-3 fw-bold'>
                          Pending
                        </span>
                      )}
                    </td>
                    <td className='py-3'>
                      {order.isDelivered ? (
                        <span className='badge bg-success-subtle text-success border border-success-subtle px-2.5 py-1.5 rounded-3 fw-bold'>
                          {new Date(order.deliveredAt).toLocaleDateString('en-IN')}
                        </span>
                      ) : (
                        <span className='badge bg-warning-subtle text-warning border border-warning-subtle px-2.5 py-1.5 rounded-3 fw-bold text-dark'>
                          In Transit
                        </span>
                      )}
                    </td>
                    <td className='py-3 pe-3 text-center'>
                      <Link to={`/order/${order._id}`}>
                        <Button variant='light' size='sm' className='fw-bold px-3 border border-secondary-subtle shadow-sm rounded-3'>
                          Details
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ProfileScreen;