import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Modal, Form } from 'react-bootstrap';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';

const MasterFoods = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [formData, setFormData] = useState({
    foodName: '',
    category: 'Other',
    defaultPrice: '',
    description: '',
    image: '',
    isActive: true,
  });

  const categories = ['Rice', 'Noodles', 'Kottu', 'Burgers', 'Submarines', 'Pizza', 'Biriyani', 'Hoppers', 'Short Eats', 'Gravy', 'Other'];

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const { data } = await axios.get('/admin/master-foods');
      setFoods(data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch foods');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleAddNew = () => {
    setEditMode(false);
    setSelectedFood(null);
    setFormData({
      foodName: '',
      category: 'Other',
      defaultPrice: '',
      description: '',
      image: '',
      isActive: true,
    });
    setShowModal(true);
  };

  const handleEdit = (food) => {
    setEditMode(true);
    setSelectedFood(food);
    setFormData({
      foodName: food.foodName,
      category: food.category,
      defaultPrice: food.defaultPrice,
      description: food.description || '',
      image: food.image || '',
      isActive: food.isActive,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editMode) {
        await axios.put(`/admin/master-foods/${selectedFood._id}`, formData);
        toast.success('Food updated successfully!');
      } else {
        await axios.post('/admin/master-foods', formData);
        toast.success('Food added successfully!');
      }
      setShowModal(false);
      fetchFoods();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this food?')) {
      try {
        await axios.delete(`/admin/master-foods/${id}`);
        toast.success('Food deleted successfully');
        fetchFoods();
      } catch (error) {
        toast.error('Failed to delete food');
      }
    }
  };

  const toggleActive = async (food) => {
    try {
      await axios.put(`/admin/master-foods/${food._id}`, {
        ...food,
        isActive: !food.isActive,
      });
      toast.success(`Food ${!food.isActive ? 'activated' : 'deactivated'}`);
      fetchFoods();
    } catch (error) {
      toast.error('Failed to update food status');
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  const totalFoods = foods.length;
  const activeFoods = foods.filter(f => f.isActive).length;
  const inactiveFoods = foods.filter(f => !f.isActive).length;
  const totalCategories = [...new Set(foods.map(f => f.category))].length;

  return (
    <Container className="py-5">
      {/* Professional Header */}
      <div
        className="mb-4 p-4 rounded-3"
        style={{
          background: 'linear-gradient(135deg, #000 0%, #1f2937 100%)',
          border: '2px solid #fbbf24',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2
                className="mb-2"
                style={{
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 'bold',
                  fontSize: '2rem',
                }}
              >
                <i className="bi bi-book-fill me-3"></i>
                Master Food Catalog
              </h2>
              <p className="text-white-50 mb-0">Manage your restaurant's complete food menu</p>
            </div>
            <Button
              onClick={handleAddNew}
              style={{
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                border: 'none',
                padding: '12px 24px',
                fontWeight: 'bold',
                borderRadius: '8px',
              }}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Add New Food
            </Button>
          </div>
        </div>
        {/* Decorative Elements */}
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '200px',
            height: '200px',
            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
            borderRadius: '50%',
            opacity: 0.1,
          }}
        />
        <i
          className="bi bi-egg-fried"
          style={{
            position: 'absolute',
            bottom: '20px',
            right: '30px',
            fontSize: '4rem',
            color: '#fbbf24',
            opacity: 0.1,
          }}
        />
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div
            className="p-4 rounded-3 h-100"
            style={{
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              border: '2px solid #000',
              animation: 'slideIn 0.3s ease-out',
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-white mb-1">Total Foods</h6>
                <h2 className="mb-0" style={{ color: '#000', fontWeight: 'bold' }}>
                  {totalFoods}
                </h2>
              </div>
              <i className="bi bi-egg-fried" style={{ fontSize: '3rem', color: '#000', opacity: 0.2 }} />
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div
            className="p-4 rounded-3 h-100"
            style={{
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              border: '2px solid #000',
              animation: 'slideIn 0.35s ease-out',
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-white mb-1">Active Foods</h6>
                <h2 className="mb-0" style={{ color: '#000', fontWeight: 'bold' }}>
                  {activeFoods}
                </h2>
              </div>
              <i className="bi bi-check-circle-fill" style={{ fontSize: '3rem', color: '#000', opacity: 0.2 }} />
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div
            className="p-4 rounded-3 h-100"
            style={{
              background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
              border: '2px solid #000',
              animation: 'slideIn 0.4s ease-out',
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-white mb-1">Inactive Foods</h6>
                <h2 className="mb-0" style={{ color: '#000', fontWeight: 'bold' }}>
                  {inactiveFoods}
                </h2>
              </div>
              <i className="bi bi-x-circle-fill" style={{ fontSize: '3rem', color: '#000', opacity: 0.2 }} />
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div
            className="p-4 rounded-3 h-100"
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              border: '2px solid #000',
              animation: 'slideIn 0.45s ease-out',
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-white mb-1">Categories</h6>
                <h2 className="mb-0" style={{ color: '#000', fontWeight: 'bold' }}>
                  {totalCategories}
                </h2>
              </div>
              <i className="bi bi-grid-3x3-gap-fill" style={{ fontSize: '3rem', color: '#000', opacity: 0.2 }} />
            </div>
          </div>
        </div>
      </div>

      {/* Food Cards Grid */}
      {foods.length === 0 ? (
        <div
          className="text-center py-5"
          style={{
            background: '#fef3c7',
            border: '2px dashed #f59e0b',
            borderRadius: '8px',
          }}
        >
          <i className="bi bi-egg-fried" style={{ fontSize: '4rem', color: '#f59e0b', opacity: 0.3 }} />
          <h4 className="mt-3" style={{ color: '#92400e' }}>
            No Foods in Catalog
          </h4>
          <p style={{ color: '#92400e' }}>Add your first food item to get started!</p>
          <Button
            onClick={handleAddNew}
            style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              border: 'none',
              padding: '10px 24px',
              fontWeight: 'bold',
              borderRadius: '8px',
            }}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Add First Food
          </Button>
        </div>
      ) : (
        <div className="row">
          {foods.map((food, index) => (
            <div
              key={food._id}
              className="col-md-6 col-lg-4 mb-4"
              style={{
                animation: `slideIn ${0.3 + index * 0.05}s ease-out`,
              }}
            >
              <div
                className="h-100 rounded-3"
                style={{
                  border: food.isActive ? '2px solid #22c55e' : '2px solid #6b7280',
                  background: '#fff',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Food Image */}
                <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                  <img
                    src={food.image || 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={food.foodName}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  />
                  <Badge
                    bg={food.isActive ? 'success' : 'secondary'}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      padding: '6px 12px',
                      fontSize: '0.85rem',
                    }}
                  >
                    <i className={`bi bi-${food.isActive ? 'check-circle-fill' : 'x-circle-fill'} me-1`}></i>
                    {food.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  <Badge
                    bg="info"
                    style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      padding: '6px 12px',
                      fontSize: '0.85rem',
                    }}
                  >
                    {food.category}
                  </Badge>
                </div>

                {/* Card Body */}
                <div className="p-3">
                  <h5 className="mb-2" style={{ fontWeight: 'bold', color: '#000' }}>
                    {food.foodName}
                  </h5>
                  
                  {food.description && (
                    <p
                      className="mb-3"
                      style={{
                        color: '#6b7280',
                        fontSize: '0.9rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {food.description}
                    </p>
                  )}

                  <div
                    className="mb-3 p-2 rounded"
                    style={{
                      background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                      border: '2px solid #fbbf24',
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-center">
                      <i className="bi bi-cash-coin me-2" style={{ color: '#f59e0b', fontSize: '1.2rem' }}></i>
                      <span style={{ fontWeight: 'bold', color: '#92400e', fontSize: '1.1rem' }}>
                        LKR {food.defaultPrice}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="d-flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleEdit(food)}
                      style={{
                        flex: 1,
                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                        border: 'none',
                        fontWeight: 'bold',
                        padding: '8px',
                        borderRadius: '6px',
                      }}
                    >
                      <i className="bi bi-pencil me-1"></i>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => toggleActive(food)}
                      style={{
                        flex: 1,
                        background: food.isActive
                          ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                          : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                        border: 'none',
                        fontWeight: 'bold',
                        padding: '8px',
                        borderRadius: '6px',
                      }}
                    >
                      <i className={`bi bi-${food.isActive ? 'pause-circle' : 'play-circle'} me-1`}></i>
                      {food.isActive ? 'Pause' : 'Activate'}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleDelete(food._id)}
                      style={{
                        background: 'transparent',
                        border: '2px solid #ef4444',
                        color: '#ef4444',
                        fontWeight: 'bold',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        transition: 'all 0.3s ease',
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
                      <i className="bi bi-trash"></i>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <div style={{ border: '2px solid #fbbf24', borderRadius: '8px', overflow: 'hidden' }}>
          <Modal.Header
            closeButton
            style={{
              background: 'linear-gradient(135deg, #000 0%, #1f2937 100%)',
              border: 'none',
            }}
          >
            <Modal.Title
              style={{
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold',
              }}
            >
              <i className="bi bi-egg-fried me-2"></i>
              {editMode ? 'Edit Food Item' : 'Add New Food Item'}
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body style={{ background: '#fefce8' }}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: 'bold', color: '#000' }}>
                      <i className="bi bi-card-text me-2" style={{ color: '#f59e0b' }}></i>
                      Food Name *
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="foodName"
                      placeholder="e.g., Rice & Curry"
                      value={formData.foodName}
                      onChange={handleChange}
                      required
                      style={{
                        border: '2px solid #fbbf24',
                        borderRadius: '8px',
                        padding: '12px',
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: 'bold', color: '#000' }}>
                      <i className="bi bi-grid-3x3-gap me-2" style={{ color: '#3b82f6' }}></i>
                      Category *
                    </Form.Label>
                    <Form.Select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      style={{
                        border: '2px solid #fbbf24',
                        borderRadius: '8px',
                        padding: '12px',
                      }}
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: 'bold', color: '#000' }}>
                  <i className="bi bi-cash-coin me-2" style={{ color: '#22c55e' }}></i>
                  Default Price (LKR) *
                </Form.Label>
                <Form.Control
                  type="number"
                  name="defaultPrice"
                  placeholder="Enter default price"
                  value={formData.defaultPrice}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                  style={{
                    border: '2px solid #fbbf24',
                    borderRadius: '8px',
                    padding: '12px',
                  }}
                />
                <Form.Text style={{ color: '#92400e', fontWeight: '500' }}>
                  This price will be used when adding to daily menu
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: 'bold', color: '#000' }}>
                  <i className="bi bi-card-text me-2" style={{ color: '#6b7280' }}></i>
                  Description
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  placeholder="Brief description of the food item"
                  value={formData.description}
                  onChange={handleChange}
                  style={{
                    border: '2px solid #fbbf24',
                    borderRadius: '8px',
                    padding: '12px',
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: 'bold', color: '#000' }}>
                  <i className="bi bi-image me-2" style={{ color: '#ec4899' }}></i>
                  Image URL
                </Form.Label>
                <Form.Control
                  type="url"
                  name="image"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image}
                  onChange={handleChange}
                  style={{
                    border: '2px solid #fbbf24',
                    borderRadius: '8px',
                    padding: '12px',
                  }}
                />
                {formData.image && (
                  <div className="mt-2">
                    <img
                      src={formData.image}
                      alt="Preview"
                      style={{
                        width: '100%',
                        maxHeight: '200px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '2px solid #fbbf24',
                      }}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=Invalid+Image';
                      }}
                    />
                  </div>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <div
                  className="p-3 rounded-3"
                  style={{
                    background: formData.isActive ? '#dcfce7' : '#f3f4f6',
                    border: formData.isActive ? '2px solid #22c55e' : '2px solid #d1d5db',
                  }}
                >
                  <Form.Check
                    type="checkbox"
                    name="isActive"
                    label={
                      <span style={{ fontWeight: 'bold', color: '#000' }}>
                        <i
                          className={`bi bi-${formData.isActive ? 'check-circle-fill' : 'x-circle-fill'} me-2`}
                          style={{ color: formData.isActive ? '#22c55e' : '#6b7280' }}
                        ></i>
                        Active (Available for selection in daily menu)
                      </span>
                    }
                    checked={formData.isActive}
                    onChange={handleChange}
                  />
                </div>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer style={{ background: '#fefce8', borderTop: '2px solid #fbbf24' }}>
              <Button
                variant="secondary"
                onClick={() => setShowModal(false)}
                style={{
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontWeight: 'bold',
                }}
              >
                <i className="bi bi-x-circle me-2"></i>
                Cancel
              </Button>
              <Button
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontWeight: 'bold',
                  color: '#000',
                }}
              >
                <i className={`bi bi-${editMode ? 'check-circle' : 'plus-circle'} me-2`}></i>
                {editMode ? 'Update Food' : 'Add Food'}
              </Button>
            </Modal.Footer>
          </Form>
        </div>
      </Modal>

      {/* Animations */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Container>
  );
};

export default MasterFoods;
