import React from 'react';
import StandardStyledText from './StandardStyledText';

import '../styles/LastWordBoldTextCell.css';

interface LastWordBoldTextCellProps {
    mainText: string;
    lastWord: string;
}

const LastWordBoldTextCell: React.FC<LastWordBoldTextCellProps> = ({ mainText, lastWord }) => (
    <div className="last-word-bold-text-cell-container">
        <div className="last-word-bold-text-cell-non-bold-container">
            <StandardStyledText text={mainText} />
        </div>
        <div className="last-word-bold-text-cell-bold-container">
            <StandardStyledText text={lastWord} />
        </div>
    </div>
);

export default LastWordBoldTextCell;
