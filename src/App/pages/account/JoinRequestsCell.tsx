import React, { useContext } from 'react';
import DescriptionCell from '../../common/components/DescriptionCell';
import { AccountContext } from '../../common/context';
import { ApartmentSummary } from '../../common/models';
import { formatNames } from '../../common/utilities';

const JoinRequestsCell: React.FC = () => {
    const userContext = useContext(AccountContext);
    if (!userContext) {
        return null;
    }

    const { user } = userContext;
    const requestedApartmentSummaries: ApartmentSummary[] = user.requestedApartments;

    const content =
        requestedApartmentSummaries.length > 0 ? (
            requestedApartmentSummaries.map((apartmentSummary) => (
                <JoinRequestCell apartmentSummary={apartmentSummary} />
            ))
        ) : (
            <DescriptionCell
                content={'Apartments that you have requested to join will appear hear.'}
            />
        );
    return <div>{content}</div>;
};

interface JoinRequestCellProps {
    apartmentSummary: ApartmentSummary;
}

//to do: factor out a common apartment summary cell ? could even take
// an optional button... w the callback encompassed? that would make this section
// at least easier to style and more readable

const JoinRequestCell: React.FC<JoinRequestCellProps> = ({ apartmentSummary }) => (
    <div style={{ borderBottom: '1px solid black' }}>
        <h3>{apartmentSummary.name}</h3>
        <p>{formatNames(apartmentSummary.tenantNames)}</p>
    </div>
);

export default JoinRequestsCell;
