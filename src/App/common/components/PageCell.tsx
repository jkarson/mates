import React from 'react';
import Header from './Header';
import '../styles/PageCell.css';

interface PageCellProps {
    tabs?: JSX.Element;
    content: JSX.Element;
}

const PageCell: React.FC<PageCellProps> = ({ tabs, content }) => (
    <div className="container">
        <Header />
        {tabs ? tabs : null}
        <div className="content">{content}</div>
    </div>
);

export default PageCell;
