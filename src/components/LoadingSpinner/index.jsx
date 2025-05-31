// components/LoadingSpinner.jsx
import React from 'react';

function LoadingSpinner({ className = "", size = "1x" }) {
    return (
        <i className={`fa-solid fa-spinner fa-spin fa-${size} ${className}`}></i>
    );
}

export default LoadingSpinner;
