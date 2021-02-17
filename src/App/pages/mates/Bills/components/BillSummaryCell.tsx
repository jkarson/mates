import React from 'react';
import { BillGenerator, BillGeneratorID } from '../models/BillsInfo';
import BillGeneratorCell from './BillGeneratorCell';

import '../styles/BillSummaryCell.css';

interface BillSummaryCellProps {
    billGenerators: BillGenerator[];
    handleDeleteBillSeries: (bgId: BillGeneratorID) => void;
}

const BillSummaryCell: React.FC<BillSummaryCellProps> = ({
    billGenerators,
    handleDeleteBillSeries,
}) => {
    const billGeneratorCells = billGenerators.map((billGenerator) => (
        <BillGeneratorCell
            billGenerator={billGenerator}
            handleDeleteBillSeries={handleDeleteBillSeries}
            key={billGenerator._id}
        />
    ));
    return <div className="bill-summary-cell-container">{billGeneratorCells}</div>;
};

export default BillSummaryCell;
