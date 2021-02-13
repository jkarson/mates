import React, { useState } from 'react';
import BiggerSimpleButton from '../../../common/components/BiggerSimpleButton';
import Modal from '../../../common/components/Modal';
import SimpleButton from '../../../common/components/SimpleButton';
import StandardStyledText from '../../../common/components/StandardStyledText';
import YesNoMessageModal from '../../../common/components/YesNoMessageModal';
import { ApartmentId } from '../../../common/models';
import ApartmentSummaryCell from '../../mates/Friends/components/ApartmentSummaryCell';
import { ApartmentSummary } from '../../mates/Friends/models/FriendsInfo';

import '../styles/ApartmentCell.css';

interface ApartmentCellProps {
    apartmentSummary: ApartmentSummary;
    handleClickViewApartment: (apartmentId: ApartmentId) => void;
    handleClickLeaveApartment: (apartmentId: ApartmentId) => void;
}

const ApartmentCell: React.FC<ApartmentCellProps> = ({
    apartmentSummary,
    handleClickViewApartment,
    handleClickLeaveApartment,
}) => {
    const [showModal, setShowModal] = useState(false);
    return (
        <div className="apartment-cell-container">
            <YesNoMessageModal
                show={showModal}
                setShow={setShowModal}
                message={
                    'Are you sure you want to leave your apartment? Please note that apartments with zero remaining members will be permanently deleted.'
                }
                onClickYes={() => handleClickLeaveApartment(apartmentSummary.apartmentId)}
                yesText={'Leave Apartment'}
            />
            <div className="apartment-cell-leave-button-container">
                <SimpleButton onClick={() => setShowModal(true)} text={'Leave Apartment'} />
            </div>
            <div className="apartment-cell-main-container">
                <ApartmentSummaryCell
                    friend={apartmentSummary}
                    onIconClick={() => handleClickViewApartment(apartmentSummary.apartmentId)}
                />
            </div>
        </div>
    );
};

export default ApartmentCell;
