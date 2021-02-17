import React, { useContext, useState } from 'react';
import { SimpleButton } from '../../../../common/components/SimpleButtons';
import YesNoMessageModal from '../../../../common/components/YesNoMessageModal';
import { MatesUserContext, MatesUserContextType } from '../../../../common/context';
import {
    getTenantByTenantId,
    getFormattedDateString,
    formatNames,
} from '../../../../common/utilities';
import { ChoreGenerator, ChoreGeneratorID } from '../models/ChoresInfo';

import '../styles/ChoreGeneratorCell.css';

interface ChoreGeneratorCellProps {
    choreGenerator: ChoreGenerator;
    handleDeleteSeries: (cgId: ChoreGeneratorID) => void;
    assignedToUser: boolean;
}

const ChoreGeneratorCell: React.FC<ChoreGeneratorCellProps> = ({
    choreGenerator,
    handleDeleteSeries,
    assignedToUser,
}) => {
    const { matesUser } = useContext(MatesUserContext) as MatesUserContextType;

    const tenantNames = choreGenerator.assigneeIds
        .map((assignee) => getTenantByTenantId(matesUser, assignee))
        .map((tenant) => {
            if (tenant === undefined) {
                return 'Unknown';
            } else {
                return tenant.name;
            }
        });

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    return (
        <div className="chore-generator-cell-container">
            <YesNoMessageModal
                show={showDeleteModal}
                setShow={setShowDeleteModal}
                message="Are you sure you want to delete this chore series? All associated chores will be deleted."
                yesText="Delete Chore Series"
                onClickYes={() => handleDeleteSeries(choreGenerator._id)}
            />
            <div className="chore-generator-cell-info-container">
                <div className="chore-generator-cell-title-container">
                    <span
                        className={assignedToUser ? 'chore-generator-cell-title-red-container' : ''}
                    >
                        {choreGenerator.name}
                    </span>
                </div>
                <div className="chore-generator-cell-frequency-container">
                    <span>
                        {choreGenerator.frequency +
                            ', beginning ' +
                            getFormattedDateString(choreGenerator.starting)}
                    </span>
                </div>
                <div className="chore-generator-cell-assignment-container">
                    <span>{'Assigned to: ' + formatNames(tenantNames)}</span>
                </div>
            </div>
            <div className="chore-generator-cell-button-container">
                <SimpleButton onClick={() => setShowDeleteModal(true)} text="Delete Chore Series" />
            </div>
        </div>
    );
};

export default ChoreGeneratorCell;
