import React, { useContext, useState } from 'react';
import { AmountWithPercentOwed } from '../models/AmountWithPercentOwed';
import { billFrequencies, BillFrequency } from '../models/BillFrequency';
import { BillsTabType } from '../models/BillsTabs';
import AmountsWithPercentOwedAssignmentCell from './AmountsWithPercentOwedAssignmentCell';
import {
    getBillsWithoutIdFromBillGeneratorWithoutId,
    getInitialAmountsWithPercentOwed,
    getTotalAssignedValue,
    initializeServerBillsInfo,
} from '../utilities';
import DateInputCell from '../../../../common/components/DateInputCell';
import FrequencySelectCell from '../../../../common/components/FrequencySelectCell';
import { MatesUserContext, MatesUserContextType } from '../../../../common/context';
import {
    getTodaysDate,
    roundToHundredth,
    getAmountFromPercent,
    roundToTenth,
    getPercent,
    getMaxDate,
    getPostOptions,
    getYesterdaysDateFromDate,
} from '../../../../common/utilities';
import { Redirect } from 'react-router-dom';
import { BiggerFauxSimpleButton } from '../../../../common/components/FauxSimpleButtons';
import { BillGeneratorWithoutId, BillWithoutId, Bill, BillGenerator } from '../models/BillsInfo';
import { BiggerSimpleButton } from '../../../../common/components/SimpleButtons';
import { StyledInput } from '../../../../common/components/StyledInputs';
import { RedMessageCell } from '../../../../common/components/ColoredMessageCells';

import '../styles/CreateBillGeneratorCell.css';

interface CreateBillGeneratorInput {
    name: string;
    payableTo: string;
    isPrivate: boolean;
    total: string;
    amountsWithPercentOwed: AmountWithPercentOwed[];
    frequency: BillFrequency;
    starting: Date;
}

interface CreateBillGeneratorCellProps {
    setTab: React.Dispatch<React.SetStateAction<BillsTabType>>;
}

const CreateBillGeneratorCell: React.FC<CreateBillGeneratorCellProps> = ({ setTab }) => {
    const { matesUser: user, setMatesUser: setUser } = useContext(
        MatesUserContext,
    ) as MatesUserContextType;
    const initialCreateBillGeneratorInput: CreateBillGeneratorInput = {
        name: '',
        payableTo: '',
        isPrivate: false,
        total: '0.00',
        amountsWithPercentOwed: getInitialAmountsWithPercentOwed(user),
        frequency: 'Monthly',
        starting: getTodaysDate(),
    };

    const [redirect, setRedirect] = useState(false);
    const [error, setError] = useState('');
    const [serverCallMade, setServerCallMade] = useState(false);

    const [input, setInput] = useState<CreateBillGeneratorInput>(initialCreateBillGeneratorInput);
    const totalValue = isNaN(parseFloat(input.total))
        ? 0
        : roundToHundredth(parseFloat(input.total));

    const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput({ ...input, name: event.target.value });
    };

    const handleChangePayableTo = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput({ ...input, payableTo: event.target.value });
    };

    const handleTogglePrivate = () => {
        setInput({ ...input, isPrivate: !input.isPrivate });
    };

    const handleSetFrequency = (frequency: BillFrequency) => {
        setInput({ ...input, frequency: frequency });
    };

    const handleSetStarting = (starting: Date) => {
        setInput({ ...input, starting: starting });
    };

    const handleSetAmountsWithPercentOwed = (amountsWithPercentOwed: AmountWithPercentOwed[]) => {
        setInput({ ...input, amountsWithPercentOwed: amountsWithPercentOwed });
    };

    const handleSetTotal = (total: string) => {
        if (total !== input.total) {
            const newTotalValue = isNaN(parseFloat(total))
                ? 0
                : roundToHundredth(parseFloat(total));
            const newAmountsWithPercentOwed = getNewAmountsOwed(newTotalValue);
            setInput({ ...input, total: total, amountsWithPercentOwed: newAmountsWithPercentOwed });
        }
    };

    const getNewAmountsOwed = (newTotal: number): AmountWithPercentOwed[] => {
        const newAmountsWithPercentOwed = input.amountsWithPercentOwed.map((aWPO) => {
            if (aWPO.percentValue > 0 && aWPO.percentValue <= 100) {
                const newAmountValue = roundToHundredth(
                    getAmountFromPercent(aWPO.percentValue, newTotal),
                );
                const newAmount = newAmountValue.toFixed(2);
                return { ...aWPO, amountValue: newAmountValue, amount: newAmount };
            } else {
                const newPercentValue = roundToTenth(getPercent(aWPO.amountValue, newTotal));
                const newPercent = newPercentValue.toFixed(1);
                return { ...aWPO, percent: newPercent, percentValue: newPercentValue };
            }
        });
        return newAmountsWithPercentOwed;
    };

    const canCreate = () => {
        if (
            input.name &&
            input.payableTo &&
            totalValue > 0 &&
            (input.isPrivate || totalValue === getTotalAssignedValue(input.amountsWithPercentOwed))
        ) {
            return true;
        }
        return false;
    };

    const handleCreate = () => {
        if (serverCallMade) {
            return;
        }
        setServerCallMade(true);
        const newBillGenerator: BillGeneratorWithoutId = {
            name: input.name,
            payableTo: input.payableTo,
            isPrivate: input.isPrivate,
            privateTenantId: input.isPrivate ? user.userId : undefined,
            frequency: input.frequency,
            amountsWithPercentOwed: input.isPrivate
                ? [
                      {
                          userId: user.userId,
                          amount: totalValue.toFixed(2),
                          amountValue: totalValue,
                          percentValue: 100,
                          percent: '100',
                      },
                  ]
                : [...input.amountsWithPercentOwed.filter((awpo) => awpo.amountValue > 0)],
            starting: new Date(input.starting.getTime()),
            updatedThrough: getYesterdaysDateFromDate(input.starting),
        };
        const generatedBills: BillWithoutId[] = getBillsWithoutIdFromBillGeneratorWithoutId(
            newBillGenerator,
        );
        newBillGenerator.updatedThrough = getMaxDate();
        const data = {
            apartmentId: user.apartment._id,
            newBillGenerator: newBillGenerator,
            generatedBills: generatedBills,
        };
        const options = getPostOptions(data);
        fetch('/mates/createBillGenerator', options)
            .then((response) => response.json())
            .then((json) => {
                setServerCallMade(false);
                const { authenticated, success } = json;
                if (!authenticated) {
                    setRedirect(true);
                    return;
                }
                if (!success) {
                    setError('Sorry, the bill series could not be created');
                    return;
                }

                const { billsInfo } = json;
                initializeServerBillsInfo(billsInfo);
                setUser({
                    ...user,
                    apartment: {
                        ...user.apartment,
                        billsInfo: {
                            bills: billsInfo.bills as Bill[],
                            billGenerators: billsInfo.billGenerators as BillGenerator[],
                        },
                    },
                });
                setError('');
                setInput(initialCreateBillGeneratorInput);
                setTab('Summary');
            })
            .catch(() => setError('Sorry, our server seems to be down.'));
    };

    if (redirect) {
        return <Redirect to="/" />;
    }

    return (
        <div className="create-bill-generator-cell-container">
            <div className="create-bill-generator-cell-name-container">
                <StyledInput
                    type="text"
                    value={input.name}
                    onChange={handleChangeName}
                    placeholder={'*Name of bill'}
                />
            </div>
            <div className="create-bill-generator-cell-recipient-container">
                <StyledInput
                    type="text"
                    value={input.payableTo}
                    onChange={handleChangePayableTo}
                    placeholder={'*Bill recipient'}
                />
            </div>
            <div className="create-bill-generator-cell-frequency-date-container">
                <div className="create-bill-generator-cell-date-container">
                    <span>{'Starting: '}</span>
                    <DateInputCell
                        state={input.starting}
                        setState={handleSetStarting}
                        showReset={false}
                    />
                </div>
                <FrequencySelectCell<BillFrequency>
                    state={input.frequency}
                    setState={handleSetFrequency}
                    frequencies={billFrequencies}
                />
            </div>
            <div className="create-bill-generator-cell-private-container">
                <div className="create-bill-generator-cell-clickable-line-container">
                    <span>{'This bill is '}</span>
                    <div
                        className="create-bill-generator-cell-clickable-container"
                        onClick={handleTogglePrivate}
                    >
                        <span>{input.isPrivate ? 'Private' : 'Public'}</span>
                    </div>
                </div>
                {!input.isPrivate ? null : (
                    <div className="create-bill-generator-cell-private-description-container">
                        <span>
                            {
                                '(Private bills will not be shown to your roommates. Only you can pay private bills.)'
                            }
                        </span>
                    </div>
                )}
            </div>

            <div className="create-bill-generator-cell-awpoac-container">
                <AmountsWithPercentOwedAssignmentCell
                    isPrivate={input.isPrivate}
                    amountsWithPercentOwed={input.amountsWithPercentOwed}
                    setAmountsWithPercentOwed={handleSetAmountsWithPercentOwed}
                    total={input.total}
                    totalValue={totalValue}
                    setTotal={handleSetTotal}
                />
            </div>
            <div className="create-bill-generator-cell-create-button-container">
                {canCreate() ? (
                    <BiggerSimpleButton onClick={handleCreate} text={'Create Bill'} />
                ) : (
                    <BiggerFauxSimpleButton text="Create Bill" />
                )}
                <div className="create-bill-generator-cell-error-container">
                    {error.length === 0 ? null : <RedMessageCell message={error} />}
                </div>
            </div>
        </div>
    );
};

export default CreateBillGeneratorCell;
