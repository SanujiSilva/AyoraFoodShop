import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Table } from 'react-bootstrap';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';

const AddOrderManual = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [foods, setFoods] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [useCustomAddress, setUseCustomAddress] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    location: '',
    customAddress: '',
  });

  useEffect(() => {
    fetchFoods();
    fetchLocations();
  }, []);

  const fetchFoods = async () => {
    try {
      console.log('Fetching daily foods...');
      const { data } = await axios.get('/foods/daily');
      console.log('Daily foods received:', data);
      // Filter only items with quantity > 0
      const availableFoods = data.filter((f) => f.quantity > 0);
      console.log('Available foods:', availableFoods);
      setFoods(availableFoods);
    } catch (error) {
      console.error('Failed to load foods:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to load foods');
    }
  };

  const fetchLocations = async () => {
    try {
      const { data } = await axios.get('/locations/active');
      setLocations(data);
    } catch (error) {
      console.error('Failed to load locations:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLocationTypeChange = (e) => {
    setUseCustomAddress(e.target.value === 'custom');
    if (e.target.value === 'custom') {
      setFormData({ ...formData, location: '' });
    } else {
      setFormData({ ...formData, customAddress: '' });
    }
  };

  const addItem = (food) => {
    const existing = selectedItems.find((item) => item.foodId === food._id);
    if (existing) {
      setSelectedItems(
        selectedItems.map((item) =>
          item.foodId === food._id ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      setSelectedItems([
        ...selectedItems,
        {
          foodId: food._id,
          foodName: food.foodName,
          price: food.price,
          qty: 1,
        },
      ]);
    }
  };

  const updateQty = (foodId, qty) => {
    if (qty <= 0) {
      setSelectedItems(selectedItems.filter((item) => item.foodId !== foodId));
    } else {
      setSelectedItems(
        selectedItems.map((item) =>
          item.foodId === foodId ? { ...item, qty } : item
        )
      );
    }
  };

  const calculateTotal = () => {
    return selectedItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (selectedItems.length === 0) {
      toast.error('Please add at least one item');
      return;
    }

    if (!formData.customerName.trim()) {
      toast.error('Please enter customer name');
      return;
    }

    if (!formData.phone.trim()) {
      toast.error('Please enter phone number');
      return;
    }

    if (!useCustomAddress && !formData.location) {
      toast.error('Please select a location');
      return;
    }

    if (useCustomAddress && !formData.customAddress.trim()) {
      toast.error('Please enter delivery address');
      return;
    }

    setLoading(true);

    const orderData = {
      items: selectedItems,
      total: calculateTotal(),
      customerName: formData.customerName.trim(),
      phone: formData.phone.trim(),
      location: useCustomAddress ? formData.customAddress.trim() : formData.location,
    };

    console.log('Submitting order:', orderData);

    try {
      const { data } = await axios.post('/admin/orders', orderData);
      console.log('Order created successfully:', data);
      toast.success(`Order No${data.orderNumber} created successfully!`);
      
      // Reset form
      setSelectedItems([]);
      setFormData({
        customerName: '',
        phone: '',
        location: '',
        customAddress: '',
      });
      setUseCustomAddress(false);
      
      // Navigate after a short delay to show success message
      setTimeout(() => {
        navigate('/admin/orders');
      }, 1500);
    } catch (error) {
      console.error('Order creation error:', error);
      console.error('Error response:', error.response?.data);
      const errorMessage = error.response?.data?.message || 'Failed to create order';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      {/* Professional Header */}
      <div 
        className="mb-4 p-4 rounded-3 position-relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1f2937 0%, #000 100%)',
          border: '3px solid #fbbf24',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
        }}
      >
        <div className="position-relative" style={{ zIndex: 2 }}>
          <div className="d-flex align-items-center gap-3">
            <div 
              className="d-flex align-items-center justify-content-center rounded-3"
              style={{
                width: '70px',
                height: '70px',
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                border: '3px solid #000'
              }}
            >
              <i className="bi bi-cart-plus" style={{ fontSize: '2rem', color: '#000' }}></i>
            </div>
            <div>
              <h2 className="mb-1 text-white fw-bold">Create Manual Order</h2>
              <p className="mb-0 text-white-50">Place orders on behalf of customers manually</p>
            </div>
          </div>
        </div>
        <div 
          className="position-absolute top-0 end-0 opacity-25"
          style={{ fontSize: '150px', color: '#fbbf24', lineHeight: 1 }}
        >
          <i className="bi bi-receipt"></i>
        </div>
      </div>

      <Row>
        <Col lg={7}>
          <Card className="mb-4 border-0 shadow" style={{ borderRadius: '12px', overflow: 'hidden', animation: 'slideIn 0.5s ease-out' }}>
            <Card.Header 
              className="py-3"
              style={{
                background: 'linear-gradient(135deg, #1f2937 0%, #000 100%)',
                border: 'none'
              }}
            >
              <h5 className="mb-0 text-white fw-bold">
                <i className="bi bi-basket me-2" style={{ color: '#fbbf24' }}></i>
                Available Food Items
              </h5>
            </Card.Header>
            <Card.Body className="p-4" style={{ background: 'linear-gradient(135deg, #fefce8 0%, #fff 100%)' }}>
              {foods.length === 0 ? (
                <div 
                  className="text-center py-4 rounded-3"
                  style={{
                    background: '#fff',
                    border: '2px dashed #fbbf24'
                  }}
                >
                  <i className="bi bi-basket" style={{ fontSize: '3rem', color: '#fbbf24', opacity: 0.5 }}></i>
                  <p className="mt-3 mb-0 text-muted">No food items available</p>
                </div>
              ) : (
                <Row className="g-3">
                  {foods.map((food, index) => (
                    <Col key={food._id} sm={6} md={4}>
                      <div 
                        className="h-100 rounded-3 overflow-hidden"
                        style={{
                          background: '#fff',
                          border: '2px solid #e5e7eb',
                          transition: 'all 0.3s ease',
                          animation: `slideIn ${0.3 + index * 0.05}s ease-out`,
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#fbbf24';
                          e.currentTarget.style.transform = 'translateY(-4px)';
                          e.currentTarget.style.boxShadow = '0 8px 16px rgba(251, 191, 36, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#e5e7eb';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <div className="p-2 text-center">
                          <div 
                            style={{
                              height: '100px',
                              background: 'linear-gradient(135deg, #fefce8 0%, #fff 100%)',
                              borderRadius: '8px',
                              overflow: 'hidden',
                              marginBottom: '0.5rem'
                            }}
                          >
                            <img
                              src={food.image || 'https://via.placeholder.com/200x150?text=No+Image'}
                              alt={food.foodName}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={(e) => { 
                                e.target.src = 'https://via.placeholder.com/200x150?text=No+Image'; 
                              }}
                            />
                          </div>
                          <div className="fw-bold mb-1" style={{ fontSize: '0.9rem', color: '#1f2937' }}>
                            {food.foodName}
                          </div>
                          <div 
                            className="mb-2 fw-semibold"
                            style={{
                              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              backgroundClip: 'text',
                              fontSize: '1rem'
                            }}
                          >
                            LKR {food.price}
                          </div>
                          <Button
                            size="sm"
                            onClick={() => addItem(food)}
                            style={{
                              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                              border: '2px solid #15803d',
                              color: '#fff',
                              fontWeight: '600',
                              borderRadius: '6px',
                              padding: '0.4rem 1rem',
                              width: '100%'
                            }}
                          >
                            <i className="bi bi-plus-circle me-1"></i>
                            Add
                          </Button>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={5}>
          <Card className="border-0 shadow sticky-top" style={{ borderRadius: '12px', overflow: 'hidden', top: '20px', animation: 'slideIn 0.6s ease-out' }}>
            <Card.Header 
              className="py-3"
              style={{
                background: 'linear-gradient(135deg, #1f2937 0%, #000 100%)',
                border: 'none'
              }}
            >
              <h5 className="mb-0 text-white fw-bold">
                <i className="bi bi-receipt-cutoff me-2" style={{ color: '#fbbf24' }}></i>
                Order Details
              </h5>
            </Card.Header>
            <Card.Body className="p-4" style={{ background: 'linear-gradient(135deg, #fefce8 0%, #fff 100%)' }}>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    <i className="bi bi-person me-2" style={{ color: '#fbbf24' }}></i>
                    Customer Name *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    placeholder="Enter customer name"
                    required
                    style={{
                      borderWidth: '2px',
                      borderRadius: '8px',
                      padding: '0.6rem'
                    }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    <i className="bi bi-telephone me-2" style={{ color: '#fbbf24' }}></i>
                    Phone Number *
                  </Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    required
                    style={{
                      borderWidth: '2px',
                      borderRadius: '8px',
                      padding: '0.6rem'
                    }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    <i className="bi bi-geo-alt me-2" style={{ color: '#fbbf24' }}></i>
                    Delivery Location Type *
                  </Form.Label>
                  <div 
                    className="p-2 rounded"
                    style={{ background: 'rgba(251, 191, 36, 0.1)', border: '1px solid #fbbf24' }}
                  >
                    <Form.Check
                      inline
                      type="radio"
                      label="Select from list"
                      name="locationType"
                      value="predefined"
                      checked={!useCustomAddress}
                      onChange={handleLocationTypeChange}
                      style={{ fontWeight: '600' }}
                    />
                    <Form.Check
                      inline
                      type="radio"
                      label="Custom address"
                      name="locationType"
                      value="custom"
                      checked={useCustomAddress}
                      onChange={handleLocationTypeChange}
                      style={{ fontWeight: '600' }}
                    />
                  </div>
                </Form.Group>

                {!useCustomAddress ? (
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">
                      <i className="bi bi-pin-map me-2" style={{ color: '#fbbf24' }}></i>
                      Select Location *
                    </Form.Label>
                    <Form.Select
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required={!useCustomAddress}
                      style={{
                        borderWidth: '2px',
                        borderRadius: '8px',
                        padding: '0.6rem'
                      }}
                    >
                      <option value="">Choose a location...</option>
                      {locations.map((loc) => (
                        <option key={loc._id} value={loc.name}>
                          {loc.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                ) : (
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">
                      <i className="bi bi-house me-2" style={{ color: '#fbbf24' }}></i>
                      Custom Delivery Address *
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="customAddress"
                      value={formData.customAddress}
                      onChange={handleChange}
                      placeholder="Enter complete delivery address"
                      required={useCustomAddress}
                      style={{
                        borderWidth: '2px',
                        borderRadius: '8px',
                        padding: '0.6rem'
                      }}
                    />
                  </Form.Group>
                )}

                <div 
                  className="mb-3 p-3 rounded-3"
                  style={{
                    background: '#fff',
                    border: '2px solid #fbbf24'
                  }}
                >
                  <h6 className="mb-2 fw-bold" style={{ color: '#1f2937' }}>
                    <i className="bi bi-cart-check me-2" style={{ color: '#fbbf24' }}></i>
                    Selected Items:
                  </h6>
                  {selectedItems.length === 0 ? (
                    <p className="text-muted small mb-0 text-center py-2">No items selected yet</p>
                  ) : (
                    <div>
                      {selectedItems.map((item) => (
                        <div 
                          key={item.foodId}
                          className="d-flex align-items-center justify-content-between p-2 mb-2 rounded"
                          style={{
                            background: 'linear-gradient(135deg, #fefce8 0%, #fff 100%)',
                            border: '1px solid #e5e7eb'
                          }}
                        >
                          <div className="flex-grow-1">
                            <div className="fw-semibold" style={{ fontSize: '0.9rem', color: '#1f2937' }}>
                              {item.foodName}
                            </div>
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <div className="d-flex align-items-center gap-1">
                              <Button
                                size="sm"
                                onClick={() => updateQty(item.foodId, item.qty - 1)}
                                style={{
                                  background: 'transparent',
                                  border: '2px solid #ef4444',
                                  color: '#ef4444',
                                  fontWeight: '700',
                                  width: '28px',
                                  height: '28px',
                                  padding: 0,
                                  borderRadius: '6px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                -
                              </Button>
                              <span className="fw-bold" style={{ minWidth: '30px', textAlign: 'center' }}>
                                {item.qty}
                              </span>
                              <Button
                                size="sm"
                                onClick={() => updateQty(item.foodId, item.qty + 1)}
                                style={{
                                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                                  border: '2px solid #15803d',
                                  color: '#fff',
                                  fontWeight: '700',
                                  width: '28px',
                                  height: '28px',
                                  padding: 0,
                                  borderRadius: '6px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                +
                              </Button>
                            </div>
                            <div 
                              className="fw-bold"
                              style={{ 
                                minWidth: '80px', 
                                textAlign: 'right',
                                color: '#22c55e'
                              }}
                            >
                              LKR {(item.price * item.qty).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div 
                  className="p-3 rounded-3 mb-3"
                  style={{
                    background: 'linear-gradient(135deg, #1f2937 0%, #000 100%)',
                    border: '3px solid #fbbf24'
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-white fw-bold fs-5">Total Amount:</span>
                    <span 
                      className="fw-bold fs-4"
                      style={{
                        color: '#fbbf24'
                      }}
                    >
                      LKR {calculateTotal().toFixed(2)}
                    </span>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-100" 
                  disabled={loading || selectedItems.length === 0}
                  style={{
                    background: loading || selectedItems.length === 0 
                      ? '#9ca3af' 
                      : 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                    border: '2px solid #000',
                    color: '#000',
                    fontWeight: '700',
                    padding: '0.7rem',
                    borderRadius: '8px',
                    boxShadow: loading || selectedItems.length === 0 
                      ? 'none' 
                      : '0 4px 12px rgba(251, 191, 36, 0.4)',
                    cursor: loading || selectedItems.length === 0 ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Creating Order...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle me-2"></i>
                      Create Order
                    </>
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddOrderManual;
