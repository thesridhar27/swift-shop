import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../slices/userSlice'; 
import { auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import { AiOutlineShoppingCart, AiOutlineUser } from 'react-icons/ai';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.user);

  const logoutHandler = async () => {
    try {
      await signOut(auth);
      dispatch(logout());
      navigate('/login');
    } catch (err) {
      console.error('Logout integration failure:', err);
    }
  };

  return (
    <header>
      <Navbar 
        variant='dark' 
        expand='lg' 
        collapseOnSelect 
        className='py-2 shadow-sm'
        style={{ 
          backgroundColor: '#1e1e24', 
          minHeight: '70px'
        }}
      >
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand className='d-flex align-items-center py-0'>
              <img
                src='/logo.png'
                alt='SwiftShop Brand Logo'
                height='50' 
                className='d-inline-block align-middle rounded' 
                style={{
                  objectFit: 'contain',
                  maxWidth: '180px'
                }}
                onError={(e) => {
                  console.error('Logo image source resolution path failed.');
                }}
              />
            </Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ms-auto align-items-center gap-2'>
              
              {/* Shopping Cart Link */}
              <LinkContainer to='/cart'>
                {/* 🌟 FIXED: Added ms-2 and realigned position parameters to anchor the badge wrapper neatly */}
                <Nav.Link className='d-flex align-items-center gap-1 px-2 position-relative fw-semibold text-white me-2'>
                  <AiOutlineShoppingCart size={22} className='text-white' />
                  <span className='ms-1'>Cart</span>
                  
                  {cartItems.length > 0 && (
                    /* 🌟 FIXED: Changed background to bg-success (Green) and recalculated transform metrics */
                    <span 
                      className='position-absolute badge rounded-circle bg-success d-flex align-items-center justify-content-center fw-bold'
                      style={{ 
                        fontSize: '11px', 
                        top: '-2px', 
                        right: '-8px',
                        width: '18px',
                        height: '18px',
                        padding: '0',
                        lineHeight: '1'
                      }}
                    >
                      {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                    </span>
                  )}
                </Nav.Link>
              </LinkContainer>

              {/* Dynamic User Profile Session Menu */}
              {userInfo ? (
                <NavDropdown title={<span className="text-white">{userInfo.name}</span>} id='username' className='px-2 fw-semibold'>
                  <LinkContainer to='/profile'>
                    <NavDropdown.Item>My Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout Account
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to='/login'>
                  <Nav.Link className='d-flex align-items-center gap-1 px-3 fw-semibold text-white'>
                    <AiOutlineUser size={20} className='text-white' />
                    <span>Sign In</span>
                  </Nav.Link>
                </LinkContainer>
              )}

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;