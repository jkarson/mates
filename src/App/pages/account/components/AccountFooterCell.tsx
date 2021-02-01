import React, { useState } from 'react';
import BiggerSimpleButton from '../../../common/components/BiggerSimpleButton';
import FooterButton from '../../../common/components/FooterButton';
import FooterComponent from '../../../common/components/FooterComponent';
import Modal from '../../../common/components/Modal';
import RedMessageCell from '../../../common/components/RedMessageCell';

import '../styles/AccountFooterCell.css';

interface AccountFooterCellProps {
    handleLogOut: () => void;
}

const AccountFooterCell: React.FC<AccountFooterCellProps> = ({ handleLogOut }) => {
    const footerButtons = [<FooterButton onClick={handleLogOut} text="Log Out" />];
    return (
        <div>
            <FooterComponent buttons={footerButtons} />
        </div>
    );
};

export default AccountFooterCell;
