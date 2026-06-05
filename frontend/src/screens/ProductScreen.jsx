import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import axios from 'axios';

const ProductScreen = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({});
  const [qty, setQty] = useState(1);

  // Grab user identity state matrix from Redux
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await axios.get(`http://localhost:5000/api/products/${productId}`);
      setProduct(data);
    };
    fetchProduct();
  }, [productId]);

  // Intercept Choice Handler: Check authentication before routing to checkout structures
  const addToCartHandler = () => {
    if (!userInfo) {
      alert('Please log in to your account to add items to your shopping cart!');
      // Appends the absolute target back-route so the user doesn't lose their place
      navigate(`/login?redirect=/product/${productId}`);
      return;
    }

    // Proceed normally if authenticated
    navigate(`/cart/${productId}?qty=${qty}`);
  };

  return (
    <>
      <Link className='btn btn-light my-3' to='/'>Go Back</Link>
      <Row>
        <Col md={6}>
          <Image src={product.image} alt={product.name} fluid rounded />
        </Col>
        <Col md={3}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h3>{product.name}</h3>
            </ListGroup.Item>
            <ListGroup.Item>Price: ₹{product.price}</ListGroup.Item>
            <ListGroup.Item>Description: {product.description}</ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card className='shadow-sm p-2'>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <Row>
                  <Col>Price:</Col>
                  <Col><strong>₹{product.price}</strong></Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Status:</Col>
                  <Col>{product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}</Col>
                </Row>
              </ListGroup.Item>

              {product.countInStock > 0 && (
                <ListGroup.Item>
                  <Row className='align-items-center'>
                    <Col>Qty</Col>
                    <Col>
                      <Form.Control 
                        as='select' 
                        value={qty} 
                        onChange={(e) => setQty(Number(e.target.value))}
                      >
                        {[...Array(product.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>{x + 1}</option>
                        ))}
                      </Form.Control>
                    </Col>
                  </Row>
                </ListGroup.Item>
              )}

              <ListGroup.Item>
                <Button
                  onClick={addToCartHandler}
                  className='btn-block btn-dark w-100 py-2'
                  type='button'
                  disabled={product.countInStock === 0}
                >
                  Add To Cart
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ProductScreen;