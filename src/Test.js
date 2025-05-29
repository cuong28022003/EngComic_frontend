import React from 'react';
import Loading from './components/Loading/Loading';
 // Đường dẫn tới file Loading.js

function Test() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <Loading /> {/* Sử dụng component Loading ở đây */}
    </div>
  );
}

export default Test;