import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import DateInputCell from '../../../../common/components/DateInputCell';
import FrequencySelectCell from '../../../../common/components/FrequencySelectCell';
import { MatesUserContext, MatesUserContextType } from '../../../../common/context';
import { UserId } from '../../../../common/models';
import {
    getTodaysDate,
    getYesterdaysDateFromDate,
    getMaxDate,
    getPostOptions,
} from '../../../../common/utilities';
import { choreFrequencies, ChoreFrequency } from '../models/ChoreFrequency';
import { ChoreGeneratorWithoutId, ChoreWithoutId } from '../models/ChoresInfo';
import { ChoresTabType } from '../models/ChoresTabs';
import {
    getChoresWithoutIdFromChoreGeneratorWithoutId,
    initializeServerChoresInfo,
} from '../utilities';
import AssignAssigneeModal from './AssignAssigneeModal';

import '../styles/CreateChoreGeneratorCell.css';
import { BiggerSimpleButton, SimpleButton } from '../../../../common/components/SimpleButtons';
import {
    FauxSimpleButton,
    BiggerFauxSimpleButton,
} from '../../../../common/components/FauxSimpleButtons';
import { RedMessageCell } from '../../../../common/components/ColoredMessageCells';
import { StyledInput } from '../../../../common/components/StyledInputs';

interface CreateChoreGeneratorInput {
    name: string;
    assigneeIds: UserId[];
    frequency: ChoreFrequency;
    starting: Date;
    showUntilCompleted: boolean;
}

interface CreateChoreGeneratorCellProps {
    setTab: React.Dispatch<React.SetStateAction<ChoresTabType>>;
}

const CreateChoreGeneratorCell: React.FC<CreateChoreGeneratorCellProps> = ({ setTab }) => {
    const { matesUser: user, setMatesUser: setUser } = useContext(
        MatesUserContext,
    ) as MatesUserContextType;

    const [redirect, setRedirect] = useState(false);
    const [error, setError] = useState('');
    const [serverCallMade, setServerCallMade] = useState(false);

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
            setInput({ ...input, name: value.trimStart() });
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
        if (serverCallMade) {
            return;
        }
        setServerCallMade(true);
        const starting = new Date(input.starting.getTime());
        input.name = input.name.trim();

        const newChoreGenerator: ChoreGeneratorWithoutId = {
            name: input.name,
            assigneeIds: [...input.assigneeIds],
            frequency: input.frequency,
            starting: starting,
            showUntilCompleted: input.showUntilCompleted,
            updatedThrough: getYesterdaysDateFromDate(starting),
        };
        const generatedChores: ChoreWithoutId[] = getChoresWithoutIdFromChoreGeneratorWithoutId(
            newChoreGenerator,
        );
        newChoreGenerator.updatedThrough = getMaxDate();
        const data = {
            apartmentId: user.apartment._id,
            newChoreGenerator: newChoreGenerator,
            generatedChores: generatedChores,
        };
        const options = getPostOptions(data);
        fetch('/mates/createChoreGenerator', options)
            .then((response) => response.json())
            .then((json) => {
                setServerCallMade(false);
                const { authenticated, success } = json;
                if (!authenticated) {
                    setRedirect(true);
                    return;
                }
                if (!success) {
                    setError('Sorry, the chore series could not be created');
                    return;
                }

                const { choresInfo } = json;
                const formattedChoresInfo = initializeServerChoresInfo(choresInfo);
                setUser({
                    ...user,
                    apartment: { ...user.apartment, choresInfo: formattedChoresInfo },
                });
                setInput({
                    name: '',
                    assigneeIds: [],
                    frequency: 'Weekly',
                    starting: getTodaysDate(),
                    showUntilCompleted: true,
                });
                setError('');
                setTab('Summary');
            })
            .catch(() => setError('Sorry, our server seems to be down.'));
    };

    if (redirect) {
        return <Redirect to="/" />;
    }

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

export default CreateChoreGeneratorCell;
