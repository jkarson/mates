import React from 'react';

interface DescriptionCellProps {
    content: string;
}

const DescriptionCell: React.FC<DescriptionCellProps> = ({ content }) => (
    <p style={{ fontWeight: 'bold' }}>{content}</p>
);

export default DescriptionCell;
