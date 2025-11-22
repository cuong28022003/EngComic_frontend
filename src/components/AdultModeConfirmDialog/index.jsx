import React from 'react';
import ConfirmDialog from '../ConfirmDialog';

const AdultModeConfirmDialog = ({ onConfirm, onCancel }) => {
    return (
        <ConfirmDialog
            message="Bạn có xác nhận đã đủ 18 tuổi để xem nội dung dành cho người lớn không?"
            onConfirm={onConfirm}
            onCancel={onCancel}
        />
    );
};

export default AdultModeConfirmDialog;
