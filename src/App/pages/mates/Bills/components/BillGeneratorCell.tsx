import React, { useState } from 'react';
import { getFormattedDateString, getFormattedDateStringNoDay } from '../../../../common/utilities';
import { BillGenerator, BillGeneratorID } from '../models/BillsInfo';
import AmountsWithPercentOwedDisplayCell from './AmountsWithPercentOwedDisplayCell';

import '../styles/BillGeneratorCell.css';
import SimpleButton from '../../../../common/components/SimpleButton';
import YesNoMessageModal from '../../../../common/components/YesNoMessageModal';
import LastWordBoldTextCell from '../../../../common/components/LastWordBoldTextCell';

interface BillGeneratorCellProps {
    billGenerator: BillGenerator;
    handleDeleteBillSeries: (bgId: BillGeneratorID) => void;
}

const BillGeneratorCell: React.FC<BillGeneratorCellProps> = ({
    billGenerator,
    handleDeleteBillSeries,
}) => {
    const [showDeleteSeriesModal, setShowDeleteSeriesModal] = useState(false);
    return (
        <div className="bill-generator-cell-container">
            <YesNoMessageModal
                show={showDeleteSeriesModal}
                setShow={setShowDeleteSeriesModal}
                message="Are you sure you want to delete this bill series? All associated bills will be deleted."
                onClickYes={() => handleDeleteBillSeries(billGenerator._id)}
                yesText="Delete Bill Series"
            />
            <div className="bill-generator-cell-top-line-container">
                <div
                    className={
                        billGenerator.isPrivate
                            ? 'bill-generator-cell-private-title-container'
                            : 'bill-generator-cell-title-container'
                    }
                >
                    {billGenerator.name}
                </div>
                <div className="bill-generator-cell-delete-button-container">
                    <SimpleButton
                        onClick={() => setShowDeleteSeriesModal(true)}
                        text={'Delete Bill Series'}
                    />
                </div>
            </div>
            <div className="bill-generator-cell-info-container">
                <div className="bill-generator-cell-payable-container">
                    <LastWordBoldTextCell
                        mainText="Payable to: "
                        lastWord={billGenerator.payableTo}
                    />
                </div>
                <div className="bill-generator-cell-frequency-container">
                    <span>
                        {billGenerator.frequency +
                            ', starting ' +
                            (billGenerator.frequency === 'Weekly'
                                ? getFormattedDateString(billGenerator.starting)
                                : getFormattedDateStringNoDay(billGenerator.starting))}
                    </span>
                </div>
            </div>
            <div className="bill-generator-cell-amounts-owed-container">
                <AmountsWithPercentOwedDisplayCell
                    amountsWithPercentOwed={billGenerator.amountsWithPercentOwed}
                />
            </div>
        </div>
    );
};

export default BillGeneratorCell;
