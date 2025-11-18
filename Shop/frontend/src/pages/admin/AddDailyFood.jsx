import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Table, Badge } from 'react-bootstrap';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';

const AddDailyFood = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [masterFoods, setMasterFoods] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [foodItems, setFoodItems] = useState([]);
  const [formData, setFormData] = useState({
    selectedFoodId: '',
    price: '',
    quantity: '',
    optionalDescription: '',
  });

  useEffect(() => {
    fetchMasterFoods();
  }, []);

  const fetchMasterFoods = async () => {
    try {
      const { data } = await axios.get('/admin/master-foods/active');
      setMasterFoods(data);
    } catch (error) {
      toast.error('Failed to fetch foods');
    }
  };

  const handleFoodSelect = (e) => {
    const foodId = e.target.value;
    const selectedFood = masterFoods.find(f => f._id === foodId);
    
    setFormData({
      selectedFoodId: foodId,
      price: selectedFood ? selectedFood.defaultPrice : '',
      quantity: '',
      optionalDescription: '',
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddToList = (e) => {
    e.preventDefault();
    
    if (!formData.selectedFoodId || !formData.price || !formData.quantity) {
      toast.error('Please fill in all required fields');
      return;
    }

    const selectedFood = masterFoods.find(f => f._id === formData.selectedFoodId);
    if (!selectedFood) {
      toast.error('Invalid food selection');
      return;
    }

    // Check if already added
    const alreadyAdded = foodItems.find(item => item.foodId === formData.selectedFoodId);
    if (alreadyAdded) {
      toast.warning('This food is already in the list');
      return;
    }

    const newItem = {
      foodId: formData.selectedFoodId,
      foodName: selectedFood.foodName,
      category: selectedFood.category,
      price: formData.price,
      quantity: formData.quantity,
      description: selectedFood.description,
      optionalDescription: formData.optionalDescription,
      image: selectedFood.image,
      date: selectedDate,
      id: Date.now(), // Temporary ID for list management
    };

    setFoodItems([...foodItems, newItem]);
    toast.success(`${selectedFood.foodName} added to list`);
    
    // Reset form
    setFormData({
      selectedFoodId: '',
      price: '',
      quantity: '',
      optionalDescription: '',
    });
  };

  const handleRemoveFromList = (id) => {
    setFoodItems(foodItems.filter(item => item.id !== id));
    toast.info('Item removed from list');
  };

  const handleSubmitAll = async () => {
    if (foodItems.length === 0) {
      toast.error('Please add at least one food item');
      return;
    }

    setLoading(true);

    try {
      // Submit all items
      const promises = foodItems.map(item => {
        return axios.post('/admin/foods', {
          foodId: item.foodId,
          price: item.price,
          quantity: item.quantity,
          optionalDescription: item.optionalDescription,
          date: selectedDate,
        });
      });

      await Promise.all(promises);
      toast.success(`${foodItems.length} food items added successfully!`);
      navigate('/admin/foods');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add food items');
    }

    setLoading(false);
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
              <i className="bi bi-calendar-plus" style={{ fontSize: '2rem', color: '#000' }}></i>
            </div>
            <div>
              <h2 className="mb-1 text-white fw-bold">Add Daily Food Items</h2>
              <p className="mb-0 text-white-50">Set up today's menu by selecting items from master catalog</p>
            </div>
          </div>
        </div>
        <div 
          className="position-absolute top-0 end-0 opacity-25"
          style={{ fontSize: '150px', color: '#fbbf24', lineHeight: 1 }}
        >
          <i className="bi bi-calendar-week"></i>
        </div>
      </div>
      
      <Row>
        <Col lg={5}>
          <Card className="border-0 shadow mb-4" style={{ borderRadius: '12px', overflow: 'hidden', animation: 'slideIn 0.5s ease-out' }}>
            <Card.Header 
              className="py-3"
              style={{
                background: 'linear-gradient(135deg, #1f2937 0%, #000 100%)',
                border: 'none'
              }}
            >
              <h5 className="mb-0 text-white fw-bold">
                <i className="bi bi-calendar-event me-2" style={{ color: '#fbbf24' }}></i>
                Date & Item Selection
              </h5>
            </Card.Header>
            <Card.Body className="p-4" style={{ background: 'linear-gradient(135deg, #fefce8 0%, #fff 100%)' }}>
              <div className="mb-4">
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    <i className="bi bi-calendar3 me-2" style={{ color: '#fbbf24' }}></i>
                    Date *
                  </Form.Label>
                  <Form.Control
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    style={{
                      borderWidth: '2px',
                      borderRadius: '8px',
                      padding: '0.6rem',
                      borderColor: '#fbbf24'
                    }}
                  />
                  <Form.Text className="text-muted">
                    <i className="bi bi-info-circle me-1"></i>
                    Select the date for these food items
                  </Form.Text>
                </Form.Group>
              </div>

              <div 
                className="mb-3 p-2 rounded"
                style={{ background: 'rgba(251, 191, 36, 0.1)', border: '1px solid #fbbf24' }}
              >
                <h6 className="mb-0 fw-bold" style={{ color: '#1f2937' }}>
                  <i className="bi bi-plus-circle me-2" style={{ color: '#fbbf24' }}></i>
                  Add Food Item
                </h6>
              </div>
              <Form onSubmit={handleAddToList}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    <i className="bi bi-basket me-2" style={{ color: '#fbbf24' }}></i>
                    Select Food *
                  </Form.Label>
                  <Form.Select
                    name="selectedFoodId"
                    value={formData.selectedFoodId}
                    onChange={handleFoodSelect}
                    required
                    style={{
                      borderWidth: '2px',
                      borderRadius: '8px',
                      padding: '0.6rem'
                    }}
                  >
                    <option value="">-- Choose from master catalog --</option>
                    {masterFoods.map((food) => (
                      <option key={food._id} value={food._id}>
                        {food.foodName} ({food.category}) - LKR {food.defaultPrice}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Text className="text-muted">
                    <i className="bi bi-info-circle me-1"></i>
                    Select from your master food catalog
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    <i className="bi bi-cash-stack me-2" style={{ color: '#fbbf24' }}></i>
                    Price (LKR) *
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    placeholder="Enter price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                    style={{
                      borderWidth: '2px',
                      borderRadius: '8px',
                      padding: '0.6rem'
                    }}
                  />
                  <Form.Text className="text-muted">
                    <i className="bi bi-info-circle me-1"></i>
                    Adjust price if needed (default from catalog)
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    <i className="bi bi-boxes me-2" style={{ color: '#fbbf24' }}></i>
                    Quantity *
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="quantity"
                    placeholder="Enter available quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    min="0"
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
                    <i className="bi bi-card-text me-2" style={{ color: '#fbbf24' }}></i>
                    Optional Description
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="optionalDescription"
                    placeholder="Add optional notes or custom description for today..."
                    value={formData.optionalDescription}
                    onChange={handleChange}
                    style={{
                      borderWidth: '2px',
                      borderRadius: '8px',
                      padding: '0.6rem',
                      resize: 'vertical'
                    }}
                  />
                  <Form.Text className="text-muted">
                    <i className="bi bi-info-circle me-1"></i>
                    Add special notes or promotions for this item (optional)
                  </Form.Text>
                </Form.Group>

                <Button 
                  type="submit" 
                  className="w-100"
                  style={{
                    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                    border: '2px solid #000',
                    color: '#fff',
                    fontWeight: '700',
                    padding: '0.7rem',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(34, 197, 94, 0.4)'
                  }}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Add to List
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={7}>
          <Card className="border-0 shadow" style={{ borderRadius: '12px', overflow: 'hidden', animation: 'slideIn 0.6s ease-out' }}>
            <Card.Header 
              className="py-3"
              style={{
                background: 'linear-gradient(135deg, #1f2937 0%, #000 100%)',
                border: 'none'
              }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0 text-white fw-bold">
                  <i className="bi bi-list-check me-2" style={{ color: '#fbbf24' }}></i>
                  Food Items for {new Date(selectedDate).toLocaleDateString()}
                </h5>
                <Badge 
                  pill
                  style={{
                    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                    border: '2px solid #000',
                    color: '#000',
                    fontSize: '1rem',
                    padding: '0.5rem 1rem'
                  }}
                >
                  {foodItems.length} items
                </Badge>
              </div>
            </Card.Header>
            <Card.Body style={{ background: 'linear-gradient(135deg, #fefce8 0%, #fff 100%)' }}>

              {foodItems.length === 0 ? (
                <div 
                  className="text-center py-5 rounded-3"
                  style={{
                    background: '#fff',
                    border: '2px dashed #fbbf24'
                  }}
                >
                  <i className="bi bi-basket" style={{ fontSize: '4rem', color: '#fbbf24', opacity: 0.5 }}></i>
                  <h5 className="mt-3 mb-2" style={{ color: '#1f2937' }}>No Items Added Yet</h5>
                  <p className="text-muted mb-0">Add items using the form on the left to build today's menu.</p>
                </div>
              ) : (
                <>
                  <div className="mb-3">
                    {foodItems.map((item, index) => (
                      <div 
                        key={item.id}
                        className="mb-3 p-3 rounded-3"
                        style={{
                          background: '#fff',
                          border: '2px solid #e5e7eb',
                          transition: 'all 0.3s ease',
                          animation: `slideIn ${0.3 + index * 0.1}s ease-out`
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#fbbf24';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(251, 191, 36, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#e5e7eb';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center gap-3 flex-grow-1">
                            <div 
                              className="d-flex align-items-center justify-content-center rounded-circle fw-bold"
                              style={{
                                width: '40px',
                                height: '40px',
                                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                                color: '#000',
                                border: '2px solid #000'
                              }}
                            >
                              {index + 1}
                            </div>
                            <div className="flex-grow-1">
                              <div className="d-flex align-items-center gap-2 mb-1">
                                <h6 className="mb-0 fw-bold" style={{ color: '#1f2937' }}>{item.foodName}</h6>
                                <Badge 
                                  style={{
                                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                    border: 'none'
                                  }}
                                >
                                  {item.category}
                                </Badge>
                              </div>
                              {item.description && (
                                <p className="mb-0 text-muted" style={{ fontSize: '0.85rem' }}>
                                  {item.description}
                                </p>
                              )}
                              {item.optionalDescription && (
                                <div 
                                  className="mt-2 p-2 rounded"
                                  style={{
                                    background: 'rgba(251, 191, 36, 0.1)',
                                    border: '1px solid #fbbf24'
                                  }}
                                >
                                  <div className="d-flex align-items-start gap-2">
                                    <i className="bi bi-info-circle-fill mt-1" style={{ color: '#fbbf24', fontSize: '0.9rem' }}></i>
                                    <div>
                                      <small className="fw-semibold" style={{ color: '#1f2937' }}>Optional Note:</small>
                                      <p className="mb-0 text-muted" style={{ fontSize: '0.85rem' }}>
                                        {item.optionalDescription}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}
                              <div className="d-flex align-items-center gap-3 mt-2">
                                <span className="fw-semibold" style={{ color: '#22c55e' }}>
                                  <i className="bi bi-cash-stack me-1"></i>
                                  LKR {item.price}
                                </span>
                                <span className="text-muted">
                                  <i className="bi bi-boxes me-1" style={{ color: '#fbbf24' }}></i>
                                  Qty: <strong>{item.quantity}</strong>
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleRemoveFromList(item.id)}
                            style={{
                              background: 'transparent',
                              border: '2px solid #ef4444',
                              color: '#ef4444',
                              fontWeight: '600',
                              borderRadius: '8px',
                              padding: '0.4rem 1rem'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#ef4444';
                              e.currentTarget.style.color = '#fff';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'transparent';
                              e.currentTarget.style.color = '#ef4444';
                            }}
                          >
                            <i className="bi bi-trash me-1"></i>
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="d-flex gap-3 justify-content-end">
                    <Button
                      onClick={() => navigate('/admin/foods')}
                      style={{
                        background: 'transparent',
                        border: '2px solid #6b7280',
                        color: '#6b7280',
                        fontWeight: '600',
                        padding: '0.6rem 1.5rem',
                        borderRadius: '8px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#6b7280';
                        e.currentTarget.style.color = '#fff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#6b7280';
                      }}
                    >
                      <i className="bi bi-x-circle me-2"></i>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmitAll}
                      disabled={loading}
                      style={{
                        background: loading ? '#9ca3af' : 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                        border: '2px solid #000',
                        color: '#000',
                        fontWeight: '700',
                        padding: '0.6rem 1.5rem',
                        borderRadius: '8px',
                        boxShadow: loading ? 'none' : '0 4px 12px rgba(251, 191, 36, 0.4)',
                        cursor: loading ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-2"></i>
                          Save All {foodItems.length} Items
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddDailyFood;
