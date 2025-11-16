import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Spinner, Alert } from 'react-bootstrap';
import axios from '../../utils/axios';

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
