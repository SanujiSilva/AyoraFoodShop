import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const FoodCard = ({ food }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (!user) {
      toast.info('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (food.quantity <= 0) {
      toast.error('This item is out of stock');
      return;
    }

    addToCart(food);
    toast.success(`${food.foodName} added to cart!`);
  };

  return (
    <Card className="food-card h-100">
      <div className="food-card-overlay">
        <Card.Img
          variant="top"
          src={food.image}
          alt={food.foodName}
          className="food-card-img"
        />
        {food.quantity <= 5 && food.quantity > 0 && (
          <div className="food-card-badge">
            <i className="bi bi-fire text-danger me-1"></i>
            Only {food.quantity} left!
          </div>
        )}
        {food.quantity === 0 && (
          <div className="food-card-badge bg-danger text-white">
            <i className="bi bi-x-circle me-1"></i>
            Out of Stock
          </div>
        )}
      </div>
      <Card.Body className="modern-card-body d-flex flex-column">
        <Card.Title className="h5 fw-bold text-dark mb-2">{food.foodName}</Card.Title>
        {food.description && (
          <Card.Text className="text-muted small flex-grow-1 mb-3">
            {food.description}
          </Card.Text>
        )}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <div className="d-flex align-items-baseline">
              <h4 className="text-gradient-primary mb-0 fw-bold">LKR {food.price.toFixed(2)}</h4>
            </div>
            <small className={`${food.quantity > 0 ? 'text-success' : 'text-danger'} fw-semibold`}>
              <i className={`bi ${food.quantity > 0 ? 'bi-check-circle' : 'bi-x-circle'} me-1`}></i>
              {food.quantity > 0 ? `${food.quantity} available` : 'Out of stock'}
            </small>
          </div>
        </div>
        <Button
          variant={food.quantity > 0 ? 'primary' : 'secondary'}
          className={food.quantity > 0 ? 'btn-modern btn-gradient-primary w-100' : 'btn-modern w-100'}
          onClick={handleAddToCart}
          disabled={food.quantity <= 0}
        >
          <i className="bi bi-cart-plus me-2"></i>
          {food.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </Card.Body>
    </Card>
  );
};

export default FoodCard;
