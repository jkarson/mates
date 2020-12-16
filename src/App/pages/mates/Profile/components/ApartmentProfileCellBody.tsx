import React from 'react';
import { Apartment } from '../../../../common/models';

interface ApartmentProfileCellBodyProps {
    apartment: Apartment;
}

const ApartmentProfileCellBody: React.FC<ApartmentProfileCellBodyProps> = ({ apartment }) => (
    <div>
        <h1>{apartment.name}</h1>
        <p>{apartment.location}</p>
        <p style={{ color: 'blue' }}>{apartment.quote ? '"' + apartment.quote + '"' : null}</p>
    </div>
);

export default ApartmentProfileCellBody;
