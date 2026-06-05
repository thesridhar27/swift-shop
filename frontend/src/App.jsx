import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/Header.jsx';
import PromoBanner from './components/PromoBanner.jsx'; // 🪔 Imported your Diwali Festival Advert Banner!
import HomeScreen from './screens/HomeScreen.jsx';
import ProductScreen from './screens/ProductScreen.jsx';
import CartScreen from './screens/CartScreen.jsx';
import LoginScreen from './screens/LoginScreen.jsx';
import RegisterScreen from './screens/RegisterScreen.jsx';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen.jsx';
import ShippingScreen from './screens/ShippingScreen.jsx'; 
import PaymentScreen from './screens/PaymentScreen.jsx'; 
import PlaceOrderScreen from './screens/PlaceOrderScreen.jsx'; 
import OrderScreen from './screens/OrderScreen.jsx'; 
import ProfileScreen from './screens/ProfileScreen.jsx'; 

const App = () => {
  return (
    <>
      {/* 🌟 FIXED: Mounts your seasonal festive campaign layout above your header navigation element */}
      <PromoBanner />
      
      <Header />
      
      <main className='py-3' style={{ minHeight: '80vh' }}>
        <Container>
          <Routes>
            {/* Core Catalog Views */}
            <Route path='/' element={<HomeScreen />} exact />
            <Route path='/product/:id' element={<ProductScreen />} />
            <Route path='/cart/:id?' element={<CartScreen />} />
            
            {/* User Access Gateway Screens */}
            <Route path='/login' element={<LoginScreen />} />
            <Route path='/register' element={<RegisterScreen />} />
            <Route path='/forgot-password' element={<ForgotPasswordScreen />} />
            
            {/* Sequential Checkout Pipeline Workflow Path Mapping */}
            <Route path='/shipping' element={<ShippingScreen />} />
            <Route path='/payment' element={<PaymentScreen />} />
            <Route path='/placeorder' element={<PlaceOrderScreen />} />
            
            {/* Secure Invoices Records Retrieval Maps */}
            <Route path='/order/:id' element={<OrderScreen />} />
            
            {/* User Dashboard Route */}
            <Route path='/profile' element={<ProfileScreen />} />
          </Routes>
        </Container>
      </main>
    </>
  );
};

export default App;