import React, { useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap';
import { addToCart, removeFromCart } from '../slices/cartSlice';

const CartScreen = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const qty = location.search ? Number(location.search.split('=')[1]) : 1;

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  useEffect(() => {
    if (productId) {
      dispatch(addToCart({ _id: productId, qty }));
    }
  }, [dispatch, productId, qty]);

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  // 🛡️ Bulletproof Localized Currency Formatting Engine (en-IN)
  const formatCurrency = (num) => {
    // Force convert to number, fallback to 0 if it's missing or corrupted
    const safeNum = num && !isNaN(num) ? Number(num) : 0;
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(safeNum);
  };

  // 🔍 Smart Data Extractor: Finds properties even if your data structure changes
  const getItemDetails = (item) => {
    return {
      name: item.name || item.title || (item.product && item.product.name) || 'Product Electronic Item',
      image: item.image || (item.product && item.product.image) || 'https://via.placeholder.com/150',
      price: Number(item.price !== undefined ? item.price : (item.product && item.product.price !== undefined ? item.product.price : 0)),
      countInStock: item.countInStock || (item.product && item.product.countInStock) || 10
    };
  };

  return (
    <Row className='mt-3'>
      {/* Left items column listing segment */}
      <Col md={8}>
        <h1 className='fw-bold mb-4 text-dark'>Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <div className='alert alert-info border-0 shadow-sm rounded-3 p-3'>
            Your cart is empty.{' '}
            <Link to='/' className='fw-bold text-decoration-none ms-1'>
              Go Back Shopping
            </Link>
          </div>
        ) : (
          <ListGroup variant='flush' className='shadow-sm rounded bg-white p-2'>
            {cartItems.map((item) => {
              // Extract data safely using our helper function
              const details = getItemDetails(item);
              const displayPrice = details.price;
              const totalItemPrice = displayPrice * item.qty;

              return (
                <ListGroup.Item key={item._id || (item.product && item.product._id)} className='py-3 border-bottom'>
                  <Row className='align-items-center g-2'>
                    <Col md={2} xs={3}>
                      <Image src={details.image} alt={details.name} fluid rounded />
                    </Col>
                    
                    <Col md={3} xs={9}>
                      <Link to={`/product/${item._id || (item.product && item.product._id)}`} className='text-dark fw-bold text-decoration-none'>
                        {details.name}
                      </Link>
                    </Col>
                    
                    <Col md={2} xs={4} className='fw-semibold text-muted fs-5'>
                      ₹{formatCurrency(displayPrice)}
                    </Col>
                    
                    <Col md={2} xs={4}px-1>
                      <Form.Control
                        as='select'
                        value={item.qty}
                        onChange={(e) =>
                          dispatch(addToCart({ ...item, qty: Number(e.target.value) }))
                        }
                        className='form-select py-1'
                      >
                        {[...Array(details.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                    
                    <Col md={2} xs={4} className='text-end fw-bold text-dark fs-5'>
                      ₹{formatCurrency(totalItemPrice)}
                    </Col>

                    <Col md={1} xs={12} className='text-end'>
                      <Button
                        type='button'
                        variant='light'
                        onClick={() => removeFromCartHandler(item._id || (item.product && item.product._id))}
                        className='text-danger border-0 p-2'
                      >
                        🗑️
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        )}
      </Col>

      {/* Right column: Sticky formatted summary panel block */}
      <Col md={4} className='mt-4 mt-md-0'>
        <Card className='p-3 shadow-sm border-0 bg-light' style={{ borderRadius: '16px' }}>
          <ListGroup variant='flush' className='bg-transparent'>
            <ListGroup.Item className='bg-transparent border-0 px-0 pb-3'>
              <h3 className='fw-bold text-dark mb-3' style={{ fontSize: '1.35rem' }}>
                Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items
              </h3>
              
              <div className='h2 fw-bold text-success'>
                ₹{formatCurrency(
                  cartItems.reduce((acc, item) => {
                    const details = getItemDetails(item);
                    return acc + details.price * item.qty;
                  }, 0)
                )}
              </div>
            </ListGroup.Item>
            
            <ListGroup.Item className='bg-transparent border-0 px-0 pt-2'>
              <Button
                type='button'
                className='w-100 py-2.5 fw-bold text-uppercase rounded shadow-sm btn-dark'
                style={{ letterSpacing: '0.5px' }}
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed To Checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CartScreen;