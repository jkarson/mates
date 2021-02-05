import React from 'react';
import { FriendProfile } from '../../Friends/models/FriendsInfo';
import ApartmentProfileCellBody from './ApartmentProfileCellBody';
import { TenantsProfileCell } from './TenantsProfileCell';

import '../styles/StaticApartmentProfileModal.css';

interface StaticApartmentProfileModalProps {
    apartment: FriendProfile;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const StaticApartmentProfileModal: React.FC<StaticApartmentProfileModalProps> = ({
    apartment,
    setShow,
}) => (
    <div className="static-apartment-profile-modal-container">
        <div className="static-apartment-profile-modal-empty-top" onClick={() => setShow(false)} />
        <div className="static-apartment-profile-modal-empty-left" onClick={() => setShow(false)} />
        <div
            className="static-apartment-profile-modal-empty-right"
            onClick={() => setShow(false)}
        />
        <div
            className="static-apartment-profile-modal-empty-bottom"
            onClick={() => setShow(false)}
        />
        <div className="static-apartment-profile-modal-content-container">
            <div className="static-apartment-profile-modal-apartment-container">
                <ApartmentProfileCellBody apartment={apartment} />
            </div>
            <div className="static-apartment-profile-modal-tenants-container">
                <TenantsProfileCell tenants={apartment.tenants} includesUser={false} />
            </div>
        </div>
        <div
            className="static-apartment-profile-modal-icon-close-container"
            onClick={() => setShow(false)}
        >
            <i className="fa fa-times-circle" />
        </div>
    </div>
);

export default StaticApartmentProfileModal;
