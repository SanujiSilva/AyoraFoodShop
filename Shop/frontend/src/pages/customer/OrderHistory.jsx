import React, { useState, useEffect } from 'react';
import { Container, Card, Badge, Spinner, Alert, Row, Col } from 'react-bootstrap';
import axios from '../../utils/axios';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('/orders/history');
      setOrders(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders');
      setLoading(false);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Pending':
        return 'warning';
      case 'Confirm':
        return 'info';
      case 'Delivered':
        return 'success';
      case 'Cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="text-center">
          <Spinner animation="border" style={{ width: '3rem', height: '3rem', color: '#fbbf24' }} />
          <p className="mt-3 text-muted">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <i className="bi bi-exclamation-circle me-2"></i>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fcd34d 100%)',
      minHeight: '100vh', 
      paddingTop: '2rem', 
      paddingBottom: '3rem' 
    }}>
      <Container>
        {/* Header */}
        <div className="mb-4" style={{
          background: 'linear-gradient(135deg, #000 0%, #1f2937 100%)',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '200px',
            height: '200px',
            background: 'rgba(251, 191, 36, 0.1)',
            borderRadius: '50%',
            filter: 'blur(40px)'
          }}></div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="d-flex align-items-center gap-3 mb-2">
              <div style={{
                width: '56px',
                height: '56px',
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(251, 191, 36, 0.4)'
              }}>
                <i className="bi bi-clock-history" style={{ fontSize: '1.8rem', color: '#000' }}></i>
              </div>
              <div>
                <h2 className="fw-bold mb-0" style={{ color: '#fff', fontSize: '2rem' }}>Order History</h2>
                <p className="mb-0" style={{ color: '#d1d5db', fontSize: '0.95rem' }}>
                  View and track all your orders • {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {orders.length === 0 ? (
          <Card style={{ 
            border: 'none', 
            borderRadius: '16px', 
            textAlign: 'center', 
            padding: '4rem 2rem',
            background: '#fff',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <div style={{
              width: '120px',
              height: '120px',
              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              animation: 'float 3s ease-in-out infinite'
            }}>
              <i className="bi bi-basket" style={{ fontSize: '3.5rem', color: '#f59e0b' }}></i>
            </div>
            <h4 className="fw-bold mb-2" style={{ color: '#1f2937' }}>No Orders Yet</h4>
            <p className="text-muted mb-4" style={{ maxWidth: '400px', margin: '0 auto 2rem' }}>
              You haven't placed any orders. Start exploring our delicious menu and place your first order today!
            </p>
            <a href="/daily-foods" className="btn btn-primary" style={{ 
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', 
              border: 'none', 
              color: '#000',
              fontWeight: '600',
              padding: '0.75rem 2.5rem',
              borderRadius: '10px',
              boxShadow: '0 4px 12px rgba(251, 191, 36, 0.3)',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(251, 191, 36, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(251, 191, 36, 0.3)';
            }}>
              <i className="bi bi-arrow-right-circle me-2"></i>
              Browse Menu
            </a>
            <style>
              {`
                @keyframes float {
                  0%, 100% { transform: translateY(0px); }
                  50% { transform: translateY(-10px); }
                }
              `}
            </style>
          </Card>
        ) : (
          <div>
            {orders.map((order, idx) => (
              <Card 
                key={order._id} 
                className="mb-3"
                style={{ 
                  border: 'none', 
                  borderRadius: '16px',
                  background: '#fff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s',
                  animation: `slideIn 0.4s ease-out ${idx * 0.1}s backwards`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Card.Body className="p-4">
                  <Row className="align-items-center">
                    {/* Order Number & Date */}
                    <Col md={3} className="mb-3 mb-md-0">
                      <div className="d-flex align-items-center gap-3">
                        <div style={{
                          width: '52px',
                          height: '52px',
                          background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 8px rgba(251, 191, 36, 0.2)'
                        }}>
                          <i className="bi bi-receipt" style={{ fontSize: '1.5rem', color: '#f59e0b' }}></i>
                        </div>
                        <div>
                          <div className="fw-bold" style={{ fontSize: '1.05rem', color: '#1f2937' }}>
                            #{order.orderNumber}
                          </div>
                          <div className="text-muted small">
                            {new Date(order.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>
                    </Col>

                    {/* Items */}
                    <Col md={4} className="mb-3 mb-md-0">
                      <div className="text-muted small mb-1 fw-semibold" style={{ color: '#6b7280' }}>Items Ordered</div>
                      <div style={{ 
                        maxHeight: '80px', 
                        overflowY: 'auto',
                        paddingRight: '8px'
                      }}>
                        {order.items.slice(0, 3).map((item, index) => (
                          <div key={index} className="small d-flex align-items-center gap-2 mb-1" style={{ color: '#374151' }}>
                            <i className="bi bi-circle-fill" style={{ fontSize: '0.3rem', color: '#fbbf24' }}></i>
                            <span className="fw-medium">{item.foodName}</span>
                            <Badge bg="light" text="dark" style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}>
                              ×{item.qty}
                            </Badge>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="small fw-semibold" style={{ color: '#f59e0b' }}>
                            + {order.items.length - 3} more item{order.items.length > 4 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </Col>

                    {/* Status & Location */}
                    <Col md={3} className="mb-3 mb-md-0">
                      <div className="mb-2">
                        <div className="text-muted small mb-1 fw-semibold" style={{ color: '#6b7280' }}>Status</div>
                        <Badge 
                          bg={getStatusVariant(order.status)}
                          style={{ 
                            fontSize: '0.8rem', 
                            padding: '0.4rem 0.8rem', 
                            fontWeight: '600',
                            borderRadius: '6px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}
                        >
                          <i className={`bi bi-${
                            order.status === 'Delivered' ? 'check-circle' :
                            order.status === 'Confirm' ? 'hourglass-split' :
                            order.status === 'Cancelled' ? 'x-circle' :
                            'clock'
                          } me-1`}></i>
                          {order.status}
                        </Badge>
                      </div>
                      <div className="small d-flex align-items-center gap-1" style={{ color: '#6b7280' }}>
                        <i className="bi bi-geo-alt-fill" style={{ color: '#f59e0b' }}></i>
                        <span className="fw-medium">{order.location}</span>
                      </div>
                    </Col>

                    {/* Total */}
                    <Col md={2} className="text-md-end">
                      <div className="text-muted small mb-1 fw-semibold">Total Amount</div>
                      <div className="fw-bold" style={{ 
                        fontSize: '1.35rem', 
                        background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                      }}>
                        LKR {order.total.toFixed(2)}
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}
            <style>
              {`
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
              `}
            </style>
          </div>
        )}
      </Container>
    </div>
  );
};

export default OrderHistory;
