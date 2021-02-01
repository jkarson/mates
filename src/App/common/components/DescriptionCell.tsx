import React from 'react';
import StandardStyledText from './StandardStyledText';

interface DescriptionCellProps {
    content: string;
}

const DescriptionCell: React.FC<DescriptionCellProps> = ({ content }) => (
    <StandardStyledText text={content} />
);

export default DescriptionCell;
