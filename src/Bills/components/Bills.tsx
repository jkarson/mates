import React, { useContext, useEffect, useRef, useState } from 'react';
import { getMaxDate } from '../../Chores/components/Chores';
import { DateInputCell } from '../../Common/components/DateInputCell';
import Tabs from '../../Common/components/Tabs';
import { UserContext, UserContextType } from '../../Common/context';
import { Tenant, User } from '../../Common/models';
import { StateProps, TenantId } from '../../Common/types';
import {
    assertUnreachable,
    divideMoneyTotal,
    getAmountFromPercent,
    getNewId,
    getNextMonthDayIndicesMonthly,
    getNextMonthDayIndicesBiMonthly,
    getNextMonthDayIndicesQuarterly,
    getNextMonthDayIndicesTriAnnually,
    getNextMonthDayIndicesBiAnnually,
    getPercent,
    getTenantByTenantId,
    getTodaysDate,
    getYesterdaysDateFromDate,
    handleBlurNumericInput,
    handleFocusNumericInput,
    isPreviousDate,
    isSameDayMonthYear,
    roundToHundredth,
    roundToTenth,
    getNewIds,
} from '../../Common/utilities';
import { AmountOwed, Bill } from '../models/Bill';
import {
    billFrequencies,
    BillFrequency,
    BillGenerator,
    BillGeneratorID,
} from '../models/BillGenerator';

const tabNames = [
    'Overdue',
    'Unresolved',
    'Upcoming',
    'Future',
    'Resolved',
    'Summary',
    'Create New',
] as const;
type BillsTabType = typeof tabNames[number];

const Bills: React.FC = () => {
    const { user, setUser } = useContext(UserContext) as UserContextType;

    //TO DO: initial value can be overdue if it needs attention, Upcoming otherwise.
    //It's time to make Tab notifications. We should notify users only for shit that applies to them tho.
    const [tab, setTab] = useState<BillsTabType>('Upcoming');

    const billGenerators = user.apartment.billsInfo.billGenerators;
    const bills = user.apartment.billsInfo.bills;

    //TO DO: optimize w dep arrays
    useEffect(() => {
        updateBillsFromBillGenerators(billGenerators, user, setUser);
    });

    useEffect(() => {
        purgeOldBills(user, setUser);
    });

    const handleDeleteBill = (bill: Bill) => {
        const billIndex = bills.indexOf(bill);
        bills.splice(billIndex, 1);
        setUser({ ...user });
        //TO DO: Save to database
    };

    const handleDeleteBillSeries = (bgId: BillGeneratorID) => {
        const billsInSeries = bills.filter((bill) => bill.billGeneratorId === bgId);
        billsInSeries.forEach((bill) => bills.splice(bills.indexOf(bill), 1));
        const bgIndex = billGenerators.findIndex((bg) => bg.id === bgId);
        billGenerators.splice(bgIndex, 1);
        setUser({ ...user });
    };

    const upcomingDateLimit = getTodaysDate();
    upcomingDateLimit.setMonth(upcomingDateLimit.getMonth() + 1, upcomingDateLimit.getDate() + 1);

    const isResolved = (bill: Bill) => {
        const amounts = bill.amountsOwed.map((amountOwed) => amountOwed.amount);
        return amounts.every((amount) => amount === 0);
    };

    //TO DO: SORT

    const getPastBills = () => bills.filter((bill) => isPreviousDate(bill.date, getTodaysDate()));

    const getNotPastBills = () =>
        bills.filter((bill) => !isPreviousDate(bill.date, getTodaysDate()));

    const getOverdueBills = () => getPastBills().filter((bill) => !bill.paid);

    const getUnresolvedBills = () =>
        getPastBills().filter((bill) => bill.paid && !isResolved(bill));

    const getUpcomingBills = () =>
        getNotPastBills().filter((bill) => isPreviousDate(bill.date, upcomingDateLimit));

    const getFutureBills = () =>
        getNotPastBills().filter((bill) => !isPreviousDate(bill.date, upcomingDateLimit));

    const getResolvedBills = () => bills.filter((bill) => bill.paid && isResolved(bill));

    const getBillCell = (bill: Bill) => <BillCell bill={bill} />;

    let content: JSX.Element;
    switch (tab) {
        case 'Overdue':
            content = <div>{getOverdueBills().map(getBillCell)}</div>;
            break;
        case 'Unresolved':
            content = <div>{getUnresolvedBills().map(getBillCell)}</div>;
            break;
        case 'Upcoming':
            content = <div>{getUpcomingBills().map(getBillCell)}</div>;
            break;
        case 'Future':
            content = <div>{getFutureBills().map(getBillCell)}</div>;
            break;
        case 'Resolved':
            content = <div>{getResolvedBills().map(getBillCell)}</div>;
            break;
        case 'Summary':
            content = <BillSummaryCell />;
            break;
        case 'Create New':
            content = <CreateBillGeneratorCell setTab={setTab} />;
            break;
        default:
            assertUnreachable(tab);
    }

    return (
        <div>
            <Tabs currentTab={tab} setTab={setTab} tabNames={tabNames} />
            <DescriptionCell tab={tab} />
            <div>{content}</div>
        </div>
    );
};

interface DescriptionCellProps {
    tab: BillsTabType;
}

const DescriptionCell: React.FC<DescriptionCellProps> = ({ tab }) => {
    let content: string;
    switch (tab) {
        case 'Overdue':
            content = 'Overdue message';
            break;
        case 'Unresolved':
            content = 'Unresolved message';
            break;
        case 'Upcoming':
            content = 'Upcoming message';
            break;
        case 'Future':
            content = 'Future message';
            break;
        case 'Resolved':
            content = 'Resolved message';
            break;
        case 'Summary':
            content = 'Summary message';
            break;
        case 'Create New':
            content = 'Create New Message';
            break;
        default:
            assertUnreachable(tab);
    }
    return <p style={{ fontWeight: 'bold' }}>{content}</p>;
};

interface BillCellProps {
    bill: Bill;
}

const BillCell: React.FC<BillCellProps> = ({ bill }) => (
    <div>
        <p>{'THIS IS A BILL'}</p>
        <p>{bill.name}</p>
    </div>
);

const BillSummaryCell: React.FC = () => {
    const { user, setUser } = useContext(UserContext) as UserContextType;
    return (
        <div>
            {user.apartment.billsInfo.billGenerators.map((billGenerator) => (
                <BillGeneratorCell billGenerator={billGenerator} />
            ))}
        </div>
    );
};

interface BillGeneratorCellProps {
    billGenerator: BillGenerator;
}

const BillGeneratorCell: React.FC<BillGeneratorCellProps> = ({ billGenerator }) => {
    return (
        <div>
            <p>{'THIS IS A BILL GENERATOR CELL'}</p>
            <p>{billGenerator.name}</p>
        </div>
    );
};

interface AmountWithPercentOwed extends AmountOwed {
    percent: number;
}

interface CreateBillGeneratorInput {
    name: string;
    payableTo: string;
    isPrivate: boolean;
    amount: number;
    amountsWithPercentOwed: AmountWithPercentOwed[];
    frequency: BillFrequency;
    starting: Date;
}

interface CreateBillGeneratorCellProps {
    setTab: React.Dispatch<React.SetStateAction<BillsTabType>>;
}

const getInitialAmountsWithPercentOwed = (user: User): AmountWithPercentOwed[] => {
    const tenants = user.apartment.tenants;
    const amountsOwed = tenants.map((tenant) => ({ tenantId: tenant.id, amount: 0, percent: 0 }));
    return amountsOwed;
};

const CreateBillGeneratorCell: React.FC<CreateBillGeneratorCellProps> = ({ setTab }) => {
    const { user, setUser } = useContext(UserContext) as UserContextType;
    const initialCreateBillGeneratorInput: CreateBillGeneratorInput = {
        name: '',
        payableTo: '',
        isPrivate: false,
        amount: 0,
        amountsWithPercentOwed: getInitialAmountsWithPercentOwed(user),
        frequency: 'Monthly',
        starting: getTodaysDate(),
    };

    const [input, setInput] = useState<CreateBillGeneratorInput>(initialCreateBillGeneratorInput);

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

    const handleSetAmount = (amount: number) => {
        const newAmountsWithPercentOwed = getNewAmountsOwedByPercent(amount);
        setInput({ ...input, amount: amount, amountsWithPercentOwed: newAmountsWithPercentOwed });
    };

    const getNewAmountsOwedByPercent = (amount: number): AmountWithPercentOwed[] => {
        const newAmountsWithPercentOwed = input.amountsWithPercentOwed.map((aWPO) => {
            const newAmount = roundToHundredth(getAmountFromPercent(aWPO.percent, amount));
            return { ...aWPO, amount: newAmount };
        });
        return newAmountsWithPercentOwed;
    };

    const canCreate = () => {
        if (
            input.name &&
            input.payableTo &&
            input.amount > 0 &&
            (input.isPrivate ||
                input.amount === getTotalAssignedValue(input.amountsWithPercentOwed))
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
            privateTenant: input.isPrivate ? user.tenantId : undefined,
            frequency: input.frequency,
            amountsOwed: input.amountsWithPercentOwed.map((aWPO) => ({
                tenantId: aWPO.tenantId,
                amount: aWPO.amount,
            })),
            starting: new Date(input.starting.getTime()),
            updatedThrough: getYesterdaysDateFromDate(input.starting),
        };
        user.apartment.billsInfo.billGenerators.push(newBillGenerator);
        setUser(user);
        setInput(initialCreateBillGeneratorInput);
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
            <FrequencySelectCell state={input.frequency} setState={handleSetFrequency} />
            <DateInputCell state={input.starting} setState={handleSetStarting} showReset={true} />
            <AmountsWithPercentOwedAssignmentCell
                isPrivate={input.isPrivate}
                amountsWithPercentOwed={input.amountsWithPercentOwed}
                setAmountsWithPercentOwed={handleSetAmountsWithPercentOwed}
                total={input.amount}
                setTotal={handleSetAmount}
            />
            <CreateBillButtonCell canCreate={canCreate()} handleCreate={handleCreate} />
        </div>
    );
};

interface AmountsWithPercentOwedAssignmentCellProps {
    amountsWithPercentOwed: AmountWithPercentOwed[];
    setAmountsWithPercentOwed: (amountsWithPercentOwed: AmountWithPercentOwed[]) => void;
    total: number;
    setTotal: (total: number) => void;
    isPrivate: boolean;
}

const AmountsWithPercentOwedAssignmentCell: React.FC<AmountsWithPercentOwedAssignmentCellProps> = ({
    amountsWithPercentOwed,
    setAmountsWithPercentOwed,
    total,
    setTotal,
    isPrivate,
}) => {
    const { user } = useContext(UserContext) as UserContextType;

    const handleSetAmountWithPercentOwed = (amountWithPercentOwed: AmountWithPercentOwed) => {
        const id = amountWithPercentOwed.tenantId;
        const index = amountsWithPercentOwed.findIndex((aWPO) => aWPO.tenantId === id);
        amountsWithPercentOwed.splice(index, 1, amountWithPercentOwed);
        setAmountsWithPercentOwed(amountsWithPercentOwed);
    };

    const handleSetTotal = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = parseFloat(event.target.value);
        const total = isNaN(input) ? 0 : roundToHundredth(input);
        setTotal(total);
    };

    const handleSplitEvenly = () => {
        const numTenants = amountsWithPercentOwed.length;
        const values = divideMoneyTotal(total, numTenants);
        const currentAmountsOwed = [...amountsWithPercentOwed];
        const newAmountsWithPercentOwed: AmountWithPercentOwed[] = currentAmountsOwed.map(
            (amountOwed, index) => ({
                tenantId: amountOwed.tenantId,
                amount: values[index],
                percent: roundToTenth(getPercent(values[index], total)),
            }),
        );
        setAmountsWithPercentOwed(newAmountsWithPercentOwed);
    };

    const tenantAssignmentCells = amountsWithPercentOwed.map((aWPO) => {
        const tenant = getTenantByTenantId(user, aWPO.tenantId) as Tenant;

        const setAmount = (amount: number) => {
            const newAmount = amount;
            const newPercent = roundToTenth(getPercent(newAmount, total));
            const newAmountWithPercentOwed: AmountWithPercentOwed = {
                tenantId: aWPO.tenantId,
                amount: newAmount,
                percent: newPercent,
            };
            handleSetAmountWithPercentOwed(newAmountWithPercentOwed);
        };

        const setPercent = (percent: number) => {
            const newPercent = percent;
            const newAmount = roundToHundredth(getAmountFromPercent(newPercent, total));
            const newAmountWithPercentOwed: AmountWithPercentOwed = {
                tenantId: aWPO.tenantId,
                amount: newAmount,
                percent: newPercent,
            };
            handleSetAmountWithPercentOwed(newAmountWithPercentOwed);
        };

        return (
            <TenantAmountAssignmentCell
                name={tenant.name}
                amount={aWPO.amount}
                percent={aWPO.percent}
                setAmount={setAmount}
                setPercent={setPercent}
            />
        );
    });

    const totalInput = useRef<HTMLInputElement>(null);
    return (
        <div style={{ marginTop: 20 }}>
            <label style={{ fontWeight: 'bold' }}>
                {'Total Owed: $'}
                <input
                    ref={totalInput}
                    type="number"
                    value={total}
                    onChange={handleSetTotal}
                    onFocus={() => handleFocusNumericInput(totalInput)}
                    onBlur={() => handleBlurNumericInput(totalInput)}
                    min={0}
                    step={0.01}
                />
            </label>
            {isPrivate ? null : (
                <div>
                    {tenantAssignmentCells}
                    <button onClick={handleSplitEvenly}>{'Split Total Evenly'}</button>
                    <TotalAssignedCell
                        totalNeeded={total}
                        totalAssigned={getTotalAssignedValue(amountsWithPercentOwed)}
                    />
                </div>
            )}
        </div>
    );
};

interface TenantAmountAssignmentCellProps {
    name: string;
    amount: number;
    percent: number;
    setAmount: (amount: number) => void;
    setPercent: (percent: number) => void;
}

const TenantAmountAssignmentCell: React.FC<TenantAmountAssignmentCellProps> = ({
    name,
    amount,
    percent,
    setAmount,
    setPercent,
}) => {
    const handleChangeAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
        const amountInput = parseFloat(event.target.value);
        const newAmount = isNaN(amountInput) ? 0 : roundToHundredth(amountInput);
        setAmount(newAmount);
    };

    const handleChangePercent = (event: React.ChangeEvent<HTMLInputElement>) => {
        const percentInput = parseFloat(event.target.value);
        const newPercent = isNaN(percentInput) ? 0 : roundToTenth(percentInput);
        setPercent(newPercent);
    };

    const amountInput = useRef<HTMLInputElement>(null);
    const percentInput = useRef<HTMLInputElement>(null);

    return (
        <div>
            <p style={{ fontWeight: 'bold' }}>{name}</p>
            <label>
                {'$'}
                <input
                    ref={amountInput}
                    type="number"
                    value={amount}
                    min={0}
                    step={0.01}
                    onChange={handleChangeAmount}
                    onFocus={() => handleFocusNumericInput(amountInput)}
                    onBlur={() => handleBlurNumericInput(amountInput)}
                />
            </label>
            <label>
                {'%'}
                <input
                    ref={percentInput}
                    type="number"
                    value={percent}
                    onChange={handleChangePercent}
                    min={0}
                    max={100}
                    step={0.1}
                    onFocus={() => handleFocusNumericInput(percentInput)}
                    onBlur={() => handleBlurNumericInput(percentInput)}
                />
            </label>
        </div>
    );
};

interface TotalAssignedCellProps {
    totalNeeded: number;
    totalAssigned: number;
}

const TotalAssignedCell: React.FC<TotalAssignedCellProps> = ({ totalNeeded, totalAssigned }) => {
    const difference = roundToHundredth(totalNeeded - totalAssigned);
    return (
        <div>
            <p style={{ fontWeight: 'bold' }}>
                {'Assigned total: $'}
                <span style={difference === 0 ? { color: 'green' } : { color: 'red' }}>
                    {totalAssigned.toFixed(2)}
                </span>
            </p>
            {difference > 0 ? (
                <p>{'Please assign $' + difference.toFixed(2)}</p>
            ) : difference < 0 ? (
                <p>{'You have assigned $' + (-1 * difference).toFixed(2) + ' too much.'}</p>
            ) : null}
        </div>
    );
};

interface CreateBillButtonCellProps {
    canCreate: boolean;
    handleCreate: () => void;
}

const CreateBillButtonCell: React.FC<CreateBillButtonCellProps> = ({ canCreate, handleCreate }) => (
    <div style={{ padding: 30 }}>
        {canCreate ? <button onClick={handleCreate}>{'Create Bill'}</button> : null}
    </div>
);

//TO DO: refactor into common component w chores one? could take options as param and be of type StateProps<T>
const FrequencySelectCell: React.FC<StateProps<BillFrequency>> = ({ state, setState }) => {
    const frequencyOptions = billFrequencies.map((frequency, index) => (
        <option value={frequency} key={index}>
            {frequency}
        </option>
    ));
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedFrequency = event.target.value as BillFrequency;
        setState(selectedFrequency);
    };
    return (
        <div>
            <label>
                {'Repeat: '}
                <select value={state} onChange={handleChange}>
                    {frequencyOptions}
                </select>
            </label>
        </div>
    );
};

const updateBillsFromBillGenerators = (
    billGenerators: BillGenerator[],
    user: User,
    setUser: React.Dispatch<React.SetStateAction<User>>,
) => {
    const originalBills = user.apartment.billsInfo.bills;
    const newBills: Bill[] = [];

    // Only update user if user actually needs to be updated. This protects
    // against an infinite update loop.
    if (
        billGenerators.filter(
            (billGenerator) => !isSameDayMonthYear(billGenerator.updatedThrough, getMaxDate()),
        ).length === 0
    ) {
        return;
    }

    billGenerators.forEach((billGenerator) => {
        const { updatedThrough } = billGenerator;
        const generationStartDate = new Date(updatedThrough.getTime());
        generationStartDate.setDate(generationStartDate.getDate() + 1);
        const generatedBills = getBillsFromBillGenerator(
            billGenerator,
            originalBills.concat(newBills),
            generationStartDate,
        );
        newBills.push(...generatedBills);
        billGenerator.updatedThrough = getMaxDate();
    });
    user.apartment.billsInfo.bills.push(...newBills);
    setUser({ ...user });
    //TO DO: SAVE NEW BILLS TO DATABASE
};

const getBillsFromBillGenerator = (
    billGenerator: BillGenerator,
    previousBills: Bill[],
    generationStartDate: Date,
): Bill[] => {
    const billsWithoutId = getBillsWithoutIdFromBillGenerator(billGenerator, generationStartDate);
    const newIds = getNewIds(previousBills, billsWithoutId.length);
    const bills: Bill[] = [];
    billsWithoutId.forEach((bill, index) => bills.push({ ...bill, id: newIds[index] }));
    return bills;
};

const getBillsWithoutIdFromBillGenerator = (
    {
        id,
        name,
        payableTo,
        isPrivate,
        privateTenant,
        frequency,
        amountsOwed,
        starting,
    }: BillGenerator,
    generationStartDate: Date,
) => {
    const billDates = getDates(starting, generationStartDate, frequency);
    return billDates.map((date) => {
        return {
            billGeneratorId: id,
            name: name,
            payableTo: payableTo,
            isPrivate: isPrivate,
            privateTenant: privateTenant,
            amountsOwed: amountsOwed,
            date: date,
            paid: false,
        };
    });
};

const getDates = (starting: Date, generationStartDate: Date, frequency: BillFrequency): Date[] => {
    const dates: Date[] = [];

    let dateIterator = new Date(starting.getTime());
    const maxDate = getMaxDate();
    loop1: while (isPreviousDate(dateIterator, maxDate)) {
        if (!isPreviousDate(dateIterator, generationStartDate)) {
            dates.push(new Date(dateIterator.getTime()));
        }
        switch (frequency) {
            case 'Weekly':
                dateIterator.setDate(dateIterator.getDate() + 1);
                break;
            case 'Monthly':
                dateIterator.setMonth(...getNextMonthDayIndicesMonthly(dateIterator));
                break;
            case 'Every 2 Months':
                dateIterator.setMonth(...getNextMonthDayIndicesBiMonthly(dateIterator));
                break;
            case 'Every 3 Months':
                dateIterator.setMonth(...getNextMonthDayIndicesQuarterly(dateIterator));
                break;
            case 'Every 4 Months':
                dateIterator.setMonth(...getNextMonthDayIndicesTriAnnually(dateIterator));
                break;
            case 'Every 6 Months':
                dateIterator.setMonth(...getNextMonthDayIndicesBiAnnually(dateIterator));
                break;
            case 'Yearly':
                dateIterator.setFullYear(dateIterator.getFullYear() + 1);
                break;
            case 'Once':
                break loop1;
            default:
                assertUnreachable(frequency);
        }
    }
    return dates;
};

const purgeOldBills = (user: User, setUser: React.Dispatch<React.SetStateAction<User>>) => null;

const getTotalAssignedValue = (amountsWithPercentOwed: AmountWithPercentOwed[]) => {
    const amountsAssigned = amountsWithPercentOwed.map((aWPO) => aWPO.amount);
    let totalAssigned: number = 0;
    amountsAssigned.forEach((amount) => {
        if (!isNaN(amount)) {
            totalAssigned += amount;
        }
    });
    return roundToHundredth(totalAssigned);
};

export default Bills;
