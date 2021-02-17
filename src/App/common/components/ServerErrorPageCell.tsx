import React from 'react';
import { RedMessageCell } from './ColoredMessageCells';
import PageCell from './PageCell';

import '../styles/ServerErrorPageCell.css';

const ServerErrorPageCell: React.FC = () => (
    <PageCell
        content={
            <div className="server-error-page-cell-content-container">
                <RedMessageCell message="Sorry, our server seems to be down." />
            </div>
        }
    />
);

export default ServerErrorPageCell;
