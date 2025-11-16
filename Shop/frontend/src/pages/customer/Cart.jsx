import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert, Badge } from 'react-bootstrap';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [removingItem, setRemovingItem] = useState(null);

  const handleQuantityChange = (foodId, qty) => {
    if (qty < 1) {
      setRemovingItem(foodId);
      setTimeout(() => {
        removeFromCart(foodId);
        setRemovingItem(null);
      }, 300);
    } else {
      updateQuantity(foodId, qty);
    }
  };

  const handleRemove = (foodId) => {
    setRemovingItem(foodId);
    setTimeout(() => {
      removeFromCart(foodId);
      setRemovingItem(null);
    }, 300);
  };

  if (cart.length === 0) {
    return (
      <div style={{ 
        minHeight: '80vh', 
        background: 'linear-gradient(135deg, #fefce8 0%, #ffffff 50%, #fef3c7 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Container className="py-5">
          <div className="text-center animate-fade-in" style={{
            background: 'white',
            borderRadius: '24px',
            padding: '4rem 2rem',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <div style={{
              width: '150px',
              height: '150px',
              margin: '0 auto 2rem',
              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              animation: 'float 3s ease-in-out infinite'
            }}>
              <i className="bi bi-cart-x" style={{ 
                fontSize: '4rem', 
                color: '#d97706',
                animation: 'pulse 2s ease-in-out infinite'
              }}></i>
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                border: '3px dashed #fbbf24',
                borderRadius: '50%',
                animation: 'spin 20s linear infinite'
              }}></div>
            </div>
            <h2 className="mb-3 fw-bold" style={{ color: '#1f2937' }}>Your Cart is Empty</h2>
            <p className="text-muted mb-4" style={{ fontSize: '1.1rem' }}>
              Looks like you haven't added anything to your cart yet.<br/>
              Explore our delicious menu and find your favorites!
            </p>
            <Button 
              size="lg"
              onClick={() => navigate('/daily-foods')}
              style={{
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                border: 'none',
                padding: '1rem 3rem',
                borderRadius: '50px',
                fontWeight: '700',
                fontSize: '1.1rem',
                boxShadow: '0 10px 30px rgba(251, 191, 36, 0.4)',
                transition: 'all 0.3s ease'
              }}
              className="cart-browse-btn"
            >
              <i className="bi bi-arrow-left-circle me-2"></i>
              Browse Our Menu
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #fefce8 0%, #ffffff 50%, #fef3c7 100%)',
      minHeight: '100vh',
      paddingBottom: '3rem'
    }}>
      {/* Header Section */}
      <div style={{
        background: 'linear-gradient(135deg, #000000 0%, #1f2937 100%)',
        padding: '3rem 0',
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23fbbf24" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.3
        }}></div>
        <Container style={{ position: 'relative', zIndex: 1 }}>
          <div className="text-center animate-fade-in">
            <div style={{
              width: '100px',
              height: '100px',
              margin: '0 auto 1.5rem',
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 40px rgba(251, 191, 36, 0.5)',
              transform: 'rotate(-5deg)',
              transition: 'transform 0.3s ease'
            }} className="cart-icon-box">
              <i className="bi bi-cart-check-fill" style={{ fontSize: '3rem', color: '#000' }}></i>
            </div>
            <h1 className="fw-bold mb-3" style={{ color: '#fff', fontSize: '2.5rem' }}>
              Shopping Cart
            </h1>
            <Badge 
              pill 
              style={{
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                color: '#000',
                fontSize: '1rem',
                padding: '0.5rem 1.5rem',
                fontWeight: '700'
              }}
            >
              <i className="bi bi-bag-fill me-2"></i>
              {getCartCount()} {getCartCount() === 1 ? 'Item' : 'Items'}
            </Badge>
          </div>
        </Container>
      </div>

      {/* Main Content */}
      <Container>
        <Row className="g-4">
          {/* Cart Items */}
          <Col lg={8}>
            <div className="mb-4">
              {cart.map((item, index) => (
                <Card 
                  key={item._id} 
                  className="mb-3 animate-fade-in cart-item-card"
                  style={{
                    border: 'none',
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    opacity: removingItem === item._id ? 0 : 1,
                    transform: removingItem === item._id ? 'translateX(-100px)' : 'translateX(0)',
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  <Card.Body className="p-4">
                    <Row className="align-items-center">
                      {/* Product Image */}
                      <Col md={3} className="text-center mb-3 mb-md-0">
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                          <img
                            src={item.image}
                            alt={item.foodName}
                            style={{
                              width: '120px',
                              height: '120px',
                              objectFit: 'cover',
                              borderRadius: '16px',
                              border: '3px solid #fbbf24',
                              boxShadow: '0 8px 20px rgba(251, 191, 36, 0.3)'
                            }}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/120?text=Food';
                            }}
                          />
                          <Badge 
                            pill 
                            bg="dark" 
                            style={{
                              position: 'absolute',
                              top: '-10px',
                              right: '-10px',
                              fontSize: '0.9rem',
                              padding: '0.5rem 0.75rem',
                              border: '2px solid #fbbf24'
                            }}
                          >
                            x{item.qty}
                          </Badge>
                        </div>
                      </Col>

                      {/* Product Details */}
                      <Col md={5} className="mb-3 mb-md-0">
                        <h5 className="fw-bold mb-2" style={{ color: '#1f2937' }}>
                          {item.foodName}
                        </h5>
                        {item.description && (
                          <p className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>
                            {item.description.substring(0, 60)}
                            {item.description.length > 60 ? '...' : ''}
                          </p>
                        )}
                        <div style={{
                          display: 'inline-block',
                          background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                          padding: '0.5rem 1rem',
                          borderRadius: '8px',
                          fontWeight: '700',
                          color: '#92400e'
                        }}>
                          <i className="bi bi-tag-fill me-2"></i>
                          LKR {item.price.toFixed(2)}
                        </div>
                      </Col>

                      {/* Quantity Controls */}
                      <Col md={4}>
                        <div className="d-flex flex-column gap-3">
                          {/* Quantity Adjuster */}
                          <div className="d-flex align-items-center justify-content-center gap-2">
                            <Button
                              onClick={() => handleQuantityChange(item._id, item.qty - 1)}
                              style={{
                                width: '45px',
                                height: '45px',
                                borderRadius: '12px',
                                border: '2px solid #fbbf24',
                                background: 'white',
                                color: '#f59e0b',
                                fontWeight: 'bold',
                                fontSize: '1.2rem',
                                transition: 'all 0.3s ease'
                              }}
                              className="qty-btn"
                            >
                              <i className="bi bi-dash"></i>
                            </Button>
                            <div style={{
                              width: '60px',
                              height: '45px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                              borderRadius: '12px',
                              fontWeight: '800',
                              fontSize: '1.2rem',
                              color: '#000',
                              boxShadow: '0 4px 15px rgba(251, 191, 36, 0.3)'
                            }}>
                              {item.qty}
                            </div>
                            <Button
                              onClick={() => handleQuantityChange(item._id, item.qty + 1)}
                              style={{
                                width: '45px',
                                height: '45px',
                                borderRadius: '12px',
                                border: '2px solid #fbbf24',
                                background: 'white',
                                color: '#f59e0b',
                                fontWeight: 'bold',
                                fontSize: '1.2rem',
                                transition: 'all 0.3s ease'
                              }}
                              className="qty-btn"
                            >
                              <i className="bi bi-plus"></i>
                            </Button>
                          </div>

                          {/* Subtotal & Remove */}
                          <div className="d-flex align-items-center justify-content-between">
                            <div>
                              <div className="text-muted small">Subtotal</div>
                              <div className="fw-bold" style={{ 
                                fontSize: '1.3rem', 
                                color: '#f59e0b' 
                              }}>
                                LKR {(item.price * item.qty).toFixed(2)}
                              </div>
                            </div>
                            <Button
                              variant="link"
                              onClick={() => handleRemove(item._id)}
                              style={{
                                color: '#dc2626',
                                fontSize: '1.5rem',
                                textDecoration: 'none',
                                transition: 'all 0.3s ease'
                              }}
                              className="remove-btn"
                            >
                              <i className="bi bi-trash-fill"></i>
                            </Button>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))}
            </div>

            {/* Continue Shopping Button */}
            <Button 
              variant="outline-dark"
              size="lg"
              onClick={() => navigate('/daily-foods')}
              style={{
                borderRadius: '12px',
                padding: '0.75rem 2rem',
                fontWeight: '700',
                border: '2px solid #000',
                transition: 'all 0.3s ease'
              }}
              className="continue-shopping-btn"
            >
              <i className="bi bi-arrow-left-circle me-2"></i>
              Continue Shopping
            </Button>
          </Col>

          {/* Order Summary */}
          <Col lg={4}>
            <Card 
              className="sticky-top animate-fade-in" 
              style={{ 
                top: '100px',
                border: 'none',
                borderRadius: '20px',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden'
              }}
            >
              <div style={{
                background: 'linear-gradient(135deg, #000000 0%, #1f2937 100%)',
                padding: '1.5rem',
                color: 'white'
              }}>
                <h4 className="mb-0 fw-bold">
                  <i className="bi bi-receipt-cutoff me-2"></i>
                  Order Summary
                </h4>
              </div>
              
              <Card.Body className="p-4">
                {/* Items Breakdown */}
                <div className="mb-4">
                  <h6 className="text-muted mb-3 fw-bold">Items in Cart</h6>
                  {cart.map((item) => (
                    <div 
                      key={item._id} 
                      className="d-flex justify-content-between align-items-center mb-3 pb-3"
                      style={{ borderBottom: '1px dashed #e5e7eb' }}
                    >
                      <div>
                        <div className="fw-bold" style={{ color: '#1f2937' }}>
                          {item.foodName}
                        </div>
                        <div className="text-muted small">
                          LKR {item.price.toFixed(2)} × {item.qty}
                        </div>
                      </div>
                      <div className="fw-bold" style={{ color: '#f59e0b' }}>
                        LKR {(item.price * item.qty).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing Details */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">Subtotal ({getCartCount()} items)</span>
                    <strong>LKR {getCartTotal().toFixed(2)}</strong>
                  </div>

                  <div className="d-flex justify-content-between mb-3 pb-3" style={{ borderBottom: '2px dashed #e5e7eb' }}>
                    <span className="text-muted">
                      <i className="bi bi-truck me-2"></i>
                      Delivery Fee
                    </span>
                    <span className="text-success fw-bold">
                      At Checkout
                    </span>
                  </div>

                  <div className="d-flex justify-content-between align-items-center p-3" style={{
                    background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                    borderRadius: '12px'
                  }}>
                    <div>
                      <div className="small text-muted">Total Amount</div>
                      <h3 className="mb-0 fw-bold" style={{ color: '#92400e' }}>
                        LKR {getCartTotal().toFixed(2)}
                      </h3>
                    </div>
                    <i className="bi bi-cash-coin" style={{ fontSize: '2.5rem', color: '#d97706' }}></i>
                  </div>
                </div>

                {/* Checkout Button */}
                {user ? (
                  <Button
                    size="lg"
                    className="w-100 checkout-btn"
                    onClick={() => navigate('/place-order')}
                    style={{
                      background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '1rem',
                      fontWeight: '700',
                      fontSize: '1.1rem',
                      color: '#000',
                      boxShadow: '0 8px 25px rgba(251, 191, 36, 0.4)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <i className="bi bi-check-circle-fill me-2"></i>
                    Proceed to Checkout
                  </Button>
                ) : (
                  <div>
                    <Alert 
                      variant="warning" 
                      className="mb-3"
                      style={{
                        borderRadius: '12px',
                        border: '2px solid #fbbf24',
                        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)'
                      }}
                    >
                      <i className="bi bi-exclamation-triangle-fill me-2"></i>
                      <strong>Please login to complete your order</strong>
                    </Alert>
                    <Button
                      variant="dark"
                      size="lg"
                      className="w-100"
                      onClick={() => navigate('/login')}
                      style={{
                        borderRadius: '12px',
                        padding: '1rem',
                        fontWeight: '700'
                      }}
                    >
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Login to Continue
                    </Button>
                  </div>
                )}

                {/* Trust Badges */}
                <div className="mt-4 text-center">
                  <div className="d-flex justify-content-around text-muted small">
                    <div>
                      <i className="bi bi-shield-check d-block mb-1" style={{ fontSize: '1.5rem', color: '#10b981' }}></i>
                      <span>Secure</span>
                    </div>
                    <div>
                      <i className="bi bi-truck d-block mb-1" style={{ fontSize: '1.5rem', color: '#3b82f6' }}></i>
                      <span>Fast Delivery</span>
                    </div>
                    <div>
                      <i className="bi bi-award d-block mb-1" style={{ fontSize: '1.5rem', color: '#fbbf24' }}></i>
                      <span>Quality</span>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        .cart-browse-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(251, 191, 36, 0.6) !important;
        }
        .cart-icon-box:hover {
          transform: rotate(0deg) scale(1.05) !important;
        }
        .cart-item-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15) !important;
        }
        .qty-btn:hover {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%) !important;
          color: #000 !important;
          transform: scale(1.1);
        }
        .remove-btn:hover {
          transform: scale(1.2);
          color: #991b1b !important;
        }
        .continue-shopping-btn:hover {
          background: #000 !important;
          color: #fbbf24 !important;
          transform: translateX(-5px);
        }
        .checkout-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 35px rgba(251, 191, 36, 0.6) !important;
        }
        @media (max-width: 768px) {
          .cart-item-card {
            margin-bottom: 1rem;
          }
          .sticky-top {
            position: relative !important;
            top: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Cart;
