import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    location: user?.location || '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    const updateData = {
      name: formData.name,
      phone: formData.phone,
      location: formData.location,
    };

    if (formData.password) {
      updateData.password = formData.password;
    }

    try {
      const { data } = await axios.put('/auth/profile', updateData);
      updateUser(data);
      toast.success('Profile updated successfully!');
      setFormData({ ...formData, password: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }

    setLoading(false);
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          {/* Professional Header */}
          <div
            className="mb-4 p-4 rounded-3"
            style={{
              background: 'linear-gradient(135deg, #000 0%, #1f2937 100%)',
              border: '2px solid #fbbf24',
              position: 'relative',
              overflow: 'hidden',
              animation: 'slideIn 0.3s ease-out',
            }}
          >
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div className="d-flex align-items-center">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center me-4"
                  style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                    color: '#000',
                    fontWeight: 'bold',
                    fontSize: '2.5rem',
                    border: '3px solid #fff',
                  }}
                >
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
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
                    My Profile
                  </h2>
                  <p className="text-white-50 mb-0">
                    <i className="bi bi-envelope-fill me-2"></i>
                    {user?.email}
                  </p>
                </div>
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
              className="bi bi-person-circle"
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

          <Row>
            {/* Personal Information Section */}
            <Col lg={12} className="mb-4">
              <div
                className="rounded-3 p-4"
                style={{
                  background: '#fff',
                  border: '2px solid #fbbf24',
                  animation: 'slideIn 0.35s ease-out',
                }}
              >
                <div
                  className="mb-4 pb-3"
                  style={{
                    borderBottom: '2px solid #fef3c7',
                  }}
                >
                  <h4
                    style={{
                      background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: 'bold',
                    }}
                  >
                    <i className="bi bi-person-badge-fill me-2"></i>
                    Personal Information
                  </h4>
                </div>

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={12} className="mb-3">
                      <Form.Group>
                        <Form.Label style={{ fontWeight: 'bold', color: '#000' }}>
                          <i className="bi bi-envelope-fill me-2" style={{ color: '#3b82f6' }}></i>
                          Email Address
                        </Form.Label>
                        <Form.Control
                          type="email"
                          value={user?.email}
                          disabled
                          style={{
                            border: '2px solid #d1d5db',
                            borderRadius: '8px',
                            padding: '12px',
                            background: '#f3f4f6',
                            color: '#6b7280',
                          }}
                        />
                        <Form.Text style={{ color: '#92400e', fontWeight: '500' }}>
                          <i className="bi bi-lock-fill me-1"></i>
                          Email cannot be changed
                        </Form.Text>
                      </Form.Group>
                    </Col>

                    <Col md={12} className="mb-3">
                      <Form.Group>
                        <Form.Label style={{ fontWeight: 'bold', color: '#000' }}>
                          <i className="bi bi-person-fill me-2" style={{ color: '#f59e0b' }}></i>
                          Full Name *
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Enter your full name"
                          style={{
                            border: '2px solid #fbbf24',
                            borderRadius: '8px',
                            padding: '12px',
                          }}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label style={{ fontWeight: 'bold', color: '#000' }}>
                          <i className="bi bi-telephone-fill me-2" style={{ color: '#22c55e' }}></i>
                          Phone Number
                        </Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Enter your phone number"
                          style={{
                            border: '2px solid #fbbf24',
                            borderRadius: '8px',
                            padding: '12px',
                          }}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label style={{ fontWeight: 'bold', color: '#000' }}>
                          <i className="bi bi-geo-alt-fill me-2" style={{ color: '#ec4899' }}></i>
                          Location
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="Enter your location"
                          style={{
                            border: '2px solid #fbbf24',
                            borderRadius: '8px',
                            padding: '12px',
                          }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Change Password Section */}
                  <div
                    className="mt-4 p-3 rounded-3"
                    style={{
                      background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                      border: '2px solid #fbbf24',
                    }}
                  >
                    <h5
                      className="mb-3"
                      style={{
                        color: '#92400e',
                        fontWeight: 'bold',
                      }}
                    >
                      <i className="bi bi-shield-lock-fill me-2"></i>
                      Change Password (Optional)
                    </h5>

                    <Row>
                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label style={{ fontWeight: 'bold', color: '#000' }}>
                            <i className="bi bi-key-fill me-2" style={{ color: '#6b7280' }}></i>
                            New Password
                          </Form.Label>
                          <div style={{ position: 'relative' }}>
                            <Form.Control
                              type={showPassword ? 'text' : 'password'}
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                              placeholder="Leave blank to keep current"
                              minLength={6}
                              style={{
                                border: '2px solid #fbbf24',
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
                                zIndex: 10,
                              }}
                            ></i>
                          </div>
                        </Form.Group>
                      </Col>

                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label style={{ fontWeight: 'bold', color: '#000' }}>
                            <i className="bi bi-key-fill me-2" style={{ color: '#6b7280' }}></i>
                            Confirm Password
                          </Form.Label>
                          <div style={{ position: 'relative' }}>
                            <Form.Control
                              type={showConfirmPassword ? 'text' : 'password'}
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              placeholder="Confirm new password"
                              style={{
                                border: '2px solid #fbbf24',
                                borderRadius: '8px',
                                padding: '12px',
                                paddingRight: '45px',
                              }}
                            />
                            <i
                              className={`bi bi-eye${showConfirmPassword ? '-slash' : ''}-fill`}
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              style={{
                                position: 'absolute',
                                right: '12px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                cursor: 'pointer',
                                color: '#6b7280',
                                fontSize: '1.1rem',
                                zIndex: 10,
                              }}
                            ></i>
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>

                    <div
                      className="p-2 rounded"
                      style={{
                        background: '#fff',
                        border: '1px solid #fbbf24',
                      }}
                    >
                      <small style={{ color: '#92400e', fontWeight: '500' }}>
                        <i className="bi bi-info-circle-fill me-1"></i>
                        Password must be at least 6 characters long
                      </small>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-100 mt-4"
                    disabled={loading}
                    style={{
                      background: loading
                        ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                        : 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '14px',
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      color: '#000',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(251, 191, 36, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Updating Profile...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle-fill me-2"></i>
                        Update Profile
                      </>
                    )}
                  </Button>
                </Form>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>

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

export default Profile;
