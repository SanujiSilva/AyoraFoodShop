import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Table, Spinner } from 'react-bootstrap';
import axios from '../../utils/axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    dailyIncome: 0,
    orderCount: 0,
    ordersByLocation: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [incomeRes, locationRes] = await Promise.all([
        axios.get('/admin/daily-income'),
        axios.get('/admin/orders-by-location'),
      ]);

      setStats({
        dailyIncome: incomeRes.data.totalIncome,
        orderCount: incomeRes.data.orderCount,
        ordersByLocation: locationRes.data,
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #fefce8 0%, #ffffff 100%)'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #000000 0%, #1f2937 50%, #fbbf24 100%)',
        padding: '3rem 0',
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 50%, rgba(251, 191, 36, 0.2) 0%, transparent 70%)',
          animation: 'pulseGlow 4s ease-in-out infinite'
        }}></div>
        <Container style={{ position: 'relative', zIndex: 1 }}>
          <div className="text-center text-white">
            <div className="icon-box mx-auto mb-3" style={{ 
              width: '80px', 
              height: '80px',
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              border: '4px solid #000000'
            }}>
              <i className="bi bi-speedometer2" style={{ fontSize: '2.5rem', color: '#000000' }}></i>
            </div>
            <h1 className="fw-bold mb-2" style={{
              textShadow: '0 0 30px rgba(251, 191, 36, 0.6), 2px 2px 4px rgba(0,0,0,0.8)'
            }}>Admin Dashboard</h1>
            <p className="text-white-50">Manage your food delivery business</p>
          </div>
        </Container>
      </div>

      <Container className="pb-5">
        {/* Stats Cards */}
        <Row className="g-4 mb-4">
          <Col md={4}>
            <Card className="modern-card text-center shadow-lg animate-fade-in" style={{ 
              border: '3px solid #10b981',
              animationDelay: '0.1s'
            }}>
              <Card.Body className="p-4">
                <div className="icon-box mx-auto mb-3" style={{ 
                  width: '70px', 
                  height: '70px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  border: '3px solid #000000'
                }}>
                  <i className="bi bi-currency-dollar" style={{ fontSize: '2rem', color: '#000000' }}></i>
                </div>
                <h3 className="mt-3 fw-bold" style={{ 
                  background: 'linear-gradient(90deg, #10b981, #059669)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>LKR {stats.dailyIncome.toFixed(2)}</h3>
                <p className="text-muted mb-0 fw-semibold">Today's Income</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="modern-card text-center shadow-lg animate-fade-in" style={{ 
              border: '3px solid #fbbf24',
              animationDelay: '0.2s'
            }}>
              <Card.Body className="p-4">
                <div className="icon-box mx-auto mb-3" style={{ 
                  width: '70px', 
                  height: '70px',
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  border: '3px solid #000000'
                }}>
                  <i className="bi bi-basket" style={{ fontSize: '2rem', color: '#000000' }}></i>
                </div>
                <h3 className="mt-3 fw-bold" style={{ 
                  background: 'linear-gradient(90deg, #fbbf24, #f59e0b)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>{stats.orderCount}</h3>
                <p className="text-muted mb-0 fw-semibold">Orders Today</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="modern-card text-center shadow-lg animate-fade-in" style={{ 
              border: '3px solid #3b82f6',
              animationDelay: '0.3s'
            }}>
              <Card.Body className="p-4">
                <div className="icon-box mx-auto mb-3" style={{ 
                  width: '70px', 
                  height: '70px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  border: '3px solid #000000'
                }}>
                  <i className="bi bi-geo-alt" style={{ fontSize: '2rem', color: '#ffffff' }}></i>
                </div>
                <h3 className="mt-3 fw-bold" style={{ 
                  background: 'linear-gradient(90deg, #3b82f6, #2563eb)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>{stats.ordersByLocation.length}</h3>
                <p className="text-muted mb-0 fw-semibold">Active Locations</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Food Management Section */}
        <h4 className="mb-3 mt-4 fw-bold" style={{ color: '#1f2937' }}>
          <i className="bi bi-egg-fried me-2" style={{ color: '#fbbf24' }}></i>
          Food Management
        </h4>
        <Row className="g-4 mb-4">
          <Col md={4}>
            <Link to="/admin/master-foods" className="text-decoration-none">
              <Card className="modern-card text-center h-100 shadow-lg" style={{ border: '3px solid #10b981' }}>
                <Card.Body className="p-4">
                  <div className="icon-box mx-auto mb-3" style={{ 
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: '3px solid #000000'
                  }}>
                    <i className="bi bi-book" style={{ fontSize: '2rem', color: '#ffffff' }}></i>
                  </div>
                  <h5 className="mt-3 mb-2 fw-bold">Master Food Catalog</h5>
                  <p className="text-muted small mb-0">
                    Manage your complete food menu and categories
                  </p>
                </Card.Body>
              </Card>
            </Link>
          </Col>
          <Col md={4}>
            <Link to="/admin/foods/add" className="text-decoration-none">
              <Card className="modern-card text-center h-100 shadow-lg" style={{ border: '3px solid #fbbf24' }}>
                <Card.Body className="p-4">
                  <div className="icon-box mx-auto mb-3" style={{ 
                    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                    border: '3px solid #000000'
                  }}>
                    <i className="bi bi-calendar-plus" style={{ fontSize: '2rem', color: '#000000' }}></i>
                  </div>
                  <h5 className="mt-3 mb-2 fw-bold">Add Daily Menu</h5>
                  <p className="text-muted small mb-0">
                    Select foods from catalog for today's menu
                  </p>
                </Card.Body>
              </Card>
            </Link>
          </Col>
          <Col md={4}>
            <Link to="/admin/foods" className="text-decoration-none">
              <Card className="modern-card text-center h-100 shadow-lg" style={{ border: '3px solid #3b82f6' }}>
                <Card.Body className="p-4">
                  <div className="icon-box mx-auto mb-3" style={{ 
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    border: '3px solid #000000'
                  }}>
                    <i className="bi bi-list-check" style={{ fontSize: '2rem', color: '#ffffff' }}></i>
                  </div>
                  <h5 className="mt-3 mb-2 fw-bold">Manage Daily Foods</h5>
                  <p className="text-muted small mb-0">
                    View and edit today's available food items
                  </p>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        </Row>

        {/* Quick Actions */}
        <h4 className="mb-3 mt-4 fw-bold" style={{ color: '#1f2937' }}>
          <i className="bi bi-lightning-charge me-2" style={{ color: '#fbbf24' }}></i>
          Quick Actions
        </h4>
        <Row className="g-4 mb-4">
          <Col md={4}>
            <Link to="/admin/orders" className="text-decoration-none">
              <Card className="modern-card text-center h-100 shadow-lg animate-fade-in" style={{ 
                border: '3px solid #ef4444',
                animationDelay: '0.4s'
              }}>
                <Card.Body className="p-4">
                  <div className="icon-box mx-auto mb-3" style={{ 
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    border: '3px solid #000000'
                  }}>
                    <i className="bi bi-receipt" style={{ fontSize: '2rem', color: '#ffffff' }}></i>
                  </div>
                  <h5 className="mt-3 mb-2 fw-bold">View Orders</h5>
                  <p className="text-muted small mb-0">
                    Track and manage all customer orders
                  </p>
                </Card.Body>
              </Card>
            </Link>
          </Col>
          <Col md={4}>
            <Link to="/admin/orders/add" className="text-decoration-none">
              <Card className="modern-card text-center h-100 shadow-lg animate-fade-in" style={{ 
                border: '3px solid #8b5cf6',
                animationDelay: '0.5s'
              }}>
                <Card.Body className="p-4">
                  <div className="icon-box mx-auto mb-3" style={{ 
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    border: '3px solid #000000'
                  }}>
                    <i className="bi bi-plus-square" style={{ fontSize: '2rem', color: '#ffffff' }}></i>
                  </div>
                  <h5 className="mt-3 mb-2 fw-bold">Add Order Manually</h5>
                  <p className="text-muted small mb-0">
                    Create orders for walk-in customers
                  </p>
                </Card.Body>
              </Card>
            </Link>
          </Col>
          <Col md={4}>
            <Link to="/admin/notices" className="text-decoration-none">
              <Card className="modern-card text-center h-100 shadow-lg animate-fade-in" style={{ 
                border: '3px solid #06b6d4',
                animationDelay: '0.6s'
              }}>
                <Card.Body className="p-4">
                  <div className="icon-box mx-auto mb-3" style={{ 
                    background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                    border: '3px solid #000000'
                  }}>
                    <i className="bi bi-megaphone" style={{ fontSize: '2rem', color: '#ffffff' }}></i>
                  </div>
                  <h5 className="mt-3 mb-2 fw-bold">Manage Notices</h5>
                  <p className="text-muted small mb-0">
                    Post announcements for customers
                  </p>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        </Row>

        {/* System Management */}
        <h4 className="mb-3 mt-4 fw-bold" style={{ color: '#1f2937' }}>
          <i className="bi bi-gear me-2" style={{ color: '#fbbf24' }}></i>
          System Management
        </h4>
        <Row className="g-4 mb-4">
          <Col md={4}>
            <Link to="/admin/customers" className="text-decoration-none">
              <Card className="modern-card text-center h-100 shadow-lg animate-fade-in" style={{ 
                border: '3px solid #f59e0b',
                animationDelay: '0.7s'
              }}>
                <Card.Body className="p-4">
                  <div className="icon-box mx-auto mb-3" style={{ 
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    border: '3px solid #000000'
                  }}>
                    <i className="bi bi-people" style={{ fontSize: '2rem', color: '#ffffff' }}></i>
                  </div>
                  <h5 className="mt-3 mb-2 fw-bold">Customers</h5>
                  <p className="text-muted small mb-0">
                    View and manage customer accounts
                  </p>
                </Card.Body>
              </Card>
            </Link>
          </Col>
          <Col md={4}>
            <Link to="/admin/locations" className="text-decoration-none">
              <Card className="modern-card text-center h-100 shadow-lg animate-fade-in" style={{ 
                border: '3px solid #14b8a6',
                animationDelay: '0.8s'
              }}>
                <Card.Body className="p-4">
                  <div className="icon-box mx-auto mb-3" style={{ 
                    background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                    border: '3px solid #000000'
                  }}>
                    <i className="bi bi-geo-alt" style={{ fontSize: '2rem', color: '#ffffff' }}></i>
                  </div>
                  <h5 className="mt-3 mb-2 fw-bold">Manage Locations</h5>
                  <p className="text-muted small mb-0">
                    Add and configure delivery areas
                  </p>
                </Card.Body>
              </Card>
            </Link>
          </Col>
          <Col md={4}>
            <Link to="/admin/admins" className="text-decoration-none">
              <Card className="modern-card text-center h-100 shadow-lg animate-fade-in" style={{ 
                border: '3px solid #ec4899',
                animationDelay: '0.9s'
              }}>
                <Card.Body className="p-4">
                  <div className="icon-box mx-auto mb-3" style={{ 
                    background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                    border: '3px solid #000000'
                  }}>
                    <i className="bi bi-shield-lock" style={{ fontSize: '2rem', color: '#ffffff' }}></i>
                  </div>
                  <h5 className="mt-3 mb-2 fw-bold">Manage Admins</h5>
                  <p className="text-muted small mb-0">
                    Control admin access and permissions
                  </p>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        </Row>

        {/* Orders by Location */}
        <Card className="modern-card shadow-lg animate-fade-in" style={{ 
          border: '3px solid #1f2937',
          animationDelay: '1s'
        }}>
          <Card.Body className="p-4">
            <div className="d-flex align-items-center mb-4">
              <div className="icon-box me-3" style={{ 
                width: '50px', 
                height: '50px',
                background: 'linear-gradient(135deg, #1f2937 0%, #000000 100%)',
                border: '3px solid #fbbf24'
              }}>
                <i className="bi bi-map" style={{ fontSize: '1.5rem', color: '#fbbf24' }}></i>
              </div>
              <h5 className="mb-0 fw-bold" style={{ color: '#1f2937' }}>
                Orders by Location
              </h5>
            </div>
            {stats.ordersByLocation.length === 0 ? (
              <div className="text-center py-5">
                <div className="icon-box mx-auto mb-3" style={{ 
                  width: '80px', 
                  height: '80px',
                  background: '#f3f4f6',
                  border: '3px solid #e5e7eb'
                }}>
                  <i className="bi bi-inbox" style={{ fontSize: '2rem', color: '#9ca3af' }}></i>
                </div>
                <p className="text-muted mb-0">No orders yet today</p>
              </div>
            ) : (
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead style={{ background: '#f9fafb' }}>
                    <tr>
                      <th style={{ color: '#1f2937', fontWeight: '700', borderBottom: '2px solid #fbbf24' }}>
                        <i className="bi bi-geo-alt me-2" style={{ color: '#fbbf24' }}></i>
                        Location
                      </th>
                      <th style={{ color: '#1f2937', fontWeight: '700', borderBottom: '2px solid #fbbf24' }}>
                        <i className="bi bi-basket me-2" style={{ color: '#fbbf24' }}></i>
                        Order Count
                      </th>
                      <th style={{ color: '#1f2937', fontWeight: '700', borderBottom: '2px solid #fbbf24' }}>
                        <i className="bi bi-currency-dollar me-2" style={{ color: '#fbbf24' }}></i>
                        Total Revenue
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.ordersByLocation.map((loc, index) => (
                      <tr key={index} style={{ 
                        background: index % 2 === 0 ? '#ffffff' : '#fefce8',
                        transition: 'all 0.3s'
                      }}>
                        <td className="fw-semibold" style={{ color: '#1f2937' }}>
                          <i className="bi bi-pin-map-fill me-2" style={{ color: '#f59e0b' }}></i>
                          {loc._id}
                        </td>
                        <td>
                          <span className="badge" style={{
                            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                            color: '#000',
                            fontWeight: '700',
                            padding: '0.4rem 0.8rem',
                            fontSize: '0.85rem'
                          }}>
                            {loc.count} {loc.count === 1 ? 'order' : 'orders'}
                          </span>
                        </td>
                        <td className="fw-bold" style={{ 
                          color: '#10b981',
                          fontSize: '1.05rem'
                        }}>
                          LKR {loc.totalRevenue.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot style={{ background: '#1f2937' }}>
                    <tr>
                      <td colSpan="2" className="text-white fw-bold" style={{ padding: '1rem' }}>
                        <i className="bi bi-calculator me-2" style={{ color: '#fbbf24' }}></i>
                        TOTAL
                      </td>
                      <td className="fw-bold" style={{ 
                        color: '#fbbf24',
                        fontSize: '1.2rem',
                        padding: '1rem'
                      }}>
                        LKR {stats.ordersByLocation.reduce((sum, loc) => sum + loc.totalRevenue, 0).toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>
    </Container>
    </div>
  );
};

export default AdminDashboard;
