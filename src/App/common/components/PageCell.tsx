import React from 'react';
import Header from './Header';
import '../styles/PageCell.css';

interface PageCellProps {
    onHeaderClick?: () => void;
    tabs?: JSX.Element;
    content: JSX.Element;
}

const PageCell: React.FC<PageCellProps> = ({ tabs, content, onHeaderClick }) => (
    <div className="page-cell-container">
        <div className="page-cell-header-block">
            <Header onClick={onHeaderClick} />
            <div className="page-cell-header-tabs-container">{tabs ? tabs : null}</div>
        </div>
        <div className="page-cell-content-block">{content}</div>
    </div>
);

export default PageCell;
