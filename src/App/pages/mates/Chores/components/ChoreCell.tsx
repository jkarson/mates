import React, { useContext, useState } from 'react';
import SimpleButton from '../../../../common/components/SimpleButton';
import YesNoMessageModal from '../../../../common/components/YesNoMessageModal';
import { MatesUserContext, MatesUserContextType } from '../../../../common/context';
import { Tenant } from '../../../../common/models';
import {
    getTenantByTenantId,
    getFormattedDateString,
    formatNames,
} from '../../../../common/utilities';
import { Chore, ChoreGeneratorID } from '../models/ChoresInfo';

import '../styles/ChoreCell.css';

interface ChoreCellProps {
    chore: Chore;
    assignedToUser: boolean;
    toggleCompleted: (chore: Chore) => void;
    handleDeleteChore: (chore: Chore) => void;
    handleDeleteSeries: (cgId: ChoreGeneratorID) => void;
}

const ChoreCell: React.FC<ChoreCellProps> = ({
    chore,
    assignedToUser,
    toggleCompleted,
    handleDeleteChore,
    handleDeleteSeries,
}) => {
    const { matesUser } = useContext(MatesUserContext) as MatesUserContextType;
    const tenantAssignees = chore.assigneeIds
        .map((assignee) => getTenantByTenantId(matesUser, assignee))
        .filter((assignee) => assignee !== undefined) as Tenant[];
    const completedBy: Tenant | undefined = chore.completedBy
        ? getTenantByTenantId(matesUser, chore.completedBy)
        : undefined;
    const titleContent = completedBy ? (
        completedBy.userId === matesUser.userId ? (
            <div className="chore-cell-green-title-container">
                <span>{chore.name}</span>
            </div>
        ) : (
            <span>{chore.name}</span>
        )
    ) : assignedToUser ? (
        <div className="chore-cell-red-title-container">
            <span>{chore.name}</span>
        </div>
    ) : (
        <span>{chore.name}</span>
    );
    const [showDeleteChoreModal, setShowDeleteChoreModal] = useState(false);
    const [showDeleteSeriesModal, setShowDeleteSeriesModal] = useState(false);
    const [toggleClicked, setToggleClicked] = useState(false);

    return (
        <div className="chore-cell-container">
            <YesNoMessageModal
                show={showDeleteChoreModal}
                setShow={setShowDeleteChoreModal}
                message="Are you sure you want to delete this chore?"
                yesText="Delete Chore"
                onClickYes={() => handleDeleteChore(chore)}
            />
            <YesNoMessageModal
                show={showDeleteSeriesModal}
                setShow={setShowDeleteSeriesModal}
                message="Are you sure you want to delete this chore series? All associated chores will be deleted."
                yesText="Delete Chore Series"
                onClickYes={() => handleDeleteSeries(chore.choreGeneratorId)}
            />
            <div className="chore-cell-info-container">
                <div className="chore-cell-top-line-container">
                    <SimpleButton
                        onClick={() => setShowDeleteChoreModal(true)}
                        text={'Delete Chore'}
                    />

                    <div className="chore-cell-title-container">{titleContent}</div>
                    <SimpleButton
                        onClick={() => setShowDeleteSeriesModal(true)}
                        text={'Delete Chore Series'}
                    />
                </div>
                <div className="chore-cell-date-container">
                    <span>{getFormattedDateString(chore.date)}</span>
                </div>
                <div className="chore-cell-assigned-container">
                    <span>
                        {'Assigned to: '}
                        {formatNames(tenantAssignees.map((tenant) => tenant.name))}
                    </span>
                </div>
                {completedBy ? (
                    <div className="chore-cell-completed-container">
                        <span>{'Completed by: ' + completedBy.name}</span>
                    </div>
                ) : null}
            </div>
            <div className="chore-cell-button-container">
                <div
                    className="chore-cell-toggle-button"
                    onClick={() => {
                        toggleCompleted(chore);
                        setToggleClicked(true);
                    }}
                >
                    <div
                        className={
                            chore.completed
                                ? toggleClicked
                                    ? 'chore-cell-toggle-button-checked-clicked-container'
                                    : 'chore-cell-toggle-button-checked-container'
                                : !toggleClicked
                                ? 'chore-cell-toggle-button-unchecked-container'
                                : 'chore-cell-toggle-button-unchecked-clicked-container'
                        }
                    >
                        <i className="fa fa-check" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChoreCell;
