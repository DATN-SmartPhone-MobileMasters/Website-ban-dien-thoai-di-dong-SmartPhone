import React from 'react';
import { useLocation } from 'react-router-dom';
import AddDanhgia from '../../(admin)/danhgia/AddDanhgia';

const ListDanhgia = () => {
  const location = useLocation();
  const { orderId } = location.state || {};

  return (
    <div style={{ padding: 20, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: 30 }}>
      <div style={{ flex: 1, maxWidth: '35%' }}>
        <AddDanhgia orderId={orderId} />
      </div>
    </div>
  );
};

export default ListDanhgia;