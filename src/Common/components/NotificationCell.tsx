import React from 'react';
import '../styles/NotificationCell.css';

interface NotificationCellProps {
    notifications: number;
}

const NotificationCell: React.FC<NotificationCellProps> = ({ notifications }) => {
    if (notifications > 0) {
        return <span className="circle">{notifications}</span>;
    }
    return null;
};

export default NotificationCell;
