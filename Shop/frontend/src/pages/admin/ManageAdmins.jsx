import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Modal, Form, Alert, Spinner, Badge } from 'react-bootstrap';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';

const ManageAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const { data } = await axios.get('/admin/admins');
      setAdmins(data);
      setLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load admins');
      setLoading(false);
    }
  };

  const handleShowModal = () => {
    setShowModal(true);
    setFormData({ name: '', email: '', password: '' });
    setErrors({});
    setShowPassword(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({ name: '', email: '', password: '' });
    setErrors({});
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error for this field when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await axios.post('/admin/admins', formData);
      toast.success('Admin created successfully!');
      handleCloseModal();
      fetchAdmins();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create admin');
    }
  };

  const handleDelete = async (adminId, adminName) => {
    if (window.confirm(`Are you sure you want to delete admin "${adminName}"?`)) {
      try {
        await axios.delete(`/admin/admins/${adminId}`);
        toast.success('Admin deleted successfully!');
        fetchAdmins();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete admin');
      }
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  const totalAdmins = admins.length;
  const recentAdmins = admins.filter(a => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return new Date(a.createdAt) >= thirtyDaysAgo;
  }).length;

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
                <i className="bi bi-shield-lock-fill me-3"></i>
                Manage Admins
              </h2>
              <p className="text-white-50 mb-0">Control admin access and permissions</p>
            </div>
            <Button
              onClick={handleShowModal}
              style={{
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                border: 'none',
                padding: '12px 24px',
                fontWeight: 'bold',
                borderRadius: '8px',
              }}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Add New Admin
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
          className="bi bi-key-fill"
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
        <div className="col-md-6 mb-3">
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
                <h6 className="text-white mb-1">Total Admins</h6>
                <h2 className="mb-0" style={{ color: '#000', fontWeight: 'bold' }}>
                  {totalAdmins}
                </h2>
              </div>
              <i className="bi bi-shield-lock-fill" style={{ fontSize: '3rem', color: '#000', opacity: 0.2 }} />
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-3">
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
                <h6 className="text-white mb-1">New (30 days)</h6>
                <h2 className="mb-0" style={{ color: '#000', fontWeight: 'bold' }}>
                  {recentAdmins}
                </h2>
              </div>
              <i className="bi bi-person-plus-fill" style={{ fontSize: '3rem', color: '#000', opacity: 0.2 }} />
            </div>
          </div>
        </div>
      </div>

      {/* Info Alert */}
      <div
        className="mb-4 p-3 rounded-3"
        style={{
          background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
          border: '2px solid #ef4444',
        }}
      >
        <i className="bi bi-exclamation-triangle-fill me-2" style={{ color: '#991b1b' }}></i>
        <span style={{ color: '#7f1d1d', fontWeight: '500' }}>
          Admin users have full access to all system features. Only add trusted personnel.
        </span>
      </div>

      {/* Admin Cards Grid */}
      {admins.length === 0 ? (
        <div
          className="text-center py-5"
          style={{
            background: '#fef3c7',
            border: '2px dashed #f59e0b',
            borderRadius: '8px',
          }}
        >
          <i className="bi bi-shield-lock-fill" style={{ fontSize: '4rem', color: '#f59e0b', opacity: 0.3 }} />
          <h4 className="mt-3" style={{ color: '#92400e' }}>
            No Admins Found
          </h4>
          <p style={{ color: '#92400e' }}>Add your first admin to get started!</p>
          <Button
            onClick={handleShowModal}
            style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              border: 'none',
              padding: '10px 24px',
              fontWeight: 'bold',
              borderRadius: '8px',
            }}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Add First Admin
          </Button>
        </div>
      ) : (
        <div className="row">
          {admins.map((admin, index) => {
            const isRecent = (() => {
              const thirtyDaysAgo = new Date();
              thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
              return new Date(admin.createdAt) >= thirtyDaysAgo;
            })();

            return (
              <div
                key={admin._id}
                className="col-md-6 col-lg-4 mb-4"
                style={{
                  animation: `slideIn ${0.3 + index * 0.05}s ease-out`,
                }}
              >
                <div
                  className="h-100 rounded-3"
                  style={{
                    border: '2px solid #ef4444',
                    background: '#fff',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(239,68,68,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Card Header */}
                  <div
                    className="p-3"
                    style={{
                      background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                      borderBottom: '2px solid #ef4444',
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div className="d-flex align-items-center">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center me-3"
                          style={{
                            width: '50px',
                            height: '50px',
                            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                            color: '#fff',
                            fontWeight: 'bold',
                            fontSize: '1.5rem',
                          }}
                        >
                          <i className="bi bi-shield-lock-fill"></i>
                        </div>
                        <div>
                          <h5 className="mb-0" style={{ fontWeight: 'bold', color: '#7f1d1d' }}>
                            {admin.name}
                          </h5>
                          <Badge
                            bg="danger"
                            style={{ fontSize: '0.7rem', marginTop: '4px' }}
                          >
                            <i className="bi bi-key-fill me-1"></i>
                            Admin
                          </Badge>
                        </div>
                      </div>
                      {isRecent && (
                        <Badge
                          bg="success"
                          style={{ fontSize: '0.7rem' }}
                        >
                          <i className="bi bi-stars me-1"></i>
                          New
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-3">
                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-envelope-fill me-2" style={{ color: '#3b82f6', fontSize: '1.1rem' }}></i>
                        <span style={{ color: '#374151', fontSize: '0.9rem', wordBreak: 'break-word' }}>
                          {admin.email}
                        </span>
                      </div>
                      
                      <div className="d-flex align-items-center">
                        <i className="bi bi-calendar-check me-2" style={{ color: '#6b7280', fontSize: '1.1rem' }}></i>
                        <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>
                          Created: {new Date(admin.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>

                    <div
                      className="mb-3 p-2 rounded"
                      style={{
                        background: '#fef3c7',
                        border: '2px solid #fbbf24',
                      }}
                    >
                      <div className="d-flex align-items-center">
                        <i className="bi bi-shield-check me-2" style={{ color: '#f59e0b', fontSize: '1rem' }}></i>
                        <span style={{ color: '#92400e', fontSize: '0.85rem', fontWeight: '500' }}>
                          Full System Access
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      size="sm"
                      onClick={() => handleDelete(admin._id, admin.name)}
                      className="w-100"
                      style={{
                        background: 'transparent',
                        border: '2px solid #ef4444',
                        color: '#ef4444',
                        fontWeight: 'bold',
                        padding: '10px',
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
                      <i className="bi bi-trash me-2"></i>
                      Delete Admin
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Admin Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
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
              <i className="bi bi-shield-lock-fill me-2"></i>
              Add New Admin
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body style={{ background: '#fefce8' }}>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: 'bold', color: '#000' }}>
                  <i className="bi bi-person-fill me-2" style={{ color: '#f59e0b' }}></i>
                  Name *
                </Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  isInvalid={!!errors.name}
                  placeholder="Enter admin name"
                  style={{
                    border: errors.name ? '2px solid #ef4444' : '2px solid #fbbf24',
                    borderRadius: '8px',
                    padding: '12px',
                  }}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: 'bold', color: '#000' }}>
                  <i className="bi bi-envelope-fill me-2" style={{ color: '#3b82f6' }}></i>
                  Email *
                </Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                  placeholder="Enter admin email"
                  style={{
                    border: errors.email ? '2px solid #ef4444' : '2px solid #fbbf24',
                    borderRadius: '8px',
                    padding: '12px',
                  }}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: 'bold', color: '#000' }}>
                  <i className="bi bi-key-fill me-2" style={{ color: '#22c55e' }}></i>
                  Password *
                </Form.Label>
                <div style={{ position: 'relative' }}>
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    isInvalid={!!errors.password}
                    placeholder="Enter password (min 6 characters)"
                    style={{
                      border: errors.password ? '2px solid #ef4444' : '2px solid #fbbf24',
                      borderRadius: '8px',
                      padding: '12px',
                      paddingRight: '45px',
                    }}
                  />
                  <i
                    className={`bi bi-eye${showPassword ? '-slash' : ''}-fill`}
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
                      color: '#6b7280',
                      fontSize: '1.1rem',
                      zIndex: 10
                    }}
                  ></i>
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </div>
              </Form.Group>

              <div
                className="p-3 rounded-3"
                style={{
                  background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                  border: '2px solid #ef4444',
                }}
              >
                <div className="d-flex align-items-start">
                  <i className="bi bi-exclamation-triangle-fill me-2 mt-1" style={{ color: '#991b1b', fontSize: '1.2rem' }}></i>
                  <small style={{ color: '#7f1d1d', fontWeight: '500' }}>
                    The new admin will be able to access all admin features including creating other admins, managing orders, foods, and customers.
                  </small>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer style={{ background: '#fefce8', borderTop: '2px solid #fbbf24' }}>
              <Button
                variant="secondary"
                onClick={handleCloseModal}
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
                <i className="bi bi-plus-circle me-2"></i>
                Create Admin
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

export default ManageAdmins;
