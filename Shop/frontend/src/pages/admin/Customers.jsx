import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Spinner, Alert, Button } from 'react-bootstrap';
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

  return (
    <Container className="py-5">
      <h2 className="mb-4">All Customers</h2>

      {customers.length === 0 ? (
        <Alert variant="info">No customers found.</Alert>
      ) : (
        <Card>
          <Card.Body>
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Location</th>
                  <th>Registered Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer._id}>
                    <td>
                      <strong>{customer.name}</strong>
                    </td>
                    <td>{customer.email}</td>
                    <td>{customer.phone || 'N/A'}</td>
                    <td>{customer.location || 'N/A'}</td>
                    <td>{new Date(customer.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(customer._id, customer.name)}
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default Customers;
