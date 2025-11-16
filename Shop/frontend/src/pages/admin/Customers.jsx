import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Spinner, Alert, Button, Badge } from 'react-bootstrap';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const { data } = await axios.get('/admin/customers');
      setCustomers(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load customers');
      setLoading(false);
    }
  };

  const handleDelete = async (customerId, customerName) => {
    if (window.confirm(`Are you sure you want to delete customer "${customerName}"? This action cannot be undone.`)) {
      try {
        await axios.delete(`/admin/customers/${customerId}`);
        toast.success('Customer deleted successfully');
        fetchCustomers();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete customer');
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

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  const totalCustomers = customers.length;
  const customersWithPhone = customers.filter(c => c.phone).length;
  const customersWithLocation = customers.filter(c => c.location).length;
  const recentCustomers = customers.filter(c => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return new Date(c.createdAt) >= thirtyDaysAgo;
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
                <i className="bi bi-people-fill me-3"></i>
                All Customers
              </h2>
              <p className="text-white-50 mb-0">Manage your customer database</p>
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
                <h6 className="text-white mb-1">Total Customers</h6>
                <h2 className="mb-0" style={{ color: '#000', fontWeight: 'bold' }}>
                  {totalCustomers}
                </h2>
              </div>
              <i className="bi bi-people-fill" style={{ fontSize: '3rem', color: '#000', opacity: 0.2 }} />
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
                <h6 className="text-white mb-1">New (30 days)</h6>
                <h2 className="mb-0" style={{ color: '#000', fontWeight: 'bold' }}>
                  {recentCustomers}
                </h2>
              </div>
              <i className="bi bi-person-plus-fill" style={{ fontSize: '3rem', color: '#000', opacity: 0.2 }} />
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div
            className="p-4 rounded-3 h-100"
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              border: '2px solid #000',
              animation: 'slideIn 0.4s ease-out',
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-white mb-1">With Phone</h6>
                <h2 className="mb-0" style={{ color: '#000', fontWeight: 'bold' }}>
                  {customersWithPhone}
                </h2>
              </div>
              <i className="bi bi-telephone-fill" style={{ fontSize: '3rem', color: '#000', opacity: 0.2 }} />
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div
            className="p-4 rounded-3 h-100"
            style={{
              background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
              border: '2px solid #000',
              animation: 'slideIn 0.45s ease-out',
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-white mb-1">With Location</h6>
                <h2 className="mb-0" style={{ color: '#000', fontWeight: 'bold' }}>
                  {customersWithLocation}
                </h2>
              </div>
              <i className="bi bi-geo-alt-fill" style={{ fontSize: '3rem', color: '#000', opacity: 0.2 }} />
            </div>
          </div>
        </div>
      </div>

      {/* Customer Cards Grid */}
      {customers.length === 0 ? (
        <div
          className="text-center py-5"
          style={{
            background: '#fef3c7',
            border: '2px dashed #f59e0b',
            borderRadius: '8px',
          }}
        >
          <i className="bi bi-people-fill" style={{ fontSize: '4rem', color: '#f59e0b', opacity: 0.3 }} />
          <h4 className="mt-3" style={{ color: '#92400e' }}>
            No Customers Found
          </h4>
          <p style={{ color: '#92400e' }}>Your customer database is empty. Customers will appear here when they register.</p>
        </div>
      ) : (
        <div className="row">
          {customers.map((customer, index) => {
            const isRecent = (() => {
              const thirtyDaysAgo = new Date();
              thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
              return new Date(customer.createdAt) >= thirtyDaysAgo;
            })();

            return (
              <div
                key={customer._id}
                className="col-md-6 col-lg-4 mb-4"
                style={{
                  animation: `slideIn ${0.3 + index * 0.05}s ease-out`,
                }}
              >
                <div
                  className="h-100 rounded-3"
                  style={{
                    border: '2px solid #fbbf24',
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
                      background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                      borderBottom: '2px solid #fbbf24',
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div className="d-flex align-items-center">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center me-3"
                          style={{
                            width: '50px',
                            height: '50px',
                            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                            color: '#000',
                            fontWeight: 'bold',
                            fontSize: '1.5rem',
                          }}
                        >
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h5 className="mb-0" style={{ fontWeight: 'bold', color: '#000' }}>
                            {customer.name}
                          </h5>
                          {isRecent && (
                            <Badge
                              bg="success"
                              style={{ fontSize: '0.7rem', marginTop: '4px' }}
                            >
                              <i className="bi bi-stars me-1"></i>
                              New
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-3">
                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-envelope-fill me-2" style={{ color: '#3b82f6', fontSize: '1.1rem' }}></i>
                        <span style={{ color: '#374151', fontSize: '0.9rem', wordBreak: 'break-word' }}>
                          {customer.email}
                        </span>
                      </div>
                      
                      <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-telephone-fill me-2" style={{ color: '#22c55e', fontSize: '1.1rem' }}></i>
                        <span style={{ color: '#374151', fontSize: '0.9rem' }}>
                          {customer.phone || (
                            <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>No phone</span>
                          )}
                        </span>
                      </div>
                      
                      <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-geo-alt-fill me-2" style={{ color: '#ec4899', fontSize: '1.1rem' }}></i>
                        <span style={{ color: '#374151', fontSize: '0.9rem' }}>
                          {customer.location || (
                            <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>No location</span>
                          )}
                        </span>
                      </div>
                    </div>

                    <div
                      className="mb-3 p-2 rounded"
                      style={{
                        background: '#f3f4f6',
                        border: '1px solid #d1d5db',
                      }}
                    >
                      <div className="d-flex align-items-center justify-content-center">
                        <i className="bi bi-calendar-check me-2" style={{ color: '#6b7280', fontSize: '1rem' }}></i>
                        <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>
                          Joined: {new Date(customer.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      size="sm"
                      onClick={() => handleDelete(customer._id, customer.name)}
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
                      Delete Customer
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

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

export default Customers;
