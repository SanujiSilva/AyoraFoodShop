import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Badge, ListGroup, ProgressBar } from 'react-bootstrap';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';

const PlaceOrder = () => {
  const { user } = useAuth();
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const [locations, setLocations] = useState([]);
  const [useCustomAddress, setUseCustomAddress] = useState(false);
  const [validated, setValidated] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    phone: user?.phone || '',
    location: '',
    customAddress: '',
  });

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const { data } = await axios.get('/locations/active');
      setLocations(data);
    } catch (error) {
      console.error('Failed to load locations:', error);
      toast.error('Failed to load delivery locations');
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.customerName.trim()) {
      errors.customerName = 'Name is required';
    } else if (formData.customerName.trim().length < 3) {
      errors.customerName = 'Name must be at least 3 characters';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    if (!useCustomAddress && !formData.location) {
      errors.location = 'Please select a delivery location';
    }
    
    if (useCustomAddress && !formData.customAddress.trim()) {
      errors.customAddress = 'Please enter your delivery address';
    } else if (useCustomAddress && formData.customAddress.trim().length < 10) {
      errors.customAddress = 'Please provide a detailed address (at least 10 characters)';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  const handleLocationTypeChange = (e) => {
    setUseCustomAddress(e.target.value === 'custom');
    if (e.target.value === 'custom') {
      setFormData({ ...formData, location: '' });
      setFormErrors({ ...formErrors, location: '' });
    } else {
      setFormData({ ...formData, customAddress: '' });
      setFormErrors({ ...formErrors, customAddress: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidated(true);

    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);
    setCurrentStep(2);

    const orderData = {
      items: cart.map((item) => ({
        foodId: item._id,
        foodName: item.foodName,
        qty: item.qty,
        price: item.price,
      })),
      total: getCartTotal(),
      customerName: formData.customerName,
      phone: formData.phone,
      location: useCustomAddress ? formData.customAddress : formData.location,
    };

    try {
      setCurrentStep(3);
      const { data } = await axios.post('/orders/place', orderData);
      setOrderNumber(data.orderNumber);
      clearCart();
      toast.success('🎉 Order placed successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
      setCurrentStep(1);
    }

    setLoading(false);
  };

  if (orderNumber) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #fefce8 0%, #ffffff 50%, #dcfce7 100%)',
        display: 'flex',
        alignItems: 'center',
        padding: '3rem 0'
      }}>
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6}>
              <Card 
                className="animate-fade-in"
                style={{
                  border: 'none',
                  borderRadius: '24px',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
                  overflow: 'hidden'
                }}
              >
                <div style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  padding: '3rem 2rem',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                    opacity: 0.4
                  }}></div>
                  <div style={{
                    width: '120px',
                    height: '120px',
                    margin: '0 auto',
                    background: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
                    position: 'relative',
                    animation: 'successPulse 2s ease-in-out infinite'
                  }}>
                    <i className="bi bi-check-circle-fill" style={{ 
                      fontSize: '4rem', 
                      color: '#10b981'
                    }}></i>
                  </div>
                </div>
                
                <Card.Body className="p-5 text-center">
                  <h2 className="fw-bold mb-3" style={{ color: '#1f2937' }}>
                    Order Placed Successfully!
                  </h2>
                  <p className="text-muted mb-4">
                    Thank you for your order! Your delicious meal is being prepared.
                  </p>
                  
                  <div style={{
                    background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                    padding: '2rem',
                    borderRadius: '16px',
                    marginBottom: '2rem',
                    border: '2px dashed #fbbf24'
                  }}>
                    <div className="text-muted small mb-2">Your Order Number</div>
                    <h1 className="fw-bold mb-0" style={{ 
                      color: '#92400e',
                      fontSize: '3rem',
                      letterSpacing: '2px'
                    }}>
                      #{orderNumber}
                    </h1>
                    <p className="text-muted small mt-2 mb-0">
                      <i className="bi bi-info-circle me-2"></i>
                      Please save this number for tracking
                    </p>
                  </div>

                  <div className="mb-4">
                    <Row className="g-3">
                      <Col xs={4}>
                        <div style={{
                          background: '#f0fdf4',
                          padding: '1rem',
                          borderRadius: '12px'
                        }}>
                          <i className="bi bi-clock-history d-block mb-2" style={{ 
                            fontSize: '2rem', 
                            color: '#10b981' 
                          }}></i>
                          <div className="small text-muted">Processing</div>
                        </div>
                      </Col>
                      <Col xs={4}>
                        <div style={{
                          background: '#eff6ff',
                          padding: '1rem',
                          borderRadius: '12px'
                        }}>
                          <i className="bi bi-bicycle d-block mb-2" style={{ 
                            fontSize: '2rem', 
                            color: '#3b82f6' 
                          }}></i>
                          <div className="small text-muted">On the way</div>
                        </div>
                      </Col>
                      <Col xs={4}>
                        <div style={{
                          background: '#fefce8',
                          padding: '1rem',
                          borderRadius: '12px'
                        }}>
                          <i className="bi bi-house-heart d-block mb-2" style={{ 
                            fontSize: '2rem', 
                            color: '#fbbf24' 
                          }}></i>
                          <div className="small text-muted">Delivered</div>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  <div className="d-grid gap-2">
                    <Button 
                      size="lg"
                      onClick={() => navigate('/order-history')}
                      style={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '1rem',
                        fontWeight: '700',
                        boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                      }}
                      className="success-btn"
                    >
                      <i className="bi bi-clock-history me-2"></i>
                      View Order History
                    </Button>
                    <Button 
                      variant="outline-dark"
                      size="lg"
                      onClick={() => navigate('/daily-foods')}
                      style={{
                        borderRadius: '12px',
                        padding: '1rem',
                        fontWeight: '700',
                        border: '2px solid #1f2937'
                      }}
                      className="outline-btn"
                    >
                      <i className="bi bi-arrow-left-circle me-2"></i>
                      Continue Shopping
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div style={{ 
        minHeight: '80vh', 
        background: 'linear-gradient(135deg, #fefce8 0%, #ffffff 50%, #fee2e2 100%)',
        display: 'flex',
        alignItems: 'center',
        padding: '3rem 0'
      }}>
        <Container>
          <Row className="justify-content-center">
            <Col md={6}>
              <Card 
                className="text-center animate-fade-in"
                style={{
                  border: 'none',
                  borderRadius: '24px',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
                  padding: '3rem 2rem'
                }}
              >
                <div style={{
                  width: '120px',
                  height: '120px',
                  margin: '0 auto 2rem',
                  background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: 'float 3s ease-in-out infinite'
                }}>
                  <i className="bi bi-cart-x" style={{ fontSize: '3.5rem', color: '#dc2626' }}></i>
                </div>
                <h3 className="fw-bold mb-3" style={{ color: '#1f2937' }}>No Items in Cart</h3>
                <p className="text-muted mb-4">
                  Your cart is empty. Please add items before placing an order.
                </p>
                <Button
                  size="lg"
                  onClick={() => navigate('/daily-foods')}
                  style={{
                    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                    border: 'none',
                    borderRadius: '50px',
                    padding: '1rem 3rem',
                    fontWeight: '700',
                    boxShadow: '0 8px 25px rgba(251, 191, 36, 0.4)'
                  }}
                  className="browse-btn"
                >
                  <i className="bi bi-arrow-left-circle me-2"></i>
                  Browse Menu
                </Button>
              </Card>
            </Col>
          </Row>
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
              transform: 'rotate(-5deg)'
            }} className="checkout-icon-box">
              <i className="bi bi-clipboard-check-fill" style={{ fontSize: '3rem', color: '#000' }}></i>
            </div>
            <h1 className="fw-bold mb-2" style={{ color: '#fff', fontSize: '2.5rem' }}>
              Checkout
            </h1>
            <p className="text-light mb-0">
              <i className="bi bi-shield-check me-2"></i>
              Complete your order securely
            </p>
          </div>
        </Container>
      </div>

      <Container>
        <Row className="g-4">
          {/* Checkout Form */}
          <Col lg={7}>
            <Card 
              className="mb-4 animate-fade-in"
              style={{
                border: 'none',
                borderRadius: '20px',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div style={{
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                padding: '1.5rem 2rem',
                borderRadius: '20px 20px 0 0'
              }}>
                <h4 className="mb-0 fw-bold" style={{ color: '#000' }}>
                  <i className="bi bi-geo-alt-fill me-2"></i>
                  Delivery Information
                </h4>
              </div>
              
              <Card.Body className="p-4">
                {/* Progress Indicator */}
                {loading && (
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <small className="fw-bold" style={{ color: '#6b7280' }}>
                        {currentStep === 1 && 'Fill in your details'}
                        {currentStep === 2 && 'Validating information...'}
                        {currentStep === 3 && 'Confirming order...'}
                      </small>
                      <small className="text-muted">Step {currentStep}/3</small>
                    </div>
                    <ProgressBar 
                      now={(currentStep / 3) * 100} 
                      animated
                      style={{
                        height: '8px',
                        borderRadius: '10px',
                        background: '#e5e7eb'
                      }}
                      variant="warning"
                    />
                  </div>
                )}

                <Form onSubmit={handleSubmit} noValidate validated={validated}>
                  {/* Customer Name */}
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold" style={{ color: '#1f2937' }}>
                      <i className="bi bi-person-fill me-2" style={{ color: '#fbbf24' }}></i>
                      Full Name *
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                      isInvalid={validated && formErrors.customerName}
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: '12px',
                        border: formErrors.customerName ? '2px solid #dc2626' : '2px solid #e5e7eb',
                        fontSize: '1rem'
                      }}
                      className="modern-input"
                    />
                    {formErrors.customerName && (
                      <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>
                        <i className="bi bi-exclamation-circle me-1"></i>
                        {formErrors.customerName}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>

                  {/* Phone Number */}
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold" style={{ color: '#1f2937' }}>
                      <i className="bi bi-telephone-fill me-2" style={{ color: '#fbbf24' }}></i>
                      Phone Number *
                    </Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="07XXXXXXXX (10 digits)"
                      required
                      isInvalid={validated && formErrors.phone}
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: '12px',
                        border: formErrors.phone ? '2px solid #dc2626' : '2px solid #e5e7eb',
                        fontSize: '1rem'
                      }}
                      className="modern-input"
                    />
                    {formErrors.phone && (
                      <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>
                        <i className="bi bi-exclamation-circle me-1"></i>
                        {formErrors.phone}
                      </Form.Control.Feedback>
                    )}
                    {!formErrors.phone && formData.phone && (
                      <Form.Text className="text-success">
                        <i className="bi bi-check-circle me-1"></i>
                        Valid phone number
                      </Form.Text>
                    )}
                  </Form.Group>

                  {/* Location Type */}
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold" style={{ color: '#1f2937' }}>
                      <i className="bi bi-pin-map-fill me-2" style={{ color: '#fbbf24' }}></i>
                      Delivery Location Type *
                    </Form.Label>
                    <div style={{
                      background: '#f9fafb',
                      padding: '1.5rem',
                      borderRadius: '12px',
                      border: '2px solid #e5e7eb'
                    }}>
                      <Form.Check
                        type="radio"
                        label={
                          <span className="fw-bold">
                            <i className="bi bi-list-ul me-2" style={{ color: '#3b82f6' }}></i>
                            Select from our delivery locations
                          </span>
                        }
                        name="locationType"
                        value="predefined"
                        checked={!useCustomAddress}
                        onChange={handleLocationTypeChange}
                        className="mb-3"
                        style={{ fontSize: '1rem' }}
                      />
                      <Form.Check
                        type="radio"
                        label={
                          <span className="fw-bold">
                            <i className="bi bi-pencil-square me-2" style={{ color: '#10b981' }}></i>
                            Enter a custom address
                          </span>
                        }
                        name="locationType"
                        value="custom"
                        checked={useCustomAddress}
                        onChange={handleLocationTypeChange}
                        style={{ fontSize: '1rem' }}
                      />
                    </div>
                  </Form.Group>

                  {/* Predefined Location */}
                  {!useCustomAddress ? (
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-bold" style={{ color: '#1f2937' }}>
                        <i className="bi bi-building me-2" style={{ color: '#fbbf24' }}></i>
                        Select Your Location *
                      </Form.Label>
                      <Form.Select
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required={!useCustomAddress}
                        isInvalid={validated && formErrors.location}
                        style={{
                          padding: '0.75rem 1rem',
                          borderRadius: '12px',
                          border: formErrors.location ? '2px solid #dc2626' : '2px solid #e5e7eb',
                          fontSize: '1rem'
                        }}
                        className="modern-input"
                      >
                        <option value="">Choose a location...</option>
                        {locations.map((loc) => (
                          <option key={loc._id} value={loc.name}>
                            📍 {loc.name}
                          </option>
                        ))}
                      </Form.Select>
                      {formErrors.location && (
                        <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>
                          <i className="bi bi-exclamation-circle me-1"></i>
                          {formErrors.location}
                        </Form.Control.Feedback>
                      )}
                      {!formErrors.location && formData.location && (
                        <Form.Text className="text-success">
                          <i className="bi bi-check-circle me-1"></i>
                          Location selected: {formData.location}
                        </Form.Text>
                      )}
                      {!formData.location && (
                        <Form.Text className="text-muted">
                          <i className="bi bi-info-circle me-1"></i>
                          Select from our available delivery locations
                        </Form.Text>
                      )}
                    </Form.Group>
                  ) : (
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-bold" style={{ color: '#1f2937' }}>
                        <i className="bi bi-house-door-fill me-2" style={{ color: '#fbbf24' }}></i>
                        Custom Delivery Address *
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        name="customAddress"
                        value={formData.customAddress}
                        onChange={handleChange}
                        placeholder="Enter your complete delivery address including street, area, and landmarks..."
                        required={useCustomAddress}
                        isInvalid={validated && formErrors.customAddress}
                        style={{
                          padding: '0.75rem 1rem',
                          borderRadius: '12px',
                          border: formErrors.customAddress ? '2px solid #dc2626' : '2px solid #e5e7eb',
                          fontSize: '1rem',
                          resize: 'none'
                        }}
                        className="modern-input"
                      />
                      {formErrors.customAddress && (
                        <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>
                          <i className="bi bi-exclamation-circle me-1"></i>
                          {formErrors.customAddress}
                        </Form.Control.Feedback>
                      )}
                      {!formErrors.customAddress && formData.customAddress && (
                        <Form.Text className="text-success">
                          <i className="bi bi-check-circle me-1"></i>
                          {formData.customAddress.length} characters
                        </Form.Text>
                      )}
                      {!formData.customAddress && (
                        <Form.Text className="text-muted">
                          <i className="bi bi-info-circle me-1"></i>
                          Please provide detailed address for accurate delivery
                        </Form.Text>
                      )}
                    </Form.Group>
                  )}

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    size="lg"
                    disabled={loading}
                    style={{
                      background: loading 
                        ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)' 
                        : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '1rem',
                      fontWeight: '700',
                      fontSize: '1.1rem',
                      width: '100%',
                      boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    className="place-order-btn"
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Processing Your Order...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle-fill me-2"></i>
                        Place Order Now
                      </>
                    )}
                  </Button>
                </Form>
              </Card.Body>
            </Card>

            {/* Security Badge */}
            <div 
              className="text-center p-3 animate-fade-in"
              style={{
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
              }}
            >
              <div className="d-flex justify-content-center align-items-center gap-4 flex-wrap">
                <div>
                  <i className="bi bi-shield-lock-fill me-2" style={{ color: '#10b981', fontSize: '1.5rem' }}></i>
                  <span className="fw-bold text-muted">Secure Checkout</span>
                </div>
                <div>
                  <i className="bi bi-truck me-2" style={{ color: '#3b82f6', fontSize: '1.5rem' }}></i>
                  <span className="fw-bold text-muted">Fast Delivery</span>
                </div>
                <div>
                  <i className="bi bi-cash-coin me-2" style={{ color: '#fbbf24', fontSize: '1.5rem' }}></i>
                  <span className="fw-bold text-muted">Cash on Delivery</span>
                </div>
              </div>
            </div>
          </Col>

          {/* Order Summary Sidebar */}
          <Col lg={5}>
            <Card 
              className="sticky-top animate-fade-in" 
              style={{ 
                top: '100px',
                border: 'none',
                borderRadius: '20px',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div style={{
                background: 'linear-gradient(135deg, #000000 0%, #1f2937 100%)',
                padding: '1.5rem 2rem',
                borderRadius: '20px 20px 0 0'
              }}>
                <h4 className="mb-0 fw-bold text-white">
                  <i className="bi bi-receipt-cutoff me-2"></i>
                  Order Summary
                </h4>
              </div>
              
              <Card.Body className="p-0">
                {/* Items List */}
                <ListGroup variant="flush">
                  {cart.map((item, index) => (
                    <ListGroup.Item 
                      key={item._id}
                      style={{
                        padding: '1.25rem 1.5rem',
                        border: 'none',
                        borderBottom: index < cart.length - 1 ? '1px dashed #e5e7eb' : 'none'
                      }}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.foodName}
                          style={{
                            width: '60px',
                            height: '60px',
                            objectFit: 'cover',
                            borderRadius: '12px',
                            border: '2px solid #fbbf24'
                          }}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/60?text=Food';
                          }}
                        />
                        <div className="flex-grow-1">
                          <div className="fw-bold mb-1" style={{ color: '#1f2937' }}>
                            {item.foodName}
                          </div>
                          <div className="d-flex justify-content-between align-items-center">
                            <Badge 
                              pill 
                              bg="dark"
                              style={{
                                padding: '0.4rem 0.8rem',
                                fontSize: '0.85rem'
                              }}
                            >
                              Qty: {item.qty}
                            </Badge>
                            <div>
                              <div className="text-muted small">
                                LKR {item.price.toFixed(2)} × {item.qty}
                              </div>
                              <div className="fw-bold" style={{ color: '#f59e0b' }}>
                                LKR {(item.price * item.qty).toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>

                {/* Pricing Summary */}
                <div className="p-4">
                  <div style={{
                    background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                    padding: '1.5rem',
                    borderRadius: '16px',
                    marginBottom: '1rem'
                  }}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted">Subtotal ({cart.length} items)</span>
                      <span className="fw-bold">LKR {getCartTotal().toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center pb-3 mb-3" style={{ borderBottom: '2px dashed rgba(0,0,0,0.1)' }}>
                      <span className="text-muted">
                        <i className="bi bi-truck me-2"></i>
                        Delivery Fee
                      </span>
                      <Badge bg="success" pill>FREE</Badge>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="small text-muted">Total Amount</div>
                        <h3 className="mb-0 fw-bold" style={{ color: '#92400e' }}>
                          LKR {getCartTotal().toFixed(2)}
                        </h3>
                      </div>
                      <i className="bi bi-currency-dollar" style={{ fontSize: '2.5rem', color: '#d97706' }}></i>
                    </div>
                  </div>

                  {/* Payment Method Info */}
                  <div style={{
                    background: '#f0f9ff',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '2px solid #dbeafe'
                  }}>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <i className="bi bi-cash-stack" style={{ fontSize: '1.5rem', color: '#3b82f6' }}></i>
                      <div className="fw-bold" style={{ color: '#1f2937' }}>Payment Method</div>
                    </div>
                    <p className="mb-0 text-muted small">
                      Cash on Delivery - Pay when you receive your order
                    </p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <style jsx>{`
        @keyframes successPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .checkout-icon-box:hover {
          transform: rotate(0deg) scale(1.05) !important;
          transition: all 0.3s ease;
        }
        .modern-input:focus {
          border-color: #fbbf24 !important;
          box-shadow: 0 0 0 0.2rem rgba(251, 191, 36, 0.25) !important;
        }
        .place-order-btn:not(:disabled):hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 35px rgba(16, 185, 129, 0.6) !important;
        }
        .success-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.5) !important;
        }
        .outline-btn:hover {
          background: #1f2937 !important;
          color: #fbbf24 !important;
        }
        .browse-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 35px rgba(251, 191, 36, 0.6) !important;
        }
        @media (max-width: 992px) {
          .sticky-top {
            position: relative !important;
            top: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PlaceOrder;
