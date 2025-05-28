import './Loading.scss'
function Loading() {
  return (
    <div className="loading-overlay">
      <div className="spinner"></div>
      <p>Đang xử lý...</p>
    </div>
  );
}

export default Loading