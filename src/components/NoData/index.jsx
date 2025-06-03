import React from "react";
import { AlertCircle } from "lucide-react";
import "./styles.scss";

const NoData = ({ message = "Không có dữ liệu để hiển thị.", className = "" }) => {
    return (
        <div className={`no-data ${className}`}>
            <AlertCircle className="no-data__icon" size={48} />
            <p className="no-data__message">{message}</p>
        </div>
    );
};

export default NoData;