import React from 'react';

import '../styles/StandardStyledText.css';

interface StandardStyledTextProps {
    text: string;
}

const StandardStyledText: React.FC<StandardStyledTextProps> = ({ text }) => (
    <span className="styled-text">{text}</span>
);

export default StandardStyledText;
