import React from 'react';
import { isLetter } from '../../Common/utilities';

interface InitialsProps {
    name: string;
}

const Initials: React.FC<InitialsProps> = ({ name }) => {
    return <p>{'Initials: ' + getInitials(name)}</p>;
};

const getInitials = (name: string) => {
    let initials: string = '';
    const names = name.split(' ');
    const firstLetters = names.map((name) => name.charAt(0));
    firstLetters.forEach((firstLetter) => {
        if (isLetter(firstLetter)) {
            initials += firstLetter.toUpperCase();
        }
    });
    return initials;
};

export default Initials;
