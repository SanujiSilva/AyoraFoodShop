import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Modal, Form, Alert, Spinner, Badge } from 'react-bootstrap';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';

const ManageNotices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentNotice, setCurrentNotice] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info',
    isActive: true,
  });

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const { data } = await axios.get('/admin/notices');
      setNotices(data);
      setLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load notices');
      setLoading(false);
    }
  };

  const handleShowModal = (notice = null) => {
    if (notice) {
      setEditMode(true);
      setCurrentNotice(notice);
      setFormData({
        title: notice.title,
        message: notice.message,
        type: notice.type,
        isActive: notice.isActive,
      });
    } else {
      setEditMode(false);
      setCurrentNotice(null);
      setFormData({ title: '', message: '', type: 'info', isActive: true });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditMode(false);
    setCurrentNotice(null);
    setFormData({ title: '', message: '', type: 'info', isActive: true });
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

    if (!formData.title.trim() || !formData.message.trim()) {
      toast.error('Title and message are required');
      return;
    }

    try {
      if (editMode) {
        await axios.put(`/admin/notices/${currentNotice._id}`, formData);
        toast.success('Notice updated successfully!');
      } else {
        await axios.post('/admin/notices', formData);
        toast.success('Notice created successfully!');
      }
      handleCloseModal();
      fetchNotices();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save notice');
    }
  };

  const handleDelete = async (noticeId, noticeTitle) => {
    if (window.confirm(`Are you sure you want to delete notice "${noticeTitle}"?`)) {
      try {
        await axios.delete(`/admin/notices/${noticeId}`);
        toast.success('Notice deleted successfully!');
        fetchNotices();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete notice');
      }
    }
  };

  const toggleActive = async (notice) => {
    try {
      await axios.put(`/admin/notices/${notice._id}`, {
        ...notice,
        isActive: !notice.isActive,
      });
      toast.success(`Notice ${!notice.isActive ? 'activated' : 'deactivated'}!`);
      fetchNotices();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update notice');
    }
  };

  const getTypeBadge = (type) => {
    const types = {
      info: 'info',
      warning: 'warning',
      success: 'success',
      danger: 'danger',
    };
    return types[type] || 'secondary';
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  const totalNotices = notices.length;
  const activeNotices = notices.filter(n => n.isActive).length;
  const inactiveNotices = notices.filter(n => !n.isActive).length;
  const noticeTypes = {
    info: notices.filter(n => n.type === 'info').length,
    warning: notices.filter(n => n.type === 'warning').length,
    success: notices.filter(n => n.type === 'success').length,
    danger: notices.filter(n => n.type === 'danger').length,
  };

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
                <i className="bi bi-megaphone-fill me-3"></i>
                Manage Notices
              </h2>
              <p className="text-white-50 mb-0">Create and manage customer announcements</p>
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
              Add New Notice
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
          className="bi bi-bell-fill"
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
                <h6 className="text-white mb-1">Total Notices</h6>
                <h2 className="mb-0" style={{ color: '#000', fontWeight: 'bold' }}>
                  {totalNotices}
                </h2>
              </div>
              <i className="bi bi-megaphone-fill" style={{ fontSize: '3rem', color: '#000', opacity: 0.2 }} />
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
                <h6 className="text-white mb-1">Active</h6>
                <h2 className="mb-0" style={{ color: '#000', fontWeight: 'bold' }}>
                  {activeNotices}
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
                <h6 className="text-white mb-1">Inactive</h6>
                <h2 className="mb-0" style={{ color: '#000', fontWeight: 'bold' }}>
                  {inactiveNotices}
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
                <h6 className="text-white mb-1">Urgent</h6>
                <h2 className="mb-0" style={{ color: '#000', fontWeight: 'bold' }}>
                  {noticeTypes.danger}
                </h2>
              </div>
              <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: '3rem', color: '#000', opacity: 0.2 }} />
            </div>
          </div>
        </div>
      </div>

      {/* Info Alert */}
      <div
        className="mb-4 p-3 rounded-3"
        style={{
          background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
          border: '2px solid #3b82f6',
        }}
      >
        <i className="bi bi-info-circle-fill me-2" style={{ color: '#1e40af' }}></i>
        <span style={{ color: '#1e3a8a', fontWeight: '500' }}>
          Create important announcements that will be displayed prominently on the home page for all customers.
        </span>
      </div>

      {/* Notice Cards Grid */}
      {notices.length === 0 ? (
        <div
          className="text-center py-5"
          style={{
            background: '#fef3c7',
            border: '2px dashed #f59e0b',
            borderRadius: '8px',
          }}
        >
          <i className="bi bi-megaphone-fill" style={{ fontSize: '4rem', color: '#f59e0b', opacity: 0.3 }} />
          <h4 className="mt-3" style={{ color: '#92400e' }}>
            No Notices Found
          </h4>
          <p style={{ color: '#92400e' }}>Add your first notice to display announcements to customers!</p>
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
            Add First Notice
          </Button>
        </div>
      ) : (
        <div className="row">
          {notices.map((notice, index) => {
            const typeColors = {
              info: { bg: '#dbeafe', border: '#3b82f6', text: '#1e3a8a' },
              success: { bg: '#dcfce7', border: '#22c55e', text: '#166534' },
              warning: { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' },
              danger: { bg: '#fee2e2', border: '#ef4444', text: '#991b1b' },
            };
            const colors = typeColors[notice.type] || typeColors.info;

            return (
              <div
                key={notice._id}
                className="col-md-6 col-lg-4 mb-4"
                style={{
                  animation: `slideIn ${0.3 + index * 0.05}s ease-out`,
                }}
              >
                <div
                  className="h-100 rounded-3"
                  style={{
                    border: notice.isActive ? `2px solid ${colors.border}` : '2px solid #6b7280',
                    background: '#fff',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
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
                      background: notice.isActive
                        ? `linear-gradient(135deg, ${colors.bg} 0%, ${colors.bg} 100%)`
                        : 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                      borderBottom: `2px solid ${notice.isActive ? colors.border : '#6b7280'}`,
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <Badge
                        bg={getTypeBadge(notice.type)}
                        style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                      >
                        <i className="bi bi-tag-fill me-1"></i>
                        {notice.type.toUpperCase()}
                      </Badge>
                      <Badge
                        bg={notice.isActive ? 'success' : 'secondary'}
                        style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                      >
                        <i className={`bi bi-${notice.isActive ? 'eye-fill' : 'eye-slash-fill'} me-1`}></i>
                        {notice.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <h5
                      className="mb-2"
                      style={{
                        fontWeight: 'bold',
                        color: notice.isActive ? colors.text : '#374151',
                      }}
                    >
                      <i className="bi bi-megaphone-fill me-2"></i>
                      {notice.title}
                    </h5>
                  </div>

                  {/* Card Body */}
                  <div className="p-3">
                    <p
                      style={{
                        color: '#6b7280',
                        fontSize: '0.9rem',
                        minHeight: '80px',
                        display: '-webkit-box',
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {notice.message}
                    </p>

                    <div className="mb-3 d-flex align-items-center" style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                      <i className="bi bi-calendar3 me-2"></i>
                      Created: {new Date(notice.createdAt).toLocaleDateString()}
                    </div>

                    {/* Action Buttons */}
                    <div className="d-flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleShowModal(notice)}
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
                        onClick={() => toggleActive(notice)}
                        style={{
                          flex: 1,
                          background: notice.isActive
                            ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                            : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                          border: 'none',
                          fontWeight: 'bold',
                          padding: '8px',
                          borderRadius: '6px',
                        }}
                      >
                        <i className={`bi bi-${notice.isActive ? 'eye-slash' : 'eye'} me-1`}></i>
                        {notice.isActive ? 'Hide' : 'Show'}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleDelete(notice._id, notice.title)}
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
            );
          })}
        </div>
      )}

      {/* Add/Edit Notice Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
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
              <i className="bi bi-megaphone-fill me-2"></i>
              {editMode ? 'Edit Notice' : 'Add New Notice'}
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body style={{ background: '#fefce8' }}>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: 'bold', color: '#000' }}>
                  <i className="bi bi-card-heading me-2" style={{ color: '#f59e0b' }}></i>
                  Title *
                </Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Special Offer Today!"
                  required
                  style={{
                    border: '2px solid #fbbf24',
                    borderRadius: '8px',
                    padding: '12px',
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: 'bold', color: '#000' }}>
                  <i className="bi bi-chat-left-text me-2" style={{ color: '#3b82f6' }}></i>
                  Message *
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Enter your announcement message..."
                  required
                  style={{
                    border: '2px solid #fbbf24',
                    borderRadius: '8px',
                    padding: '12px',
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: 'bold', color: '#000' }}>
                  <i className="bi bi-palette me-2" style={{ color: '#ec4899' }}></i>
                  Notice Type *
                </Form.Label>
                <Form.Select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  style={{
                    border: '2px solid #fbbf24',
                    borderRadius: '8px',
                    padding: '12px',
                  }}
                >
                  <option value="info">💙 Info (Blue) - General information</option>
                  <option value="success">💚 Success (Green) - Good news</option>
                  <option value="warning">💛 Warning (Yellow) - Important alerts</option>
                  <option value="danger">❤️ Urgent (Red) - Critical announcements</option>
                </Form.Select>
                <Form.Text style={{ color: '#92400e', fontWeight: '500' }}>
                  Choose the type that best matches your announcement's urgency or purpose.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-4">
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
                          className={`bi bi-${formData.isActive ? 'eye-fill' : 'eye-slash-fill'} me-2`}
                          style={{ color: formData.isActive ? '#22c55e' : '#6b7280' }}
                        ></i>
                        Active (visible to customers on home page)
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
                <Form.Label style={{ fontWeight: 'bold', color: '#000', marginBottom: '12px' }}>
                  <i className="bi bi-eye me-2" style={{ color: '#6b7280' }}></i>
                  Live Preview:
                </Form.Label>
                <Alert variant={formData.type} className="mb-0">
                  <Alert.Heading className="h5">
                    <i className="bi bi-megaphone me-2"></i>
                    {formData.title || 'Notice Title'}
                  </Alert.Heading>
                  <p className="mb-0">{formData.message || 'Your message will appear here...'}</p>
                </Alert>
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
                {editMode ? 'Update Notice' : 'Create Notice'}
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

export default ManageNotices;
