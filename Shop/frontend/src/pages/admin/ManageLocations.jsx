import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Modal, Form, Alert, Spinner, Badge } from 'react-bootstrap';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';

const ManageLocations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    isActive: true,
  });

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const { data } = await axios.get('/admin/locations');
      setLocations(data);
      setLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load locations');
      setLoading(false);
    }
  };

  const handleShowModal = (location = null) => {
    if (location) {
      setEditMode(true);
      setCurrentLocation(location);
      setFormData({
        name: location.name,
        isActive: location.isActive,
      });
    } else {
      setEditMode(false);
      setCurrentLocation(null);
      setFormData({ name: '', isActive: true });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditMode(false);
    setCurrentLocation(null);
    setFormData({ name: '', isActive: true });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Location name is required');
      return;
    }

    try {
      if (editMode) {
        await axios.put(`/admin/locations/${currentLocation._id}`, formData);
        toast.success('Location updated successfully!');
      } else {
        await axios.post('/admin/locations', formData);
        toast.success('Location created successfully!');
      }
      handleCloseModal();
      fetchLocations();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save location');
    }
  };

  const handleDelete = async (locationId, locationName) => {
    if (window.confirm(`Are you sure you want to delete location "${locationName}"?`)) {
      try {
        await axios.delete(`/admin/locations/${locationId}`);
        toast.success('Location deleted successfully!');
        fetchLocations();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete location');
      }
    }
  };

  const toggleActive = async (location) => {
    try {
      await axios.put(`/admin/locations/${location._id}`, {
        ...location,
        isActive: !location.isActive,
      });
      toast.success(`Location ${!location.isActive ? 'activated' : 'deactivated'}!`);
      fetchLocations();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update location');
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  const totalLocations = locations.length;
  const activeLocations = locations.filter(loc => loc.isActive).length;
  const inactiveLocations = locations.filter(loc => !loc.isActive).length;

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
                <i className="bi bi-geo-alt-fill me-3"></i>
                Manage Locations
              </h2>
              <p className="text-white-50 mb-0">Control delivery zones and service areas</p>
            </div>
            <Button
              onClick={() => handleShowModal()}
              style={{
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                border: 'none',
                padding: '12px 24px',
                fontWeight: 'bold',
                borderRadius: '8px',
              }}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Add New Location
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
          className="bi bi-map"
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
        <div className="col-md-4 mb-3">
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
                <h6 className="text-white mb-1">Total Locations</h6>
                <h2 className="mb-0" style={{ color: '#000', fontWeight: 'bold' }}>
                  {totalLocations}
                </h2>
              </div>
              <i className="bi bi-geo-alt-fill" style={{ fontSize: '3rem', color: '#000', opacity: 0.2 }} />
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
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
                <h6 className="text-white mb-1">Active Locations</h6>
                <h2 className="mb-0" style={{ color: '#000', fontWeight: 'bold' }}>
                  {activeLocations}
                </h2>
              </div>
              <i className="bi bi-check-circle-fill" style={{ fontSize: '3rem', color: '#000', opacity: 0.2 }} />
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
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
                <h6 className="text-white mb-1">Inactive Locations</h6>
                <h2 className="mb-0" style={{ color: '#000', fontWeight: 'bold' }}>
                  {inactiveLocations}
                </h2>
              </div>
              <i className="bi bi-x-circle-fill" style={{ fontSize: '3rem', color: '#000', opacity: 0.2 }} />
            </div>
          </div>
        </div>
      </div>

      {/* Info Alert */}
      <Alert
        style={{
          background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
          border: '2px solid #3b82f6',
          borderRadius: '8px',
        }}
      >
        <i className="bi bi-info-circle-fill me-2" style={{ color: '#3b82f6' }}></i>
        <strong>Delivery Zones:</strong> Manage delivery locations. Customers can choose from active locations or enter a custom address when placing orders.
      </Alert>

      {/* Location Cards Grid */}
      {locations.length === 0 ? (
        <div
          className="text-center py-5"
          style={{
            background: '#fef3c7',
            border: '2px dashed #f59e0b',
            borderRadius: '8px',
          }}
        >
          <i className="bi bi-geo-alt" style={{ fontSize: '4rem', color: '#f59e0b', opacity: 0.3 }} />
          <h4 className="mt-3" style={{ color: '#92400e' }}>
            No Locations Found
          </h4>
          <p style={{ color: '#92400e' }}>Add your first delivery location to get started!</p>
          <Button
            onClick={() => handleShowModal()}
            style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              border: 'none',
              padding: '10px 24px',
              fontWeight: 'bold',
              borderRadius: '8px',
            }}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Add First Location
          </Button>
        </div>
      ) : (
        <div className="row">
          {locations.map((location, index) => (
            <div
              key={location._id}
              className="col-md-6 col-lg-4 mb-4"
              style={{
                animation: `slideIn ${0.3 + index * 0.05}s ease-out`,
              }}
            >
              <div
                className="h-100 rounded-3"
                style={{
                  border: location.isActive ? '2px solid #22c55e' : '2px solid #6b7280',
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
                {/* Card Header */}
                <div
                  className="p-3"
                  style={{
                    background: location.isActive
                      ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
                      : 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 text-white d-flex align-items-center">
                      <i className="bi bi-geo-alt-fill me-2"></i>
                      {location.name}
                    </h5>
                    <Badge
                      bg={location.isActive ? 'light' : 'dark'}
                      className="d-flex align-items-center"
                      style={{ padding: '6px 12px' }}
                    >
                      <i
                        className={`bi bi-${location.isActive ? 'check-circle-fill' : 'x-circle-fill'} me-1`}
                        style={{ color: location.isActive ? '#22c55e' : '#ef4444' }}
                      ></i>
                      <span style={{ color: location.isActive ? '#22c55e' : '#ef4444', fontWeight: 'bold' }}>
                        {location.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </Badge>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-3">
                  {/* Location Info */}
                  <div className="mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-calendar3 me-2" style={{ color: '#6b7280' }}></i>
                      <small style={{ color: '#6b7280' }}>
                        Created: {new Date(location.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                    <div className="d-flex align-items-center">
                      <i className="bi bi-clock-history me-2" style={{ color: '#6b7280' }}></i>
                      <small style={{ color: '#6b7280' }}>
                        Last Updated: {new Date(location.updatedAt || location.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="d-flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleShowModal(location)}
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
                      onClick={() => toggleActive(location)}
                      style={{
                        flex: 1,
                        background: location.isActive
                          ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                          : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                        border: 'none',
                        fontWeight: 'bold',
                        padding: '8px',
                        borderRadius: '6px',
                      }}
                    >
                      <i className={`bi bi-${location.isActive ? 'pause-circle' : 'play-circle'} me-1`}></i>
                      {location.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleDelete(location._id, location.name)}
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

      {/* Add/Edit Location Modal */}
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
              <i className="bi bi-geo-alt-fill me-2"></i>
              {editMode ? 'Edit Location' : 'Add New Location'}
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body style={{ background: '#fefce8' }}>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: 'bold', color: '#000' }}>
                  <i className="bi bi-geo-alt me-2" style={{ color: '#f59e0b' }}></i>
                  Location Name *
                </Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Colombo, Kandy, Galle"
                  required
                  style={{
                    border: '2px solid #fbbf24',
                    borderRadius: '8px',
                    padding: '12px',
                  }}
                />
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
                        Active (visible to customers)
                      </span>
                    }
                    checked={formData.isActive}
                    onChange={handleChange}
                  />
                </div>
              </Form.Group>

              {/* Preview Section */}
              <div
                className="p-3 rounded-3"
                style={{
                  background: '#fff',
                  border: '2px solid #fbbf24',
                }}
              >
                <h6 style={{ color: '#92400e', marginBottom: '10px' }}>
                  <i className="bi bi-eye me-2"></i>
                  Preview:
                </h6>
                <div
                  className="p-2 rounded"
                  style={{
                    background: formData.isActive ? '#dcfce7' : '#f3f4f6',
                    border: formData.isActive ? '1px solid #22c55e' : '1px solid #d1d5db',
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <span style={{ fontWeight: 'bold', color: '#000' }}>
                      <i className="bi bi-geo-alt-fill me-2" style={{ color: '#f59e0b' }}></i>
                      {formData.name || 'Location name will appear here'}
                    </span>
                    <Badge bg={formData.isActive ? 'success' : 'secondary'}>
                      {formData.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
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
                <i className={`bi bi-${editMode ? 'check-circle' : 'plus-circle'} me-2`}></i>
                {editMode ? 'Update Location' : 'Add Location'}
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

export default ManageLocations;
