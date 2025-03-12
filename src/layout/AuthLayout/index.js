import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
    return (
        <div className="auth-layout" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <div style={{ width: '100%', maxWidth: '600px' }}>
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;
