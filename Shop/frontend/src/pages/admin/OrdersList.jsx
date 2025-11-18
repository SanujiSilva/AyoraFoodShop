import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Badge, Spinner, Alert, Button, Form } from 'react-bootstrap';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [orderNumberFilter, setOrderNumberFilter] = useState('');
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, selectedDate, selectedLocation, orderNumberFilter]);

  useEffect(() => {
    // Extract unique locations from orders
    const uniqueLocations = [...new Set(orders.map(order => order.location))].sort();
    setLocations(uniqueLocations);
  }, [orders]);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('/admin/orders');
      setOrders(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders');
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    // Filter by date
    if (selectedDate) {
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.date).toISOString().split('T')[0];
        return orderDate === selectedDate;
      });
    }

    // Filter by location
    if (selectedLocation) {
      filtered = filtered.filter((order) => order.location === selectedLocation);
    }

    // Filter by order number
    if (orderNumberFilter) {
      filtered = filtered.filter((order) => 
        order.orderNumber.toString().includes(orderNumberFilter)
      );
    }

    setFilteredOrders(filtered);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
  };

  const clearFilters = () => {
    setSelectedDate('');
    setSelectedLocation('');
    setOrderNumberFilter('');
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      console.log('Changing order status:', { orderId, newStatus });
      const response = await axios.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      console.log('Status update response:', response.data);
      toast.success('Order status updated!');
      fetchOrders();
    } catch (error) {
      console.error('Status update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDeleteByDate = async () => {
    if (!selectedDate) {
      toast.error('Please select a date first');
      return;
    }

    const ordersToDelete = filteredOrders.filter((order) => {
      const orderDate = new Date(order.date).toISOString().split('T')[0];
      return orderDate === selectedDate;
    });

    if (ordersToDelete.length === 0) {
      toast.error('No orders found for the selected date');
      return;
    }

    const confirmMessage = `Are you sure you want to delete ${ordersToDelete.length} order(s) from ${new Date(selectedDate).toLocaleDateString()}?\n\nThis action cannot be undone!`;
    
    if (window.confirm(confirmMessage)) {
      try {
        const response = await axios.delete('/admin/orders/delete-by-date', {
          data: { date: selectedDate }
        });
        toast.success(response.data.message);
        setSelectedDate('');
        fetchOrders();
      } catch (error) {
        console.error('Delete orders error:', error);
        toast.error(error.response?.data?.message || 'Failed to delete orders');
      }
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

  // Calculate confirmed orders summary
  const getConfirmedOrdersSummary = () => {
    const confirmedOrders = filteredOrders.filter(order => order.status === 'Confirm');
    
    // Calculate total income
    const totalIncome = confirmedOrders.reduce((sum, order) => sum + order.total, 0);
    
    // Aggregate food items
    const foodItemsMap = {};
    confirmedOrders.forEach(order => {
      order.items.forEach(item => {
        if (foodItemsMap[item.foodName]) {
          foodItemsMap[item.foodName] += item.qty;
        } else {
          foodItemsMap[item.foodName] = item.qty;
        }
      });
    });

    // Convert to array and sort by quantity
    const foodItems = Object.entries(foodItemsMap)
      .map(([name, qty]) => ({ name, qty }))
      .sort((a, b) => b.qty - a.qty);

    return {
      totalIncome,
      orderCount: confirmedOrders.length,
      foodItems,
      totalItems: foodItems.reduce((sum, item) => sum + item.qty, 0),
    };
  };

  // Calculate all orders summary
  const getAllOrdersSummary = () => {
    // Calculate total income
    const totalIncome = filteredOrders.reduce((sum, order) => sum + order.total, 0);
    
    // Aggregate food items
    const foodItemsMap = {};
    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        if (foodItemsMap[item.foodName]) {
          foodItemsMap[item.foodName] += item.qty;
        } else {
          foodItemsMap[item.foodName] = item.qty;
        }
      });
    });

    // Convert to array and sort by quantity
    const foodItems = Object.entries(foodItemsMap)
      .map(([name, qty]) => ({ name, qty }))
      .sort((a, b) => b.qty - a.qty);

    return {
      totalIncome,
      orderCount: filteredOrders.length,
      foodItems,
      totalItems: foodItems.reduce((sum, item) => sum + item.qty, 0),
    };
  };

  const confirmedSummary = getConfirmedOrdersSummary();
  const allOrdersSummary = getAllOrdersSummary();

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

  return (
    <Container className="py-5">
      {/* Professional Header */}
      <div 
        className="mb-4 p-4 rounded-3 position-relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1f2937 0%, #000 100%)',
          border: '3px solid #fbbf24',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
        }}
      >
        <div className="position-relative" style={{ zIndex: 2 }}>
          <div className="d-flex align-items-center gap-3">
            <div 
              className="d-flex align-items-center justify-content-center rounded-3"
              style={{
                width: '70px',
                height: '70px',
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                border: '3px solid #000'
              }}
            >
              <i className="bi bi-receipt-cutoff" style={{ fontSize: '2rem', color: '#000' }}></i>
            </div>
            <div>
              <h2 className="mb-1 text-white fw-bold">Orders Management</h2>
              <p className="mb-0 text-white-50">View, filter and manage all customer orders</p>
            </div>
          </div>
        </div>
        <div 
          className="position-absolute top-0 end-0 opacity-25"
          style={{ fontSize: '150px', color: '#fbbf24', lineHeight: 1 }}
        >
          <i className="bi bi-receipt"></i>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div 
            className="modern-card p-3 h-100"
            style={{
              background: 'linear-gradient(135deg, #fefce8 0%, #fff 100%)',
              border: '2px solid #fbbf24',
              borderRadius: '12px',
              animation: 'slideIn 0.5s ease-out'
            }}
          >
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <p className="text-muted mb-1 fw-semibold" style={{ fontSize: '0.85rem' }}>Total Orders</p>
                <h3 className="mb-0 fw-bold" style={{ color: '#000' }}>{orders.length}</h3>
              </div>
              <div 
                className="d-flex align-items-center justify-content-center rounded-circle"
                style={{
                  width: '50px',
                  height: '50px',
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
                }}
              >
                <i className="bi bi-receipt-cutoff" style={{ fontSize: '1.5rem', color: '#000' }}></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div 
            className="modern-card p-3 h-100"
            style={{
              background: 'linear-gradient(135deg, #fefce8 0%, #fff 100%)',
              border: '2px solid #22c55e',
              borderRadius: '12px',
              animation: 'slideIn 0.6s ease-out'
            }}
          >
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <p className="text-muted mb-1 fw-semibold" style={{ fontSize: '0.85rem' }}>Delivered</p>
                <h3 className="mb-0 fw-bold" style={{ color: '#22c55e' }}>
                  {orders.filter(o => o.status === 'Delivered').length}
                </h3>
              </div>
              <div 
                className="d-flex align-items-center justify-content-center rounded-circle"
                style={{
                  width: '50px',
                  height: '50px',
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
                }}
              >
                <i className="bi bi-check-circle" style={{ fontSize: '1.5rem', color: '#fff' }}></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div 
            className="modern-card p-3 h-100"
            style={{
              background: 'linear-gradient(135deg, #fefce8 0%, #fff 100%)',
              border: '2px solid #3b82f6',
              borderRadius: '12px',
              animation: 'slideIn 0.7s ease-out'
            }}
          >
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <p className="text-muted mb-1 fw-semibold" style={{ fontSize: '0.85rem' }}>Confirmed</p>
                <h3 className="mb-0 fw-bold" style={{ color: '#3b82f6' }}>
                  {orders.filter(o => o.status === 'Confirm').length}
                </h3>
              </div>
              <div 
                className="d-flex align-items-center justify-content-center rounded-circle"
                style={{
                  width: '50px',
                  height: '50px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                }}
              >
                <i className="bi bi-clipboard-check" style={{ fontSize: '1.5rem', color: '#fff' }}></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div 
            className="modern-card p-3 h-100"
            style={{
              background: 'linear-gradient(135deg, #fefce8 0%, #fff 100%)',
              border: '2px solid #f59e0b',
              borderRadius: '12px',
              animation: 'slideIn 0.8s ease-out'
            }}
          >
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <p className="text-muted mb-1 fw-semibold" style={{ fontSize: '0.85rem' }}>Pending</p>
                <h3 className="mb-0 fw-bold" style={{ color: '#f59e0b' }}>
                  {orders.filter(o => o.status === 'Pending').length}
                </h3>
              </div>
              <div 
                className="d-flex align-items-center justify-content-center rounded-circle"
                style={{
                  width: '50px',
                  height: '50px',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                }}
              >
                <i className="bi bi-clock-history" style={{ fontSize: '1.5rem', color: '#fff' }}></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-4 border-0 shadow-sm" style={{ borderRadius: '12px', overflow: 'hidden' }}>
        <Card.Header 
          className="py-3"
          style={{
            background: 'linear-gradient(135deg, #1f2937 0%, #000 100%)',
            border: 'none'
          }}
        >
          <h5 className="mb-0 text-white fw-bold">
            <i className="bi bi-funnel me-2" style={{ color: '#fbbf24' }}></i>
            Filter Orders
          </h5>
        </Card.Header>
        <Card.Body className="p-3 p-md-4" style={{ background: '#fefce8' }}>
          {/* Desktop Filter Layout */}
          <div className="d-none d-lg-flex align-items-center gap-3 flex-wrap">
            <div className="d-flex align-items-center gap-2">
              <Form.Label className="mb-0 fw-semibold">
                <i className="bi bi-hash me-1" style={{ color: '#fbbf24' }}></i>
                Order No:
              </Form.Label>
              <Form.Control
                type="text"
                value={orderNumberFilter}
                onChange={(e) => setOrderNumberFilter(e.target.value)}
                placeholder="Search order number"
                style={{ 
                  width: '180px',
                  borderWidth: '2px',
                  borderRadius: '8px'
                }}
              />
            </div>
            <div className="d-flex align-items-center gap-2">
              <Form.Label className="mb-0 fw-semibold">
                <i className="bi bi-calendar3 me-1" style={{ color: '#fbbf24' }}></i>
                Date:
              </Form.Label>
              <Form.Control
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                style={{ 
                  width: '180px',
                  borderWidth: '2px',
                  borderRadius: '8px'
                }}
              />
            </div>
            <div className="d-flex align-items-center gap-2">
              <Form.Label className="mb-0 fw-semibold">
                <i className="bi bi-geo-alt me-1" style={{ color: '#fbbf24' }}></i>
                Location:
              </Form.Label>
              <Form.Select
                value={selectedLocation}
                onChange={handleLocationChange}
                style={{ 
                  width: '200px',
                  borderWidth: '2px',
                  borderRadius: '8px'
                }}
              >
                <option value="">All Locations</option>
                {locations.map((loc, index) => (
                  <option key={index} value={loc}>
                    {loc}
                  </option>
                ))}
              </Form.Select>
            </div>
            {(selectedDate || selectedLocation || orderNumberFilter) && (
              <Button 
                variant="outline-danger" 
                size="sm" 
                onClick={clearFilters}
                style={{
                  borderWidth: '2px',
                  borderRadius: '8px',
                  fontWeight: '600'
                }}
              >
                <i className="bi bi-x-circle me-1"></i>
                Clear Filters
              </Button>
            )}
            {selectedDate && filteredOrders.length > 0 && (
              <Button 
                variant="danger" 
                size="sm" 
                onClick={handleDeleteByDate}
                style={{
                  borderWidth: '2px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  border: '2px solid #991b1b'
                }}
              >
                <i className="bi bi-trash me-1"></i>
                Delete Orders ({filteredOrders.filter(o => new Date(o.date).toISOString().split('T')[0] === selectedDate).length})
              </Button>
            )}
            <div className="ms-auto">
              <Badge 
                bg="dark" 
                className="fs-6 px-3 py-2"
                style={{
                  background: 'linear-gradient(135deg, #1f2937 0%, #000 100%)',
                  border: '2px solid #fbbf24'
                }}
              >
                <i className="bi bi-eye me-2" style={{ color: '#fbbf24' }}></i>
                <strong>Showing: {filteredOrders.length}</strong>
                {(selectedDate || selectedLocation || orderNumberFilter) && (
                  <span className="ms-2" style={{ color: '#fbbf24' }}>
                    of {orders.length} total
                  </span>
                )}
              </Badge>
            </div>
          </div>

          {/* Mobile Filter Layout */}
          <div className="d-lg-none">
            {/* Order Number Filter */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold d-flex align-items-center">
                <i className="bi bi-hash me-2" style={{ color: '#fbbf24', fontSize: '1.1rem' }}></i>
                Order Number
              </Form.Label>
              <Form.Control
                type="text"
                value={orderNumberFilter}
                onChange={(e) => setOrderNumberFilter(e.target.value)}
                placeholder="Search by order number"
                style={{ 
                  borderWidth: '2px',
                  borderRadius: '8px',
                  padding: '0.7rem'
                }}
              />
            </Form.Group>

            {/* Date Filter */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold d-flex align-items-center">
                <i className="bi bi-calendar3 me-2" style={{ color: '#fbbf24', fontSize: '1.1rem' }}></i>
                Filter by Date
              </Form.Label>
              <Form.Control
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                style={{ 
                  borderWidth: '2px',
                  borderRadius: '8px',
                  padding: '0.7rem'
                }}
              />
            </Form.Group>

            {/* Location Filter */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold d-flex align-items-center">
                <i className="bi bi-geo-alt me-2" style={{ color: '#fbbf24', fontSize: '1.1rem' }}></i>
                Filter by Location
              </Form.Label>
              <Form.Select
                value={selectedLocation}
                onChange={handleLocationChange}
                style={{ 
                  borderWidth: '2px',
                  borderRadius: '8px',
                  padding: '0.7rem'
                }}
              >
                <option value="">All Locations</option>
                {locations.map((loc, index) => (
                  <option key={index} value={loc}>
                    {loc}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Action Buttons */}
            <div className="d-grid gap-2">
              {/* Results Badge */}
              <div 
                className="p-3 rounded text-center"
                style={{
                  background: 'linear-gradient(135deg, #1f2937 0%, #000 100%)',
                  border: '2px solid #fbbf24'
                }}
              >
                <div className="text-white fw-bold">
                  <i className="bi bi-eye me-2" style={{ color: '#fbbf24' }}></i>
                  Showing: <span style={{ color: '#fbbf24' }}>{filteredOrders.length}</span>
                  {(selectedDate || selectedLocation || orderNumberFilter) && (
                    <span className="ms-2">
                      of {orders.length} total
                    </span>
                  )}
                </div>
              </div>

              {/* Clear Filters Button */}
              {(selectedDate || selectedLocation || orderNumberFilter) && (
                <Button 
                  variant="outline-danger" 
                  onClick={clearFilters}
                  style={{
                    borderWidth: '2px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    padding: '0.7rem'
                  }}
                >
                  <i className="bi bi-x-circle me-2"></i>
                  Clear All Filters
                </Button>
              )}

              {/* Delete Orders Button */}
              {selectedDate && filteredOrders.length > 0 && (
                <Button 
                  variant="danger" 
                  onClick={handleDeleteByDate}
                  style={{
                    borderWidth: '2px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    padding: '0.7rem',
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    border: '2px solid #991b1b'
                  }}
                >
                  <i className="bi bi-trash me-2"></i>
                  Delete Orders ({filteredOrders.filter(o => new Date(o.date).toISOString().split('T')[0] === selectedDate).length})
                </Button>
              )}
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* All Orders Summary */}
      {allOrdersSummary.orderCount > 0 && (
        <Card className="mb-4 border-0 shadow" style={{ borderRadius: '12px', overflow: 'hidden', animation: 'slideIn 0.9s ease-out' }}>
          <Card.Header 
            className="py-3"
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              border: 'none'
            }}
          >
            <h5 className="mb-0 text-white fw-bold">
              <i className="bi bi-bar-chart-line me-2"></i>
              All Orders Summary
              {(selectedDate || selectedLocation) && (
                <span className="ms-2" style={{ opacity: 0.9 }}>
                  {selectedDate && `(${new Date(selectedDate).toLocaleDateString()})`}
                  {selectedLocation && ` - ${selectedLocation}`}
                </span>
              )}
            </h5>
          </Card.Header>
          <Card.Body style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)' }}>
            <div className="row g-3 mb-4">
              <div className="col-md-3">
                <div 
                  className="text-center p-3 rounded-3"
                  style={{
                    background: '#fff',
                    border: '2px solid #3b82f6',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)'
                  }}
                >
                  <div className="d-flex align-items-center justify-content-center mb-2">
                    <i className="bi bi-receipt-cutoff me-2" style={{ fontSize: '1.5rem', color: '#3b82f6' }}></i>
                  </div>
                  <h6 className="text-muted mb-1 fw-semibold" style={{ fontSize: '0.85rem' }}>Total Orders</h6>
                  <h3 className="mb-0 fw-bold" style={{ color: '#3b82f6' }}>{allOrdersSummary.orderCount}</h3>
                </div>
              </div>
              <div className="col-md-3">
                <div 
                  className="text-center p-3 rounded-3"
                  style={{
                    background: '#fff',
                    border: '2px solid #22c55e',
                    boxShadow: '0 4px 12px rgba(34, 197, 94, 0.15)'
                  }}
                >
                  <div className="d-flex align-items-center justify-content-center mb-2">
                    <i className="bi bi-cash-stack me-2" style={{ fontSize: '1.5rem', color: '#22c55e' }}></i>
                  </div>
                  <h6 className="text-muted mb-1 fw-semibold" style={{ fontSize: '0.85rem' }}>Total Income</h6>
                  <h3 className="mb-0 fw-bold" style={{ color: '#22c55e' }}>LKR {allOrdersSummary.totalIncome.toFixed(2)}</h3>
                </div>
              </div>
              <div className="col-md-3">
                <div 
                  className="text-center p-3 rounded-3"
                  style={{
                    background: '#fff',
                    border: '2px solid #06b6d4',
                    boxShadow: '0 4px 12px rgba(6, 182, 212, 0.15)'
                  }}
                >
                  <div className="d-flex align-items-center justify-content-center mb-2">
                    <i className="bi bi-basket me-2" style={{ fontSize: '1.5rem', color: '#06b6d4' }}></i>
                  </div>
                  <h6 className="text-muted mb-1 fw-semibold" style={{ fontSize: '0.85rem' }}>Total Food Items</h6>
                  <h3 className="mb-0 fw-bold" style={{ color: '#06b6d4' }}>{allOrdersSummary.totalItems}</h3>
                </div>
              </div>
              <div className="col-md-3">
                <div 
                  className="text-center p-3 rounded-3"
                  style={{
                    background: '#fff',
                    border: '2px solid #f59e0b',
                    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.15)'
                  }}
                >
                  <div className="d-flex align-items-center justify-content-center mb-2">
                    <i className="bi bi-grid-3x3 me-2" style={{ fontSize: '1.5rem', color: '#f59e0b' }}></i>
                  </div>
                  <h6 className="text-muted mb-1 fw-semibold" style={{ fontSize: '0.85rem' }}>Unique Foods</h6>
                  <h3 className="mb-0 fw-bold" style={{ color: '#f59e0b' }}>{allOrdersSummary.foodItems.length}</h3>
                </div>
              </div>
            </div>

            <h6 className="mb-3 fw-bold" style={{ color: '#1f2937' }}>
              <i className="bi bi-basket me-2" style={{ color: '#3b82f6' }}></i>
              Food Items Breakdown
            </h6>
            <div className="row">
              {allOrdersSummary.foodItems.map((item, index) => (
                <div key={index} className="col-md-4 col-lg-3 mb-2">
                  <div 
                    className="d-flex justify-content-between align-items-center p-2 rounded"
                    style={{
                      background: '#fff',
                      border: '2px solid #e5e7eb',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#3b82f6';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <span className="fw-semibold" style={{ fontSize: '0.9rem' }}>{item.name}</span>
                    <Badge 
                      pill
                      style={{
                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                        border: 'none'
                      }}
                    >
                      {item.qty}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Confirmed Orders Summary */}
      {confirmedSummary.orderCount > 0 && (
        <Card className="mb-4 border-0 shadow" style={{ borderRadius: '12px', overflow: 'hidden', animation: 'slideIn 1s ease-out' }}>
          <Card.Header 
            className="py-3"
            style={{
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              border: 'none'
            }}
          >
            <h5 className="mb-0 text-white fw-bold">
              <i className="bi bi-clipboard-check me-2"></i>
              Confirmed Orders Summary
              {(selectedDate || selectedLocation) && (
                <span className="ms-2">
                  {selectedDate && `(${new Date(selectedDate).toLocaleDateString()})`}
                  {selectedLocation && ` - ${selectedLocation}`}
                </span>
              )}
            </h5>
          </Card.Header>
          <Card.Body>
            <div className="row g-3 mb-4">
              <div className="col-md-3">
                <div 
                  className="text-center p-3 rounded-3"
                  style={{
                    background: '#fff',
                    border: '2px solid #22c55e',
                    boxShadow: '0 4px 12px rgba(34, 197, 94, 0.15)'
                  }}
                >
                  <div className="d-flex align-items-center justify-content-center mb-2">
                    <i className="bi bi-clipboard-check me-2" style={{ fontSize: '1.5rem', color: '#22c55e' }}></i>
                  </div>
                  <h6 className="text-muted mb-1 fw-semibold" style={{ fontSize: '0.85rem' }}>Confirmed Orders</h6>
                  <h3 className="mb-0 fw-bold" style={{ color: '#22c55e' }}>{confirmedSummary.orderCount}</h3>
                </div>
              </div>
              <div className="col-md-3">
                <div 
                  className="text-center p-3 rounded-3"
                  style={{
                    background: '#fff',
                    border: '2px solid #16a34a',
                    boxShadow: '0 4px 12px rgba(22, 163, 74, 0.15)'
                  }}
                >
                  <div className="d-flex align-items-center justify-content-center mb-2">
                    <i className="bi bi-cash-stack me-2" style={{ fontSize: '1.5rem', color: '#16a34a' }}></i>
                  </div>
                  <h6 className="text-muted mb-1 fw-semibold" style={{ fontSize: '0.85rem' }}>Total Income</h6>
                  <h3 className="mb-0 fw-bold" style={{ color: '#16a34a' }}>LKR {confirmedSummary.totalIncome.toFixed(2)}</h3>
                </div>
              </div>
              <div className="col-md-3">
                <div 
                  className="text-center p-3 rounded-3"
                  style={{
                    background: '#fff',
                    border: '2px solid #84cc16',
                    boxShadow: '0 4px 12px rgba(132, 204, 22, 0.15)'
                  }}
                >
                  <div className="d-flex align-items-center justify-content-center mb-2">
                    <i className="bi bi-basket me-2" style={{ fontSize: '1.5rem', color: '#84cc16' }}></i>
                  </div>
                  <h6 className="text-muted mb-1 fw-semibold" style={{ fontSize: '0.85rem' }}>Total Food Items</h6>
                  <h3 className="mb-0 fw-bold" style={{ color: '#84cc16' }}>{confirmedSummary.totalItems}</h3>
                </div>
              </div>
              <div className="col-md-3">
                <div 
                  className="text-center p-3 rounded-3"
                  style={{
                    background: '#fff',
                    border: '2px solid #65a30d',
                    boxShadow: '0 4px 12px rgba(101, 163, 13, 0.15)'
                  }}
                >
                  <div className="d-flex align-items-center justify-content-center mb-2">
                    <i className="bi bi-grid-3x3 me-2" style={{ fontSize: '1.5rem', color: '#65a30d' }}></i>
                  </div>
                  <h6 className="text-muted mb-1 fw-semibold" style={{ fontSize: '0.85rem' }}>Unique Foods</h6>
                  <h3 className="mb-0 fw-bold" style={{ color: '#65a30d' }}>{confirmedSummary.foodItems.length}</h3>
                </div>
              </div>
            </div>

            <h6 className="mb-3 fw-bold" style={{ color: '#1f2937' }}>
              <i className="bi bi-basket me-2" style={{ color: '#22c55e' }}></i>
              Food Items Breakdown
            </h6>
            <div className="row">
              {confirmedSummary.foodItems.map((item, index) => (
                <div key={index} className="col-md-4 col-lg-3 mb-2">
                  <div 
                    className="d-flex justify-content-between align-items-center p-2 rounded"
                    style={{
                      background: '#fff',
                      border: '2px solid #e5e7eb',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#22c55e';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <span className="fw-semibold" style={{ fontSize: '0.9rem' }}>{item.name}</span>
                    <Badge 
                      pill
                      style={{
                        background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                        border: 'none'
                      }}
                    >
                      {item.qty}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      )}

      {filteredOrders.length === 0 ? (
        <div 
          className="text-center py-5 rounded-3"
          style={{
            background: 'linear-gradient(135deg, #fefce8 0%, #fff 100%)',
            border: '2px dashed #fbbf24'
          }}
        >
          <i className="bi bi-inbox" style={{ fontSize: '4rem', color: '#fbbf24', opacity: 0.5 }}></i>
          <h4 className="mt-3 mb-2" style={{ color: '#1f2937' }}>No Orders Found</h4>
          <p className="text-muted mb-0">
            {selectedDate || selectedLocation || orderNumberFilter
              ? 'No orders found matching the selected filters.'
              : 'No orders have been placed yet.'}
          </p>
        </div>
      ) : (
        <Card className="border-0 shadow" style={{ borderRadius: '12px', overflow: 'hidden', animation: 'slideIn 1.1s ease-out' }}>
          <Card.Header 
            className="py-3"
            style={{
              background: 'linear-gradient(135deg, #1f2937 0%, #000 100%)',
              border: 'none'
            }}
          >
            <h5 className="mb-0 text-white fw-bold">
              <i className="bi bi-list-ul me-2" style={{ color: '#fbbf24' }}></i>
              Orders List
            </h5>
          </Card.Header>
          <Card.Body className="p-0">
            {/* Desktop Table View */}
            <div className="table-responsive d-none d-lg-block">
              <Table hover className="mb-0">
                <thead>
                  <tr 
                    style={{
                      background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                      borderBottom: '3px solid #000'
                    }}
                  >
                    <th className="fw-bold" style={{ color: '#000', borderBottom: 'none' }}>
                      <i className="bi bi-hash me-1"></i>Order No
                    </th>
                    <th className="fw-bold" style={{ color: '#000', borderBottom: 'none' }}>
                      <i className="bi bi-person me-1"></i>Customer
                    </th>
                    <th className="fw-bold" style={{ color: '#000', borderBottom: 'none' }}>
                      <i className="bi bi-telephone me-1"></i>Phone
                    </th>
                    <th className="fw-bold" style={{ color: '#000', borderBottom: 'none' }}>
                      <i className="bi bi-geo-alt me-1"></i>Location
                    </th>
                    <th className="fw-bold" style={{ color: '#000', borderBottom: 'none' }}>
                      <i className="bi bi-basket me-1"></i>Items
                    </th>
                    <th className="fw-bold" style={{ color: '#000', borderBottom: 'none' }}>
                      <i className="bi bi-cash-stack me-1"></i>Total
                    </th>
                    <th className="fw-bold" style={{ color: '#000', borderBottom: 'none' }}>
                      <i className="bi bi-calendar3 me-1"></i>Date
                    </th>
                    <th className="fw-bold" style={{ color: '#000', borderBottom: 'none' }}>
                      <i className="bi bi-info-circle me-1"></i>Status
                    </th>
                    <th className="fw-bold" style={{ color: '#000', borderBottom: 'none' }}>
                      <i className="bi bi-gear me-1"></i>Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, index) => (
                    <tr 
                      key={order._id}
                      style={{
                        background: index % 2 === 0 ? '#fefce8' : '#fff',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#fef3c7';
                        e.currentTarget.style.transform = 'scale(1.01)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = index % 2 === 0 ? '#fefce8' : '#fff';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <td style={{ verticalAlign: 'middle' }}>
                        <Badge 
                          pill
                          style={{
                            background: 'linear-gradient(135deg, #1f2937 0%, #000 100%)',
                            border: '2px solid #fbbf24',
                            fontSize: '0.9rem',
                            padding: '0.4rem 0.8rem'
                          }}
                        >
                          #{order.orderNumber}
                        </Badge>
                      </td>
                      <td style={{ verticalAlign: 'middle' }}>
                        <div className="fw-semibold">{order.customerName}</div>
                      </td>
                      <td style={{ verticalAlign: 'middle' }}>
                        <span className="text-muted">
                          <i className="bi bi-telephone-fill me-1" style={{ color: '#fbbf24' }}></i>
                          {order.phone}
                        </span>
                      </td>
                      <td style={{ verticalAlign: 'middle' }}>
                        <Badge bg="secondary" className="fw-normal">
                          <i className="bi bi-geo-alt-fill me-1"></i>
                          {order.location}
                        </Badge>
                      </td>
                      <td style={{ verticalAlign: 'middle' }}>
                        {order.items.map((item, idx) => (
                          <div key={idx} className="mb-1" style={{ fontSize: '0.85rem' }}>
                            <span className="fw-semibold">{item.foodName}</span>
                            <span className="text-muted"> × {item.qty}</span>
                            <span className="ms-2" style={{ color: '#f59e0b', fontWeight: '600' }}>
                              LKR {item.price.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </td>
                      <td style={{ verticalAlign: 'middle' }}>
                        <div 
                          className="fw-bold fs-6"
                          style={{
                            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                          }}
                        >
                          LKR {order.total.toFixed(2)}
                        </div>
                      </td>
                      <td style={{ verticalAlign: 'middle' }}>
                        <div className="text-muted" style={{ fontSize: '0.85rem' }}>
                          <div>
                            <i className="bi bi-calendar3 me-1" style={{ color: '#fbbf24' }}></i>
                            {new Date(order.date).toLocaleDateString()}
                          </div>
                          <div className="mt-1">
                            <i className="bi bi-clock me-1" style={{ color: '#f59e0b' }}></i>
                            {new Date(order.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </td>
                      <td style={{ verticalAlign: 'middle' }}>
                        <Badge 
                          bg={getStatusVariant(order.status)}
                          className="px-3 py-2"
                          style={{ fontSize: '0.85rem' }}
                        >
                          {order.status}
                        </Badge>
                      </td>
                      <td style={{ verticalAlign: 'middle' }}>
                        <Form.Select
                          size="sm"
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          style={{
                            borderWidth: '2px',
                            borderRadius: '8px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirm">Confirm</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </Form.Select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            {/* Mobile Card View */}
            <div className="d-lg-none p-3">
              {filteredOrders.map((order, index) => (
                <Card 
                  key={order._id}
                  className="mb-3 border-0 shadow-sm"
                  style={{
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '2px solid #fbbf24'
                  }}
                >
                  <Card.Header 
                    style={{
                      background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                      borderBottom: '2px solid #000'
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <Badge 
                        pill
                        style={{
                          background: 'linear-gradient(135deg, #1f2937 0%, #000 100%)',
                          border: '2px solid #fff',
                          fontSize: '1rem',
                          padding: '0.5rem 1rem'
                        }}
                      >
                        <i className="bi bi-hash"></i>{order.orderNumber}
                      </Badge>
                      <Badge 
                        bg={getStatusVariant(order.status)}
                        className="px-3 py-2"
                        style={{ fontSize: '0.9rem' }}
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </Card.Header>
                  <Card.Body style={{ background: '#fefce8', padding: '1rem' }}>
                    {/* Customer Info */}
                    <div className="mb-3">
                      <div 
                        className="d-flex align-items-center mb-3 p-2 rounded"
                        style={{ background: '#fff', border: '1px solid #e5e7eb' }}
                      >
                        <i className="bi bi-person-fill me-2" style={{ color: '#fbbf24', fontSize: '1.3rem' }}></i>
                        <div className="flex-grow-1">
                          <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Customer Name</small>
                          <strong style={{ fontSize: '1rem' }}>{order.customerName}</strong>
                        </div>
                      </div>
                      
                      <div 
                        className="d-flex align-items-center mb-3 p-2 rounded"
                        style={{ background: '#fff', border: '1px solid #e5e7eb' }}
                      >
                        <i className="bi bi-telephone-fill me-2" style={{ color: '#fbbf24', fontSize: '1.3rem' }}></i>
                        <div className="flex-grow-1">
                          <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Phone Number</small>
                          <strong style={{ fontSize: '1rem' }}>{order.phone}</strong>
                        </div>
                      </div>
                      
                      <div 
                        className="d-flex align-items-center mb-3 p-2 rounded"
                        style={{ background: '#fff', border: '1px solid #e5e7eb' }}
                      >
                        <i className="bi bi-geo-alt-fill me-2" style={{ color: '#fbbf24', fontSize: '1.3rem' }}></i>
                        <div className="flex-grow-1">
                          <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Delivery Location</small>
                          <Badge bg="secondary" className="fw-normal mt-1" style={{ fontSize: '0.85rem' }}>
                            {order.location}
                          </Badge>
                        </div>
                      </div>
                      
                      <div 
                        className="d-flex align-items-center p-2 rounded"
                        style={{ background: '#fff', border: '1px solid #e5e7eb' }}
                      >
                        <i className="bi bi-calendar-check-fill me-2" style={{ color: '#fbbf24', fontSize: '1.3rem' }}></i>
                        <div className="flex-grow-1">
                          <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Order Date & Time</small>
                          <div className="d-flex align-items-center gap-2 flex-wrap">
                            <strong style={{ fontSize: '0.95rem' }}>
                              <i className="bi bi-calendar3 me-1" style={{ color: '#6b7280', fontSize: '0.85rem' }}></i>
                              {new Date(order.date).toLocaleDateString()}
                            </strong>
                            <strong style={{ fontSize: '0.95rem' }}>
                              <i className="bi bi-clock-fill me-1" style={{ color: '#f59e0b', fontSize: '0.85rem' }}></i>
                              {new Date(order.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </strong>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Items */}
                    <div 
                      className="mb-3 p-3 rounded"
                      style={{
                        background: '#fff',
                        border: '2px solid #e5e7eb'
                      }}
                    >
                      <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-basket-fill me-2" style={{ color: '#fbbf24', fontSize: '1.1rem' }}></i>
                        <strong>Order Items</strong>
                      </div>
                      {order.items.map((item, idx) => (
                        <div 
                          key={idx}
                          className="d-flex justify-content-between align-items-center mb-2 pb-2"
                          style={{ 
                            borderBottom: idx < order.items.length - 1 ? '1px solid #e5e7eb' : 'none'
                          }}
                        >
                          <div>
                            <div className="fw-semibold">{item.foodName}</div>
                            <small className="text-muted">Qty: {item.qty} × LKR {item.price.toFixed(2)}</small>
                          </div>
                          <div 
                            className="fw-bold"
                            style={{ color: '#f59e0b' }}
                          >
                            LKR {(item.qty * item.price).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Total */}
                    <div 
                      className="p-3 rounded mb-3"
                      style={{
                        background: 'linear-gradient(135deg, #1f2937 0%, #000 100%)',
                        border: '2px solid #fbbf24'
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-white fw-semibold">
                          <i className="bi bi-cash-stack me-2"></i>
                          Total Amount
                        </span>
                        <span 
                          className="fw-bold fs-5"
                          style={{ color: '#fbbf24' }}
                        >
                          LKR {order.total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Status Action */}
                    <div>
                      <label className="form-label fw-semibold mb-2">
                        <i className="bi bi-gear-fill me-2" style={{ color: '#fbbf24' }}></i>
                        Update Status
                      </label>
                      <Form.Select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        style={{
                          borderWidth: '2px',
                          borderRadius: '8px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          padding: '0.7rem'
                        }}
                      >
                        <option value="Pending">🕐 Pending</option>
                        <option value="Confirm">✅ Confirm</option>
                        <option value="Delivered">🚚 Delivered</option>
                        <option value="Cancelled">❌ Cancelled</option>
                      </Form.Select>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default OrdersList;
