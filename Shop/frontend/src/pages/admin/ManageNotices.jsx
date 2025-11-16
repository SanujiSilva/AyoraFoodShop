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

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Notices</h2>
        <Button variant="primary" onClick={() => handleShowModal()}>
          <i className="bi bi-plus-circle me-2"></i>
          Add New Notice
        </Button>
      </div>

      <Alert variant="info">
        <i className="bi bi-info-circle me-2"></i>
        Create important announcements that will be displayed prominently on the home page for all customers.
      </Alert>

      {notices.length === 0 ? (
        <Alert variant="warning">No notices found. Add your first notice to display announcements to customers!</Alert>
      ) : (
        <Card>
          <Card.Body>
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Message</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {notices.map((notice) => (
                  <tr key={notice._id}>
                    <td>
                      <strong>{notice.title}</strong>
                    </td>
                    <td>
                      <div className="text-truncate" style={{ maxWidth: '300px' }}>
                        {notice.message}
                      </div>
                    </td>
                    <td>
                      <Badge bg={getTypeBadge(notice.type)}>
                        {notice.type.toUpperCase()}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={notice.isActive ? 'success' : 'secondary'}>
                        {notice.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td>{new Date(notice.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleShowModal(notice)}
                      >
                        <i className="bi bi-pencil"></i> Edit
                      </Button>
                      <Button
                        variant={notice.isActive ? 'outline-warning' : 'outline-success'}
                        size="sm"
                        className="me-2"
                        onClick={() => toggleActive(notice)}
                      >
                        <i className={`bi bi-${notice.isActive ? 'pause' : 'play'}-circle`}></i>{' '}
                        {notice.isActive ? 'Hide' : 'Show'}
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(notice._id, notice.title)}
                      >
                        <i className="bi bi-trash"></i> Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Add/Edit Notice Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Edit Notice' : 'Add New Notice'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Title *</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Special Offer Today!"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Message *</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Enter your announcement message..."
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Notice Type *</Form.Label>
              <Form.Select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="info">Info (Blue)</option>
                <option value="success">Success (Green)</option>
                <option value="warning">Warning (Yellow)</option>
                <option value="danger">Urgent (Red)</option>
              </Form.Select>
              <Form.Text className="text-muted">
                Choose the type that best matches your announcement's urgency or purpose.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                name="isActive"
                label="Active (visible to customers on home page)"
                checked={formData.isActive}
                onChange={handleChange}
              />
            </Form.Group>

            {/* Preview */}
            <div className="mt-4">
              <Form.Label>Preview:</Form.Label>
              <Alert variant={formData.type}>
                <Alert.Heading className="h5">
                  <i className="bi bi-megaphone me-2"></i>
                  {formData.title || 'Notice Title'}
                </Alert.Heading>
                <p className="mb-0">{formData.message || 'Your message will appear here...'}</p>
              </Alert>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editMode ? 'Update Notice' : 'Create Notice'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default ManageNotices;
