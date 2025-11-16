import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Table, Button, Spinner, Alert, Badge, Modal, Form } from 'react-bootstrap';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';

const ManageFoods = () => {
  const navigate = useNavigate();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingFood, setEditingFood] = useState(null);

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const { data } = await axios.get('/admin/foods');
      setFoods(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching foods:', err);
      setError(err.response?.data?.message || 'Failed to load foods');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this food item?')) {
      try {
        await axios.delete(`/admin/foods/${id}`);
        toast.success('Food deleted successfully!');
        fetchFoods();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete food');
      }
    }
  };

  const handleEdit = (food) => {
    setEditingFood({ ...food });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/admin/foods/${editingFood._id}`, editingFood);
      toast.success('Food updated successfully!');
      setShowEditModal(false);
      fetchFoods();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update food');
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading food items...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Error Loading Foods</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={fetchFoods}>
            Try Again
          </Button>
        </Alert>
      </Container>
    );
  }

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
          <div className="d-flex align-items-center justify-content-between">
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
                <i className="bi bi-calendar-day" style={{ fontSize: '2rem', color: '#000' }}></i>
              </div>
              <div>
                <h2 className="mb-1 text-white fw-bold">Daily Food Management</h2>
                <p className="mb-0 text-white-50">Manage today's available food items and inventory</p>
              </div>
            </div>
            <Button 
              onClick={() => navigate('/admin/foods/add')}
              style={{
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                border: '2px solid #000',
                color: '#000',
                fontWeight: '700',
                padding: '0.7rem 1.5rem',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(251, 191, 36, 0.4)'
              }}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Add New Food
            </Button>
          </div>
        </div>
        <div 
          className="position-absolute top-0 end-0 opacity-25"
          style={{ fontSize: '150px', color: '#fbbf24', lineHeight: 1 }}
        >
          <i className="bi bi-calendar-check"></i>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div 
            className="modern-card p-3 h-100"
            style={{
              background: 'linear-gradient(135deg, #fefce8 0%, #fff 100%)',
              border: '2px solid #fbbf24',
              borderRadius: '12px',
              animation: 'slideIn 0.5s ease-out'
            }}
          >
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <p className="text-muted mb-1 fw-semibold" style={{ fontSize: '0.85rem' }}>Total Items</p>
                <h3 className="mb-0 fw-bold" style={{ color: '#000' }}>{foods.length}</h3>
              </div>
              <div 
                className="d-flex align-items-center justify-content-center rounded-circle"
                style={{
                  width: '50px',
                  height: '50px',
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
                }}
              >
                <i className="bi bi-basket" style={{ fontSize: '1.5rem', color: '#000' }}></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div 
            className="modern-card p-3 h-100"
            style={{
              background: 'linear-gradient(135deg, #fefce8 0%, #fff 100%)',
              border: '2px solid #22c55e',
              borderRadius: '12px',
              animation: 'slideIn 0.6s ease-out'
            }}
          >
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <p className="text-muted mb-1 fw-semibold" style={{ fontSize: '0.85rem' }}>Available</p>
                <h3 className="mb-0 fw-bold" style={{ color: '#22c55e' }}>
                  {foods.filter(f => (f.quantity || 0) > 0).length}
                </h3>
              </div>
              <div 
                className="d-flex align-items-center justify-content-center rounded-circle"
                style={{
                  width: '50px',
                  height: '50px',
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
                }}
              >
                <i className="bi bi-check-circle" style={{ fontSize: '1.5rem', color: '#fff' }}></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div 
            className="modern-card p-3 h-100"
            style={{
              background: 'linear-gradient(135deg, #fefce8 0%, #fff 100%)',
              border: '2px solid #ef4444',
              borderRadius: '12px',
              animation: 'slideIn 0.7s ease-out'
            }}
          >
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <p className="text-muted mb-1 fw-semibold" style={{ fontSize: '0.85rem' }}>Out of Stock</p>
                <h3 className="mb-0 fw-bold" style={{ color: '#ef4444' }}>
                  {foods.filter(f => (f.quantity || 0) === 0).length}
                </h3>
              </div>
              <div 
                className="d-flex align-items-center justify-content-center rounded-circle"
                style={{
                  width: '50px',
                  height: '50px',
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                }}
              >
                <i className="bi bi-x-circle" style={{ fontSize: '1.5rem', color: '#fff' }}></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {foods.length === 0 ? (
        <div 
          className="text-center py-5 rounded-3"
          style={{
            background: 'linear-gradient(135deg, #fefce8 0%, #fff 100%)',
            border: '2px dashed #fbbf24'
          }}
        >
          <i className="bi bi-basket" style={{ fontSize: '4rem', color: '#fbbf24', opacity: 0.5 }}></i>
          <h4 className="mt-3 mb-2" style={{ color: '#1f2937' }}>No Food Items Available</h4>
          <p className="text-muted mb-3">Get started by adding your first food item!</p>
          <Button 
            onClick={() => navigate('/admin/foods/add')}
            style={{
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              border: '2px solid #000',
              color: '#000',
              fontWeight: '700',
              padding: '0.6rem 1.5rem',
              borderRadius: '8px'
            }}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Add Food Item
          </Button>
        </div>
      ) : (
        <div className="row g-3">
          {foods.map((food, index) => (
            <div key={food._id} className="col-md-6 col-lg-4">
              <div 
                className="h-100 rounded-3 overflow-hidden"
                style={{
                  background: '#fff',
                  border: (food.quantity || 0) > 0 ? '2px solid #22c55e' : '2px solid #ef4444',
                  transition: 'all 0.3s ease',
                  animation: `slideIn ${0.3 + index * 0.05}s ease-out`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Image Section */}
                <div 
                  className="position-relative"
                  style={{
                    height: '200px',
                    background: 'linear-gradient(135deg, #fefce8 0%, #fff 100%)'
                  }}
                >
                  <img
                    src={food.image || 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={food.foodName || 'Food'}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover'
                    }}
                    onError={(e) => { 
                      e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'; 
                    }}
                  />
                  {/* Status Badge */}
                  <div 
                    className="position-absolute top-0 end-0 m-2"
                  >
                    <Badge 
                      pill
                      style={{
                        background: (food.quantity || 0) > 0 
                          ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' 
                          : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                        border: '2px solid #fff',
                        fontSize: '0.85rem',
                        padding: '0.4rem 0.8rem'
                      }}
                    >
                      {(food.quantity || 0) > 0 ? (
                        <>
                          <i className="bi bi-check-circle me-1"></i>
                          Available
                        </>
                      ) : (
                        <>
                          <i className="bi bi-x-circle me-1"></i>
                          Out of Stock
                        </>
                      )}
                    </Badge>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-3" style={{ background: 'linear-gradient(135deg, #fefce8 0%, #fff 100%)' }}>
                  <h5 className="mb-2 fw-bold" style={{ color: '#1f2937' }}>
                    {food.foodName || 'N/A'}
                  </h5>
                  {food.description && (
                    <p 
                      className="text-muted mb-2"
                      style={{ 
                        fontSize: '0.85rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {food.description}
                    </p>
                  )}
                  
                  {/* Price and Quantity */}
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div 
                      className="fw-bold fs-5"
                      style={{
                        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                      }}
                    >
                      LKR {(food.price || 0).toFixed(2)}
                    </div>
                    <Badge 
                      style={{
                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                        border: 'none',
                        fontSize: '0.9rem',
                        padding: '0.4rem 0.8rem'
                      }}
                    >
                      <i className="bi bi-boxes me-1"></i>
                      Qty: {food.quantity || 0}
                    </Badge>
                  </div>

                  {/* Action Buttons */}
                  <div className="d-flex gap-2">
                    <Button
                      size="sm"
                      className="flex-grow-1"
                      onClick={() => handleEdit(food)}
                      style={{
                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                        border: '2px solid #1e3a8a',
                        color: '#fff',
                        fontWeight: '600',
                        borderRadius: '6px',
                        padding: '0.5rem'
                      }}
                    >
                      <i className="bi bi-pencil me-1"></i>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      className="flex-grow-1"
                      onClick={() => handleDelete(food._id)}
                      style={{
                        background: 'transparent',
                        border: '2px solid #ef4444',
                        color: '#ef4444',
                        fontWeight: '600',
                        borderRadius: '6px',
                        padding: '0.5rem'
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
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg" centered>
        <Modal.Header closeButton style={{ background: 'linear-gradient(135deg, #1f2937 0%, #000 100%)', border: 'none' }}>
          <Modal.Title className="text-white fw-bold">
            <i className="bi bi-pencil-square me-2" style={{ color: '#fbbf24' }}></i>
            Edit Food Item
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdate}>
          <Modal.Body className="p-4" style={{ background: '#fefce8' }}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">
                <i className="bi bi-tag me-2" style={{ color: '#fbbf24' }}></i>
                Food Name *
              </Form.Label>
              <Form.Control
                type="text"
                value={editingFood?.foodName || ''}
                onChange={(e) =>
                  setEditingFood({ ...editingFood, foodName: e.target.value })
                }
                required
                style={{
                  borderWidth: '2px',
                  borderRadius: '8px',
                  padding: '0.6rem'
                }}
              />
            </Form.Group>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    <i className="bi bi-cash-stack me-2" style={{ color: '#fbbf24' }}></i>
                    Price (LKR) *
                  </Form.Label>
                  <Form.Control
                    type="number"
                    value={editingFood?.price || ''}
                    onChange={(e) =>
                      setEditingFood({ ...editingFood, price: e.target.value })
                    }
                    min="0"
                    step="0.01"
                    required
                    style={{
                      borderWidth: '2px',
                      borderRadius: '8px',
                      padding: '0.6rem'
                    }}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    <i className="bi bi-boxes me-2" style={{ color: '#fbbf24' }}></i>
                    Quantity *
                  </Form.Label>
                  <Form.Control
                    type="number"
                    value={editingFood?.quantity || ''}
                    onChange={(e) =>
                      setEditingFood({ ...editingFood, quantity: e.target.value })
                    }
                    min="0"
                    required
                    style={{
                      borderWidth: '2px',
                      borderRadius: '8px',
                      padding: '0.6rem'
                    }}
                  />
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">
                <i className="bi bi-card-text me-2" style={{ color: '#fbbf24' }}></i>
                Description
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={editingFood?.description || ''}
                onChange={(e) =>
                  setEditingFood({ ...editingFood, description: e.target.value })
                }
                style={{
                  borderWidth: '2px',
                  borderRadius: '8px',
                  padding: '0.6rem'
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">
                <i className="bi bi-image me-2" style={{ color: '#fbbf24' }}></i>
                Image URL
              </Form.Label>
              <Form.Control
                type="url"
                value={editingFood?.image || ''}
                onChange={(e) =>
                  setEditingFood({ ...editingFood, image: e.target.value })
                }
                style={{
                  borderWidth: '2px',
                  borderRadius: '8px',
                  padding: '0.6rem'
                }}
              />
              {editingFood?.image && (
                <div className="mt-2">
                  <img 
                    src={editingFood.image} 
                    alt="Preview" 
                    style={{ 
                      maxWidth: '200px', 
                      maxHeight: '150px', 
                      borderRadius: '8px',
                      border: '2px solid #fbbf24'
                    }}
                    onError={(e) => e.target.style.display = 'none'}
                  />
                </div>
              )}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer style={{ background: '#fff', borderTop: '2px solid #fbbf24' }}>
            <Button 
              variant="light" 
              onClick={() => setShowEditModal(false)}
              style={{
                borderWidth: '2px',
                borderColor: '#d1d5db',
                fontWeight: '600',
                padding: '0.6rem 1.5rem',
                borderRadius: '8px'
              }}
            >
              <i className="bi bi-x-circle me-2"></i>
              Cancel
            </Button>
            <Button 
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                border: '2px solid #000',
                color: '#000',
                fontWeight: '700',
                padding: '0.6rem 1.5rem',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(251, 191, 36, 0.4)'
              }}
            >
              <i className="bi bi-check-circle me-2"></i>
              Update Food
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default ManageFoods;
