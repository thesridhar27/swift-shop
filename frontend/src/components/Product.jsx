import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from './Rating'; // 1. Import the new component

const Product = ({ product }) => {
  return (
    <Card className='my-3 p-3 rounded h-100 product-card'>
      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.image} variant='top' className="product-image" />
      </Link>

      <Card.Body className='d-flex flex-column'>
        <Link to={`/product/${product._id}`} className="text-decoration-none">
          <Card.Title as='div' className='product-title'>
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        {/* 2. Add the Rating component here */}
        <Card.Text as='div'>
          <Rating value={product.rating} text={`${product.numReviews} reviews`} />
        </Card.Text>

        <Card.Text as='h3' className='product-price mt-auto'>
          ₹{product.price.toLocaleString('en-IN')}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;