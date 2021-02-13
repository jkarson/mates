import React, { useContext, useState } from 'react';
import { getTotalCurrentAssignedValue } from '../utilities';
import { AmountOwed } from '../models/AmountOwed';
import { MatesUserContext, MatesUserContextType } from '../../../../common/context';
import { getFormattedDateString, getTenantByTenantId } from '../../../../common/utilities';
import { UserId } from '../../../../common/models';
import { Bill, BillId, BillGeneratorID } from '../models/BillsInfo';

import '../styles/BillCell.css';
import SimpleButton from '../../../../common/components/SimpleButton';
import YesNoMessageModal from '../../../../common/components/YesNoMessageModal';
import PayableToDisplayCell from './PayableToDisplayCell';
import AmountsOwedDisplayCell from './AmountsOwedDisplayCell';

interface BillCellProps {
    bill: Bill;
    isPaid: boolean;
    isPrivate: boolean;
    isResolved: boolean;
    userPortionIsPaid: boolean;
    handleDeleteBill: (billId: BillId) => void;
    handleDeleteBillSeries: (bgId: BillGeneratorID) => void;
    handleResolveBill: (billId: BillId) => void;
    handlePayPortionToPayable: (billId: BillId) => void;
    handlePayPortionToTenant: (billId: BillId, payeeId: UserId) => void;
    handlePayBalance: (billId: BillId) => void;
    handleResetBill: (billId: BillId) => void;
}

const BillCell: React.FC<BillCellProps> = ({
    bill,
    isPaid,
    isPrivate,
    isResolved,
    userPortionIsPaid,
    handleDeleteBill,
    handleDeleteBillSeries,
    handleResolveBill,
    handlePayPortionToPayable,
    handlePayPortionToTenant,
    handlePayBalance,
    handleResetBill,
}) => {
    const [showDeleteBillModal, setShowDeleteBillModal] = useState(false);
    const [showDeleteSeriesModal, setShowDeleteSeriesModal] = useState(false);

    const handlePayPortionToTenantBound = handlePayPortionToTenant.bind(null, bill._id);
    return (
        <div className="bill-cell-container">
            <YesNoMessageModal
                show={showDeleteBillModal}
                setShow={setShowDeleteBillModal}
                message="Are you sure you want to delete this bill?"
                yesText="Delete Bill"
                onClickYes={() => handleDeleteBill(bill._id)}
            />
            <YesNoMessageModal
                show={showDeleteSeriesModal}
                setShow={setShowDeleteSeriesModal}
                message="Are you sure you want to delete this bill series? All associated bills will be deleted."
                yesText="Delete Bill Series"
                onClickYes={() => handleDeleteBillSeries(bill.billGeneratorId)}
            />
            <div className="bill-cell-top-line-container">
                <div className="bill-cell-delete-bill-button-container">
                    <SimpleButton text="Delete Bill" onClick={() => setShowDeleteBillModal(true)} />
                </div>
                <div
                    className={
                        bill.isPrivate
                            ? 'bill-cell-private-title-container'
                            : 'bill-cell-title-container'
                    }
                >
                    <span>{bill.name}</span>
                </div>
                <div className="bill-cell-delete-series-button-container">
                    <SimpleButton
                        text="Delete Bill Series"
                        onClick={() => setShowDeleteSeriesModal(true)}
                    />
                </div>
            </div>
            <div className="bill-cell-date-container">
                <span>{'Due: '}</span>
                <span>{getFormattedDateString(bill.date)}</span>
            </div>
            <div className="bill-cell-payable-to-container">
                <PayableToDisplayCell
                    billId={bill._id}
                    payableTo={bill.payableTo}
                    isPaid={isPaid}
                    isPrivate={isPrivate}
                    userPortionIsPaid={userPortionIsPaid}
                    totalOwed={getTotalCurrentAssignedValue(bill.amountsOwed)}
                    handlePayPortionToPayable={handlePayPortionToPayable}
                    handlePayBalance={handlePayBalance}
                />
            </div>
            <div className="bill-cell-amounts-owed-container">
                <AmountsOwedDisplayCell
                    amountsOwed={bill.amountsOwed}
                    userPortionIsPaid={userPortionIsPaid}
                    isPrivate={isPrivate}
                    handlePayPortionToTenant={handlePayPortionToTenantBound}
                />
            </div>
            <div className="bill-cell-footer-buttons-container">
                {isPrivate || isResolved ? null : (
                    <SimpleButton
                        onClick={() => handleResolveBill(bill._id)}
                        text="Resolve All Debts"
                    />
                )}
                <SimpleButton onClick={() => handleResetBill(bill._id)} text="Reset All Payments" />
            </div>
        </div>
    );
};

export default BillCell;
