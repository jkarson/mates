import React, { useContext, useState } from 'react';
import { RedMessageCell } from '../../../common/components/ColoredMessageCells';
import DateInputCell from '../../../common/components/DateInputCell';
import {
    FauxSimpleButton,
    BiggerFauxSimpleButton,
} from '../../../common/components/FauxSimpleButtons';
import FrequencySelectCell from '../../../common/components/FrequencySelectCell';
import { SimpleButton, BiggerSimpleButton } from '../../../common/components/SimpleButtons';
import { StyledInput } from '../../../common/components/StyledInputs';
import { MatesUserContext, MatesUserContextType } from '../../../common/context';
import { UserId } from '../../../common/models';
import { getTodaysDate, getYesterdaysDateFromDate, getMaxDate } from '../../../common/utilities';
import AssignAssigneeModal from '../../mates/Chores/components/AssignAssigneeModal';
import { ChoreFrequency, choreFrequencies } from '../../mates/Chores/models/ChoreFrequency';
import { Chore, ChoreGenerator, ChoreWithoutId } from '../../mates/Chores/models/ChoresInfo';
import { ChoresTabType } from '../../mates/Chores/models/ChoresTabs';
import { getChoresWithoutIdFromChoreGenerator } from '../../mates/Chores/utilities';
import { getNewId, getNewIds } from '../utilities';

interface CreateChoreGeneratorInput {
    name: string;
    assigneeIds: UserId[];
    frequency: ChoreFrequency;
    starting: Date;
    showUntilCompleted: boolean;
}

interface DemoCreateChoreGeneratorCellProps {
    setTab: React.Dispatch<React.SetStateAction<ChoresTabType>>;
}

const DemoCreateChoreGeneratorCell: React.FC<DemoCreateChoreGeneratorCellProps> = ({ setTab }) => {
    const { matesUser: user, setMatesUser: setUser } = useContext(
        MatesUserContext,
    ) as MatesUserContextType;

    const [error, setError] = useState('');

    const initialCreateChoreGeneratorInput: CreateChoreGeneratorInput = {
        name: '',
        assigneeIds: [],
        frequency: 'Weekly',
        starting: getTodaysDate(),
        showUntilCompleted: true,
    };

    const [input, setInput] = useState<CreateChoreGeneratorInput>(initialCreateChoreGeneratorInput);

    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showAssigneesModal, setShowAssigneesModal] = useState(false);

    const handleSetAssigneeIds = (assigneeIds: UserId[]) => {
        setInput({ ...input, assigneeIds: [...assigneeIds] });
    };

    const handleSetFrequency = (frequency: ChoreFrequency) => {
        setInput({ ...input, frequency: frequency });
    };

    const handleSetDate = (date: Date) => {
        setInput({ ...input, starting: date });
    };

    const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (value !== ' ') {
            setInput({ ...input, name: value });
        }
    };

    const toggleShowUntilCompleted = () => {
        const newShowUntilCompleted = !input.showUntilCompleted;
        setInput({ ...input, showUntilCompleted: newShowUntilCompleted });
    };

    const canCreate = () => input.name.length > 0 && input.assigneeIds.length > 0;

    const createChoreGenerator = () => {
        if (input.name.length === 0 || input.assigneeIds.length === 0) {
            return;
        }
        const starting = new Date(input.starting.getTime());
        input.name = input.name.trim();

        const newChoreGenerator: ChoreGenerator = {
            _id: getNewId(user.apartment.choresInfo.choreGenerators, '_id'),
            name: input.name,
            assigneeIds: [...input.assigneeIds],
            frequency: input.frequency,
            starting: starting,
            showUntilCompleted: input.showUntilCompleted,
            updatedThrough: getYesterdaysDateFromDate(starting),
        };
        const generatedChores: ChoreWithoutId[] = getChoresWithoutIdFromChoreGenerator(
            newChoreGenerator,
        );
        const newIds = getNewIds(user.apartment.choresInfo.chores, '_id', generatedChores.length);
        const newChores: Chore[] = generatedChores.map((chore, index) => {
            return { ...chore, _id: newIds[index] };
        });
        newChoreGenerator.updatedThrough = getMaxDate();
        user.apartment.choresInfo.choreGenerators.push(newChoreGenerator);
        user.apartment.choresInfo.chores = user.apartment.choresInfo.chores.concat(newChores);
        setUser({ ...user });
        setInput({
            name: '',
            assigneeIds: [],
            frequency: 'Weekly',
            starting: getTodaysDate(),
            showUntilCompleted: true,
        });
        setError('');
        setTab('Summary');
    };

    return (
        <div className="create-chore-generator-cell-container">
            {!showAssignModal ? null : (
                <AssignAssigneeModal
                    setShow={setShowAssignModal}
                    mode={'Assign'}
                    assigned={input.assigneeIds}
                    handleSetAssigned={handleSetAssigneeIds}
                />
            )}
            {!showAssigneesModal ? null : (
                <AssignAssigneeModal
                    setShow={setShowAssigneesModal}
                    mode="Assignees"
                    assigned={input.assigneeIds}
                    handleSetAssigned={handleSetAssigneeIds}
                />
            )}
            <div className="create-chore-generator-cell-main-content-container">
                <div className="create-chore-generator-cell-main-content-inner">
                    <div className="create-chore-generator-cell-input-container">
                        <StyledInput
                            type="text"
                            value={input.name}
                            placeholder={'*Chore Name'}
                            name="name"
                            onChange={handleChangeName}
                        />
                    </div>
                    <div className="create-chore-generator-cell-starting-repeat-container">
                        <div className="create-chore-generator-cell-starting-container">
                            <span>{'Starting: '}</span>
                            <DateInputCell
                                state={input.starting}
                                setState={handleSetDate}
                                showReset={false}
                            />
                        </div>
                        <FrequencySelectCell<ChoreFrequency>
                            state={input.frequency}
                            setState={handleSetFrequency}
                            frequencies={choreFrequencies}
                        />
                    </div>
                    <div className="create-chore-generator-cell-assignment-container">
                        {input.assigneeIds.length < user.apartment.tenants.length ? (
                            <SimpleButton
                                onClick={() => setShowAssignModal(true)}
                                text={'Assign Chore'}
                            />
                        ) : (
                            <FauxSimpleButton text="Assign Chore" />
                        )}
                        {input.assigneeIds.length > 0 ? (
                            <SimpleButton
                                onClick={() => setShowAssigneesModal(true)}
                                text="View Assignees"
                            />
                        ) : (
                            <FauxSimpleButton text="View Assignees" />
                        )}
                    </div>
                    <div className="create-chore-generator-cell-show-container">
                        <div className="create-chore-generator-cell-show-first-line">
                            <span>{'Show until completed: '}</span>
                            <div
                                className="create-chore-generator-cell-show-toggle-container"
                                onClick={toggleShowUntilCompleted}
                            >
                                <span>{input.showUntilCompleted ? 'YES' : 'NO'}</span>
                            </div>
                        </div>
                        <div className="create-chore-generator-cell-show-second-line">
                            <span>
                                {input.showUntilCompleted
                                    ? '(These chores will remain in your chore list until they are completed, even if their date passes.)'
                                    : '(These chores will be automatically deleted when their date passes, whether or not they have been completed.)'}
                            </span>
                        </div>
                    </div>
                    <div>
                        {canCreate() ? (
                            <BiggerSimpleButton
                                onClick={createChoreGenerator}
                                text="Create Chore Set"
                            />
                        ) : (
                            <BiggerFauxSimpleButton text="Create Chore Set" />
                        )}
                    </div>
                </div>
            </div>
            <div className="create-chore-generator-error-container">
                {error.length === 0 ? null : <RedMessageCell message={error} />}
            </div>
        </div>
    );
};

export default DemoCreateChoreGeneratorCell;
