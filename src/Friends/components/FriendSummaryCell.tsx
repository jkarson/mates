import React from 'react';
import { Apartment } from '../../Common/models';

interface FriendSummaryCellProps {
    friend: Apartment;
}

export const FriendSummaryCell: React.FC<FriendSummaryCellProps> = ({ friend }) => (
    <p>
        <span style={{ fontWeight: 'bold' }}>{friend.name + ': '}</span>
        {formatNames(friend.tenants.map((tenant) => tenant.name))}
    </p>
);

// Used by Events module
export const getFriendSummaryCellString = (apartment: Apartment) =>
    apartment.name + ': ' + formatNames(apartment.tenants.map((tenant) => tenant.name));

export const formatNames = (names: string[]) => {
    if (names.length === 0) {
        return '';
    } else if (names.length === 1) {
        return names[0];
    } else if (names.length === 2) {
        return names[0] + ' & ' + names[1];
    } else {
        return names[0] + ', ' + formatNames(names.slice(1));
    }
};
