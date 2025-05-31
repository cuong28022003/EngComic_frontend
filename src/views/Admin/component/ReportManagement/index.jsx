import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import Pagination from '../../../../components/Pagination.js';
import './styles.scss';
import { updateComicStatus } from "../../../../api/comicApi.js";
import { toast } from 'react-toastify';
import Modal from "../../../../components/Modal/index.jsx";
import { getAllReports, updateReportStatus } from "../../../../api/reportApi.js";

const ReportManagement = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [showModal, setShowModal] = useState(false);
  const [modalReason, setModalReason] = useState('');

  const user = useSelector((state) => state.auth.login?.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getAllReports(user, dispatch, null, currentPage, itemsPerPage);
        if (data && data.content) {
          console.log("Reports data:", data.content.map(r => ({
            id: r.id,
            comicId: r.comicId,
            comicTitle: r.comicTitle,
            status: r.status
          })));
          setReports(data.content);
          setFilteredReports(data.content);
          setTotalPages(data.totalPages || 1);
        } else {
          setError("Dữ liệu trả về không hợp lệ");
          toast.error("Dữ liệu trả về không hợp lệ");
        }
      } catch (err) {
        console.error('Error fetching reports:', err);
        setError(err.message);
        toast.error("Lỗi khi tải danh sách báo cáo: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.accessToken) {
      fetchReports();
    } else {
      setError("Vui lòng đăng nhập để xem báo cáo");
      setLoading(false);
    }
  }, [user, dispatch, currentPage, itemsPerPage]);

  useEffect(() => {
    const filtered = reports.filter(report => {
      const searchLower = searchTerm.toLowerCase();
      return (
        (report.comicTitle && report.comicTitle.toLowerCase().includes(searchLower)) ||
        (report.username && report.username.toLowerCase().includes(searchLower)) ||
        (report.reason && report.reason.toLowerCase().includes(searchLower)) ||
        (report.status && report.status.toLowerCase().includes(searchLower))
      );
    });
    setFilteredReports(filtered);
  }, [searchTerm, reports]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortedItems = () => {
    if (!filteredReports) return filteredReports;

    return [...filteredReports].sort((a, b) => {
      const aValue = a[sortConfig.key] || '';
      const bValue = b[sortConfig.key] || '';
      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date)) {
        return "Không xác định";
      }
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('vi-VN', options);
    } catch (error) {
      console.error("Error parsing date:", dateString, error);
      return "Không xác định";
    }
  };

  const handleReasonClick = (reason) => {
    console.log("Opening modal, showModal:", true, "reason:", reason);
    setModalReason(reason || "Không có lý do");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    console.log("Closing modal, showModal:", false);
    setShowModal(false);
    setModalReason('');
  };

  const handleUpdateStatus = async (reportId, newStatus, comicId) => {
    const actionText = newStatus === 'RESOLVED' ? 'khóa truyện và cập nhật báo cáo' :
      newStatus === 'REJECTED' ? 'từ chối báo cáo' :
        'đặt lại trạng thái báo cáo và mở khóa truyện';
    try {
      console.log('Updating report:', { reportId, newStatus, comicId });

      await updateReportStatus(reportId, newStatus, user, dispatch, null);
      console.log(`Updated report ${reportId} to ${newStatus}`);

      if (newStatus === 'RESOLVED' && comicId) {
        if (!comicId || typeof comicId !== 'string' || comicId.length !== 24) {
          throw new Error(`ID truyện không hợp lệ: ${comicId}`);
        }
        console.log(`Locking comic ${comicId}`);
        await updateComicStatus(comicId, 'LOCK', user, dispatch, null);
        toast.success("Khóa truyện và cập nhật báo cáo thành công!");
      } else if (newStatus === 'PENDING' && comicId) {
        if (!comicId || typeof comicId !== 'string' || comicId.length !== 24) {
          throw new Error(`ID truyện không hợp lệ: ${comicId}`);
        }
        console.log(`Resetting comic ${comicId} to NONE`);
        await updateComicStatus(comicId, 'NONE', user, dispatch, null);
        toast.success("Đặt lại trạng thái báo cáo và mở khóa truyện thành công!");
      } else {
        toast.success("Cập nhật trạng thái báo cáo thành công!");
      }

      setReports(reports.map(report =>
        report.id === reportId ? { ...report, status: newStatus } : report
      ));
    } catch (err) {
      console.error('Error updating status:', {
        reportId,
        newStatus,
        comicId,
        message: err.message,
        stack: err.stack
      });
      const errorMessage = err.message.includes('Không tìm thấy truyện')
        ? `Lỗi xử lý truyện: ${err.message}`
        : `Cập nhật thất bại: ${err.message}`;
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">Lỗi: {error}</div>;
  if (reports.length === 0) return <div>Không có báo cáo nào</div>;

  return (
    <div className="report-list-container">
      <h1>Quản Lý Báo Cáo</h1>

      <div className="report-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên truyện, người báo cáo, lý do hoặc trạng thái..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="table-responsive">
        <table className="report-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Truyện</th>
              <th>Người Báo Cáo</th>
              <th>Lý Do</th>
              <th className="sortable" onClick={() => requestSort('createdAt')}>
                Ngày Báo Cáo {sortConfig.key === 'createdAt' && (
                  sortConfig.direction === 'ascending' ? '↑' : '↓'
                )}
              </th>
              <th className="sortable" onClick={() => requestSort('status')}>
                Trạng Thái {sortConfig.key === 'status' && (
                  sortConfig.direction === 'ascending' ? '↑' : '↓'
                )}
              </th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {getSortedItems().map((report, index) => (
              <tr key={report.id || index}>
                <td>{index + 1}</td>
                <td>
                  <div className="comic-info">
                    <span>{report.comicTitle || "Không xác định"}</span>
                  </div>
                </td>
                <td>{report.username || "Ẩn danh"}</td>
                <td
                  className="reason-cell"
                  onClick={() => handleReasonClick(report.reason)}
                  style={{ cursor: 'pointer', color: '#007bff' }}
                >
                  {report.reason ? `${report.reason.substring(0, 50)}${report.reason.length > 50 ? '...' : ''}` : "Không có lý do"}
                </td>
                <td>{formatDate(report.createdAt)}</td>
                <td>
                  <span className={`status-badge ${report.status.toLowerCase()}`}>
                    {report.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    {report.status === 'PENDING' && (
                      <>
                        <button
                          className="resolve-btn"
                          onClick={() => handleUpdateStatus(report.id, 'RESOLVED', report.comicId)}
                        >
                          Khóa Truyện
                        </button>
                        <button
                          className="reject-btn"
                          onClick={() => handleUpdateStatus(report.id, 'REJECTED')}
                        >
                          Từ chối
                        </button>
                      </>
                    )}
                    {report.status !== 'PENDING' && (
                      <button
                        className="reset-btn"
                        onClick={() => handleUpdateStatus(report.id, 'PENDING', report.comicId)}
                      >
                        Đặt lại
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal onClose={handleCloseModal}>
          <div className="reason-content">
            <h2>Chi Tiết Lý Do</h2>
            <p>{modalReason}</p>
            <button className="modal-button" onClick={handleCloseModal}>Đóng</button>
          </div>
        </Modal>
      )}

      {totalPages > 1 && (
        <div className="pagination-container">
          <Pagination
            currentPage={currentPage + 1}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page - 1)}
          />
        </div>
      )}
    </div>
  );
};

export default ReportManagement;