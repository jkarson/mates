import React, { useContext, useState } from 'react';
import { DateInputCell } from '../../Common/components/DateInputCell';
import FrequencySelectCell from '../../Common/components/FrequencySelectCell';
import { UserContext, UserContextType } from '../../Common/context';
import {
    getAmountFromPercent,
    getNewId,
    getPercent,
    getTodaysDate,
    getYesterdaysDateFromDate,
    roundToHundredth,
    roundToTenth,
} from '../../Common/utilities';
import { AmountWithPercentOwed } from '../models/AmountWithPercentOwed';
import { billFrequencies, BillFrequency } from '../models/BillFrequency';
import { BillGenerator } from '../models/BillGenerator';
import { BillsTabType } from '../models/BillsTabs';
import AmountsWithPercentOwedAssignmentCell from './AmountsWithPercentOwedAssignmentCell';
import { getInitialAmountsWithPercentOwed, getTotalAssignedValue } from '../utilities';

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
    const { user, setUser } = useContext(UserContext) as UserContextType;
    const initialCreateBillGeneratorInput: CreateBillGeneratorInput = {
        name: '',
        payableTo: '',
        isPrivate: false,
        total: '0.00',
        amountsWithPercentOwed: getInitialAmountsWithPercentOwed(user),
        frequency: 'Monthly',
        starting: getTodaysDate(),
    };

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

    //BUG: THIS IS CAUSING TOTAL to go from 7.00 to 7, i.e. from total to totalValue
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
        const newBillGenerator: BillGenerator = {
            id: getNewId(user.apartment.billsInfo.billGenerators),
            name: input.name,
            payableTo: input.payableTo,
            isPrivate: input.isPrivate,
            privateTenantId: input.isPrivate ? user.tenantId : undefined,
            frequency: input.frequency,
            amountsWithPercentOwed: input.isPrivate
                ? getInitialAmountsWithPercentOwed(user).map((aWPO) => {
                      if (user.tenantId === aWPO.tenantId) {
                          return {
                              tenantId: aWPO.tenantId,
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
        user.apartment.billsInfo.billGenerators.push(newBillGenerator);
        setUser(user);
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
        </div>
    );
};

export default CreateBillGeneratorCell;
