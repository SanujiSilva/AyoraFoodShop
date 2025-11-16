import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Badge, NavDropdown, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const NavigationBar = () => {
  const { user, logout, isAdmin, isCustomer } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setExpanded(false);
  };

  const handleNavClick = () => {
    setExpanded(false);
  };

  return (
    <Navbar 
      expanded={expanded}
      onToggle={setExpanded}
      expand="lg" 
      sticky="top"
      style={{
        background: 'rgba(0, 0, 0, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '3px solid #fbbf24',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
        padding: '0.75rem 0'
      }}
      variant="dark"
    >
      <Container>
        <Navbar.Brand as={Link} to="/" onClick={handleNavClick} style={{
          fontSize: '1.5rem',
          fontWeight: '800',
          background: 'linear-gradient(90deg, #fbbf24, #f59e0b)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <div style={{
            width: '45px',
            height: '45px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(251, 191, 36, 0.4)'
          }}>
            <i className="bi bi-shop" style={{ color: '#000', fontSize: '1.5rem' }}></i>
          </div>
          <span>Ayora Foods</span>
        </Navbar.Brand>
        
        <Navbar.Toggle 
          aria-controls="basic-navbar-nav"
          style={{
            borderColor: '#fbbf24',
            padding: '0.5rem 0.75rem'
          }}
        >
          <span style={{ color: '#fbbf24' }}>
            <i className="bi bi-list" style={{ fontSize: '1.5rem' }}></i>
          </span>
        </Navbar.Toggle>

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-lg-center" style={{ gap: '0.5rem' }}>
            {isAdmin ? (
              // Admin Navigation
              <>
                <Nav.Link as={Link} to="/admin/dashboard" onClick={handleNavClick} className="nav-link-modern">
                  <i className="bi bi-speedometer2 me-2"></i>
                  Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/admin/foods" onClick={handleNavClick} className="nav-link-modern">
                  <i className="bi bi-egg-fried me-2"></i>
                  Manage Foods
                </Nav.Link>
                <Nav.Link as={Link} to="/admin/orders" onClick={handleNavClick} className="nav-link-modern">
                  <i className="bi bi-receipt me-2"></i>
                  Orders
                </Nav.Link>
                <Nav.Link as={Link} to="/admin/customers" onClick={handleNavClick} className="nav-link-modern">
                  <i className="bi bi-people me-2"></i>
                  Customers
                </Nav.Link>
                <NavDropdown 
                  title={
                    <span>
                      <i className="bi bi-person-circle me-2"></i>
                      {user?.name}
                    </span>
                  } 
                  id="admin-dropdown"
                  className="nav-dropdown-modern"
                >
                  <NavDropdown.Item onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : isCustomer ? (
              // Customer Navigation
              <>
                <Nav.Link as={Link} to="/" onClick={handleNavClick} className="nav-link-modern">
                  <i className="bi bi-house me-2"></i>
                  Home
                </Nav.Link>
                <Nav.Link as={Link} to="/daily-foods" onClick={handleNavClick} className="nav-link-modern">
                  <i className="bi bi-calendar-event me-2"></i>
                  Daily Menu
                </Nav.Link>
                <Nav.Link as={Link} to="/cart" onClick={handleNavClick} className="nav-link-modern position-relative">
                  <i className="bi bi-cart3 me-2"></i>
                  Cart
                  {getCartCount() > 0 && (
                    <Badge
                      pill
                      style={{
                        position: 'absolute',
                        top: '-5px',
                        right: '-10px',
                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                        fontSize: '0.7rem',
                        padding: '0.35rem 0.6rem',
                        boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)',
                        animation: 'pulse 2s infinite'
                      }}
                    >
                      {getCartCount()}
                    </Badge>
                  )}
                </Nav.Link>
                <NavDropdown 
                  title={
                    <span>
                      <i className="bi bi-person-circle me-2"></i>
                      {user?.name}
                    </span>
                  } 
                  id="customer-dropdown"
                  className="nav-dropdown-modern"
                >
                  <NavDropdown.Item as={Link} to="/profile" onClick={handleNavClick}>
                    <i className="bi bi-person me-2"></i>
                    My Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/order-history" onClick={handleNavClick}>
                    <i className="bi bi-clock-history me-2"></i>
                    Order History
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              // Guest Navigation
              <>
                <Nav.Link as={Link} to="/" onClick={handleNavClick} className="nav-link-modern">
                  <i className="bi bi-house me-2"></i>
                  Home
                </Nav.Link>
                <Nav.Link as={Link} to="/daily-foods" onClick={handleNavClick} className="nav-link-modern">
                  <i className="bi bi-calendar-event me-2"></i>
                  Daily Menu
                </Nav.Link>
                <Nav.Link as={Link} to="/login" onClick={handleNavClick} className="nav-link-modern">
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Login
                </Nav.Link>
                <Button
                  as={Link}
                  to="/register"
                  onClick={handleNavClick}
                  style={{
                    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                    border: 'none',
                    color: '#000',
                    fontWeight: '700',
                    padding: '0.5rem 1.5rem',
                    borderRadius: '8px',
                    boxShadow: '0 4px 15px rgba(251, 191, 36, 0.3)',
                    transition: 'all 0.3s ease',
                    marginLeft: '0.5rem'
                  }}
                  className="btn-signup-modern"
                >
                  <i className="bi bi-person-plus me-2"></i>
                  Sign Up
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>

      <style jsx>{`
        .nav-link-modern {
          color: #fff !important;
          padding: 0.5rem 1rem !important;
          border-radius: 8px;
          transition: all 0.3s ease;
          font-weight: 500;
        }
        .nav-link-modern:hover {
          background: rgba(251, 191, 36, 0.1);
          color: #fbbf24 !important;
          transform: translateY(-2px);
        }
        .nav-dropdown-modern .dropdown-toggle {
          color: #fff !important;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          transition: all 0.3s ease;
          font-weight: 500;
        }
        .nav-dropdown-modern .dropdown-toggle:hover {
          background: rgba(251, 191, 36, 0.1);
          color: #fbbf24 !important;
        }
        .nav-dropdown-modern .dropdown-menu {
          background: rgba(0, 0, 0, 0.95);
          border: 2px solid #fbbf24;
          border-radius: 12px;
          padding: 0.5rem;
          margin-top: 0.5rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }
        .nav-dropdown-modern .dropdown-item {
          color: #fff;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        .nav-dropdown-modern .dropdown-item:hover {
          background: rgba(251, 191, 36, 0.1);
          color: #fbbf24;
        }
        .btn-signup-modern:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(251, 191, 36, 0.5) !important;
        }
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
        @media (max-width: 991px) {
          .nav-link-modern {
            margin: 0.25rem 0;
          }
          .btn-signup-modern {
            margin: 0.5rem 0;
            width: 100%;
          }
        }
      `}</style>
    </Navbar>
  );
};

export default NavigationBar;
