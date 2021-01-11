import React, { useContext, useState } from 'react';
import { Link, Redirect, RouteComponentProps } from 'react-router-dom';
import DescriptionCell from '../../common/components/DescriptionCell';
import { AccountContext, AccountContextType } from '../../common/context';
import { ApartmentId, ApartmentSummary } from '../../common/models';
import { formatNames } from '../../common/utilities';

// to do: better modularize this file

const ApartmentsCell: React.FC<RouteComponentProps> = ({ history }) => {
    const userContext = useContext(AccountContext) as AccountContextType;

    const { user } = userContext;
    const apartmentSummaries: ApartmentSummary[] = user.apartments;
    const [redirect, setRedirect] = useState(false);
    const [error, setError] = useState(false);

    const handleClickViewApartment = (apartmentId: ApartmentId) => {
        setError(false);
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ apartmentId: apartmentId }),
        };
        fetch('/account/viewApartment', options)
            .then((response) => response.json())
            .then((json) => {
                const { authenticated, success } = json;
                if (!authenticated) {
                    setRedirect(true);
                    return;
                }
                if (!success) {
                    setError(true);
                    return;
                }
                console.log(json);
                history.push('/mates');
            })
            .catch((err) => console.error(err));
    };

    const content =
        apartmentSummaries.length > 0 ? (
            apartmentSummaries.map((apartmentSummary) => (
                <ApartmentCell
                    apartmentSummary={apartmentSummary}
                    handleClickViewApartment={handleClickViewApartment}
                />
            ))
        ) : (
            <DescriptionCell content={'Create or join an apartment to get started.'} />
        );
    return (
        <div>
            {!error ? null : (
                <p style={{ color: 'red' }}>{'Unknown Error while trying to view apartment'}</p>
            )}
            {content}
            {!redirect ? null : <Redirect to="/" />}
        </div>
    );
};

interface ApartmentCellProps {
    apartmentSummary: ApartmentSummary;
    handleClickViewApartment: (apartmentId: ApartmentId) => void;
}

const ApartmentCell: React.FC<ApartmentCellProps> = ({
    apartmentSummary,
    handleClickViewApartment,
}) => (
    <div style={{ borderBottom: '1px solid black' }}>
        <h3>{apartmentSummary.name}</h3>
        <p>{formatNames(apartmentSummary.tenantNames)}</p>
        <button onClick={() => handleClickViewApartment(apartmentSummary.apartmentId)}>
            {'View'}
        </button>
    </div>
);

export default ApartmentsCell;
