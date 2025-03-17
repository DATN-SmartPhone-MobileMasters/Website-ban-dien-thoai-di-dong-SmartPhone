import React from 'react';
import DanhGia from '../../(admin)/danhgia/DanhGia';
import AddDanhgia from '../../(admin)/danhgia/AddDanhgia';

const ListDanhgia = () => {
  // Ref để truy cập vào DanhGia component
  const danhGiaRef = React.useRef(null);

  // Hàm callback để cập nhật danh sách đánh giá
  const handleAddDanhGiaSuccess = () => {
    if (danhGiaRef.current) {
      danhGiaRef.current.getDanhGias(); // Gọi lại hàm fetch danh sách
    }
  };

  return (
    <div style={{ padding: 20, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: 30 }}>
      {/* Danh sách đánh giá */}
      <div style={{ flex: 2, maxWidth: '65%' }}>
        <DanhGia isReadOnly={true} ref={danhGiaRef} />
      </div>

      {/* Form thêm đánh giá */}
      <div style={{ flex: 1, maxWidth: '35%' }}>
        <AddDanhgia onAddSuccess={handleAddDanhGiaSuccess} />
      </div>
    </div>
  );
};

export default ListDanhgia;