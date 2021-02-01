import React, { useContext, useState } from 'react';
import DateInputCell from '../../../common/components/DateInputCell';
import FrequencySelectCell from '../../../common/components/FrequencySelectCell';
import { MatesUserContext, MatesUserContextType } from '../../../common/context';
import {
    getTodaysDate,
    roundToHundredth,
    getAmountFromPercent,
    roundToTenth,
    getPercent,
    getYesterdaysDateFromDate,
    getMaxDate,
} from '../../../common/utilities';
import AmountsWithPercentOwedAssignmentCell from '../../mates/Bills/components/AmountsWithPercentOwedAssignmentCell';
import { AmountWithPercentOwed } from '../../mates/Bills/models/AmountWithPercentOwed';
import { BillFrequency, billFrequencies } from '../../mates/Bills/models/BillFrequency';
import {
    BillGeneratorWithoutId,
    BillWithoutId,
    Bill,
    BillGenerator,
} from '../../mates/Bills/models/BillsInfo';
import { BillsTabType } from '../../mates/Bills/models/BillsTabs';
import {
    getInitialAmountsWithPercentOwed,
    getTotalAssignedValue,
    getBillsWithoutIdFromBillGeneratorWithoutId,
} from '../../mates/Bills/utilities';
import { getNewId, getNewIds } from '../utilities';

interface CreateBillGeneratorInput {
    name: string;
    payableTo: string;
    isPrivate: boolean;
    total: string;
    amountsWithPercentOwed: AmountWithPercentOwed[];
    frequency: BillFrequency;
    starting: Date;
}

interface DemoCreateBillGeneratorCellProps {
    setTab: React.Dispatch<React.SetStateAction<BillsTabType>>;
}

const DemoCreateBillGeneratorCell: React.FC<DemoCreateBillGeneratorCellProps> = ({ setTab }) => {
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
        const newBillGenerator: BillGeneratorWithoutId = {
            name: input.name,
            payableTo: input.payableTo,
            isPrivate: input.isPrivate,
            privateTenantId: input.isPrivate ? user.userId : undefined,
            frequency: input.frequency,
            amountsWithPercentOwed: input.isPrivate
                ? getInitialAmountsWithPercentOwed(user).map((aWPO) => {
                      if (user.userId === aWPO.userId) {
                          return {
                              userId: aWPO.userId,
                              amount: totalValue.toFixed(2),
                              amountValue: totalValue,
                              percentValue: 100,
                              percent: '100',
                          };
                      } else {
                          return aWPO;
                      }
                  })
                : [...input.amountsWithPercentOwed],
            starting: new Date(input.starting.getTime()),
            updatedThrough: getYesterdaysDateFromDate(input.starting),
        };
        const generatedBills: BillWithoutId[] = getBillsWithoutIdFromBillGeneratorWithoutId(
            newBillGenerator,
        );
        newBillGenerator.updatedThrough = getMaxDate();
        const newBillGeneratorId = getNewId(user.apartment.billsInfo.billGenerators, '_id');
        const newBillGeneratorWithId: BillGenerator = {
            ...newBillGenerator,
            _id: newBillGeneratorId,
        };
        const generatedBillsIds = getNewIds(
            user.apartment.billsInfo.bills,
            '_id',
            generatedBills.length,
        );
        const generatedBillsWithId: Bill[] = generatedBills.map((bill, index) => {
            const billId = generatedBillsIds[index];
            return { ...bill, _id: billId, billGeneratorId: newBillGeneratorId };
        });
        user.apartment.billsInfo.billGenerators.push(newBillGeneratorWithId);
        user.apartment.billsInfo.bills = user.apartment.billsInfo.bills.concat(
            generatedBillsWithId,
        );
        setUser({ ...user });
        setError('');
        setInput(initialCreateBillGeneratorInput);
        setTab('Summary');
    };

    return (
        <div>
            <label>
                {'Name: '}
                <input
                    type="text"
                    value={input.name}
                    onChange={handleChangeName}
                    placeholder={'e.g., Electricity'}
                />
            </label>
            <br />
            <label>
                {'Payable To: '}
                <input
                    type="text"
                    value={input.payableTo}
                    onChange={handleChangePayableTo}
                    placeholder={'e.g., Con Edison'}
                />
            </label>
            <br />
            <br />
            <label>
                {
                    'Private bills will not be shown to your roommates. Only you can pay private bills.'
                }
                <p>
                    {'This bill is '}
                    <span style={{ fontWeight: 'bold' }}>
                        {input.isPrivate ? 'Private' : 'Public'}
                    </span>
                </p>
            </label>
            <button onClick={handleTogglePrivate}>
                {input.isPrivate ? 'Make Public' : 'Make Private'}
            </button>
            <br />
            <br />
            <br />
            <FrequencySelectCell<BillFrequency>
                state={input.frequency}
                setState={handleSetFrequency}
                frequencies={billFrequencies}
            />
            <DateInputCell state={input.starting} setState={handleSetStarting} showReset={true} />
            <AmountsWithPercentOwedAssignmentCell
                isPrivate={input.isPrivate}
                amountsWithPercentOwed={input.amountsWithPercentOwed}
                setAmountsWithPercentOwed={handleSetAmountsWithPercentOwed}
                total={input.total}
                totalValue={totalValue}
                setTotal={handleSetTotal}
            />
            <div style={{ padding: 30 }}>
                {canCreate() ? <button onClick={handleCreate}>{'Create Bill'}</button> : null}
            </div>
            {error.length === 0 ? null : <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default DemoCreateBillGeneratorCell;
