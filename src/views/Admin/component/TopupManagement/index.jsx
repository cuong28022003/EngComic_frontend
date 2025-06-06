import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles.scss";
import { toast } from "react-toastify";
import { getTopupRequests, confirmTopupRequest } from "../../../../api/topupApi";
import { useDispatch, useSelector } from "react-redux";
import loginSuccess from "../../../../redux/slice/auth";
import Pagination from "../../../../components/Pagination/index.jsx";
import ConfirmDialog from "../../../../components/ConfirmDialog/index.jsx";

const TopupManagement = () => {
    const user = useSelector((state) => state.auth.login?.user);
    const dispatch = useDispatch();
    const [requests, setRequests] = useState([]);
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("desc"); // desc | asc

    const [currentPage, setCurrentPage] = useState(1); // page starts from 1 for UI
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 3;

    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const handleConfirmClick = (id) => {
        setSelectedId(id);
        setShowConfirm(true);
    };

    useEffect(() => {
        fetchRequests();
    }, [currentPage]);

    const fetchRequests = async () => {
        try {
            const params = {
                page: currentPage - 1, // API expects 0-based index
                size: pageSize,
            }
            const response = await getTopupRequests(params, user, dispatch, loginSuccess);
            setRequests(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Error fetching topup requests:", error);
            toast.error("Không thể tải yêu cầu nạp kim cương");
        }
    };

    const handleConfirm = (id) => {
        setShowConfirm(false);
        confirmTopupRequest(id, user, dispatch, loginSuccess)
            .then(() => {
                toast.success("Đã xác nhận giao dịch");
                fetchRequests();
            })
            .catch((err) => {
                console.error("Error confirming topup request:", err);
                setShowConfirm(false);
                toast.error("Lỗi xác nhận");
            });
    };

    const filtered = requests
        .filter((r) => {
            if (filter === "pending") return !r.processed && !r.canceled;
            if (filter === "processed") return r.processed;
            if (filter === "canceled") return r.canceled;
            return true;
        })
        .filter((r) =>
            r.note?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            return sortOrder === "desc"
                ? new Date(b.createdAt) - new Date(a.createdAt)
                : new Date(a.createdAt) - new Date(b.createdAt);
        });

    return (
        <div className="admin-topup-page">
            <h2>Quản lý yêu cầu nạp</h2>

            <div className="topup-controls">
                <div className="search">
                    <input
                        className="input"
                        type="text"
                        placeholder="Tìm kiếm ghi chú..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="filter">
                    <div className="options">
                        <label>Lọc: </label>
                        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                            <option value="all">Tất cả</option>
                            <option value="pending">Đang chờ</option>
                            <option value="processed">Đã xử lý</option>
                            <option value="canceled">Đã hủy</option>
                        </select>
                    </div>
                    <div className="options">
                        <label>Sắp xếp: </label>
                        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                            <option value="desc">Mới nhất</option>
                            <option value="asc">Cũ nhất</option>
                        </select>
                    </div>
                </div>

            </div>
            <table className="topup-table">
                <thead>
                    <tr>
                        <th>Người dùng</th>
                        <th>Kim cương</th>
                        <th>Ghi chú</th>
                        <th>Thời gian</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map((item) => (
                        <tr key={item.id} className={item.processed ? "processed" : item.canceled ? "canceled" : "pending"}>
                            <td>{item.userId}</td>
                            <td>{item.diamonds}</td>
                            <td>{item.note}</td>
                            <td>{new Date(item.createdAt).toLocaleString()}</td>
                            <td>
                                {item.canceled
                                    ? "❌ Đã hủy"
                                    : item.processed
                                        ? "✅ Đã xử lý"
                                        : "🕒 Đang chờ"}
                            </td>
                            <td>
                                {!item.processed && !item.canceled && (
                                    <button onClick={() => handleConfirmClick(item.id)}>Xác nhận</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
            {showConfirm && (
                <ConfirmDialog
                    message="Bạn có chắc chắn muốn xác nhận giao dịch này?"
                    onConfirm={() => handleConfirm(selectedId)}
                    onCancel={() => setShowConfirm(false)}
                />
            )}
        </div>
    );
};

export default TopupManagement;
