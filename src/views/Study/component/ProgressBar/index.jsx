import React from "react";
import "./styles.scss";

const ProgressBar = ({ current, total }) => {
    const percentage = Math.round((current / total) * 100);

    return (
        <div className="progress-bar">
            <div className="progress" style={{ width: `${percentage}%` }}></div>
        </div>
    );
};

export default ProgressBar;
