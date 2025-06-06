import React from "react";
import "./styles.scss";

const Button = ({
    children,
    type = "button",
    variant = "primary", // 'primary' | 'secondary' | 'outline'
    disabled = false,
    onClick,
    className = "",
}) => {
    return (
        <button
            type={type}
            className={`custom-button ${variant} ${className}`}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>

    );
};

export default Button;
