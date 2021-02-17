import React from 'react';
import PageCell from './PageCell';
import StandardStyledText from './StandardStyledText';

import '../styles/LoadingPageCell.css';

const LoadingPageCell: React.FC = () => (
    <PageCell
        content={
            <div className="loading-page-cell-container">
                <div className="loading-page-cell-text-container">
                    <StandardStyledText text="Loading..." />
                </div>
            </div>
        }
    />
);

export default LoadingPageCell;
