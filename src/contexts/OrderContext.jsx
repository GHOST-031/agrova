import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';
import toast from 'react-hot-toast';

const OrderContext = createContext();

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within OrderProvider');
  }
  return context;
};

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load orders from API
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('f2c_token');
      const user = localStorage.getItem('f2c_user');
      
      if (token && user) {
        setLoading(true);
        const data = await api.getMyOrders();
        // Normalize orders to have both id and _id for compatibility
        const normalizedOrders = (data.data || []).map(order => ({
          ...order,
          id: order._id || order.id,
        }));
        setOrders(normalizedOrders);
      } else {
        // Clear orders if no user is logged in
        setOrders([]);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Load orders on mount and when user changes
  useEffect(() => {
    fetchOrders();
    
    // Re-fetch orders when storage changes (user login/logout)
    const handleStorageChange = (e) => {
      if (e.key === 'f2c_token' || e.key === 'f2c_user') {
        fetchOrders();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const createOrder = async (orderData) => {
    try {
      setLoading(true);
      const data = await api.createOrder(orderData);
      const newOrder = data.data;
      
      setOrders(prev => [newOrder, ...prev]);
      toast.success('Order placed successfully!');
      return newOrder;
    } catch (error) {
      toast.error(error.message || 'Failed to create order');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      setLoading(true);
      await api.updateOrderStatus(orderId, status);
      
      setOrders(prev => 
        prev.map(order => 
          order._id === orderId || order.id === orderId
            ? { ...order, status, updatedAt: new Date().toISOString() }
            : order
        )
      );
      toast.success('Order status updated');
    } catch (error) {
      toast.error(error.message || 'Failed to update order status');
    } finally {
      setLoading(false);
    }
  };

  const getOrderById = (orderId) => {
    return orders.find(order => order._id === orderId || order.id === orderId);
  };

  const cancelOrder = async (orderId) => {
    try {
      setLoading(true);
      await api.cancelOrder(orderId);
      
      setOrders(prev => 
        prev.map(order => 
          order._id === orderId || order.id === orderId
            ? { ...order, status: ORDER_STATUS.CANCELLED, updatedAt: new Date().toISOString() }
            : order
        )
      );
      toast.success('Order cancelled successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to cancel order');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    orders,
    loading,
    createOrder,
    updateOrderStatus,
    getOrderById,
    cancelOrder,
    loadOrders: fetchOrders, // Expose for App.jsx coordination
    ORDER_STATUS,
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

export default OrderContext;
