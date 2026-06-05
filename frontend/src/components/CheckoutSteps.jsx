import React from 'react';
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <Nav className='d-flex justify-content-center align-items-center mb-4 small fw-bold text-uppercase tracking-wider w-100 flex-nowrap' style={{ gap: '10px', fontSize: '0.85rem' }}>
      
      {/* STEP 1 */}
      <Nav.Item>
        {step1 ? (
          <LinkContainer to='/login'>
            <Nav.Link className='text-dark border-bottom border-2 border-dark pb-1 px-1 text-nowrap'>Sign In</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled className='text-muted pb-1 px-1 text-nowrap'>Sign In</Nav.Link>
        )}
      </Nav.Item>

      <span className='text-muted' style={{ fontSize: '0.75rem' }}>➔</span>

      {/* STEP 2 */}
      <Nav.Item>
        {step2 ? (
          <LinkContainer to='/shipping'>
            <Nav.Link className='text-dark border-bottom border-2 border-dark pb-1 px-1 text-nowrap'>Shipping</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled className='text-muted pb-1 px-1 text-nowrap'>Shipping</Nav.Link>
        )}
      </Nav.Item>

      <span className='text-muted' style={{ fontSize: '0.75rem' }}>➔</span>

      {/* STEP 3 */}
      <Nav.Item>
        {step3 ? (
          <LinkContainer to='/payment'>
            <Nav.Link className='text-dark border-bottom border-2 border-dark pb-1 px-1 text-nowrap'>Payment</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled className='text-muted pb-1 px-1 text-nowrap'>Payment</Nav.Link>
        )}
      </Nav.Item>

      <span className='text-muted' style={{ fontSize: '0.75rem' }}>➔</span>

      {/* STEP 4 */}
      <Nav.Item>
        {step4 ? (
          <LinkContainer to='/placeorder'>
            <Nav.Link className='text-dark border-bottom border-2 border-dark pb-1 px-1 text-nowrap'>Place Order</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled className='text-muted pb-1 px-1 text-nowrap'>Place Order</Nav.Link>
        )}
      </Nav.Item>

    </Nav>
  );
};

export default CheckoutSteps;