import React from 'react';

interface TabsProps<T> {
    currentTab: T;
    setTab: React.Dispatch<React.SetStateAction<T>> | ((s: T) => void);
    tabNames: readonly T[];
}

const Tabs = <T extends string>({ currentTab, setTab, tabNames }: TabsProps<T>) => {
    const tabs = tabNames.map((s) => (
        <Tab key={s} name={s} isSelected={s === currentTab} handleClick={() => setTab(s)} /> //assumes name is a good key?
    ));
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 10,
            }}
        >
            {tabs}
        </div>
    );
};

interface TabProps {
    name: string;
    isSelected: boolean;
    handleClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const Tab: React.FC<TabProps> = ({ name, isSelected, handleClick }) => (
    <button onClick={handleClick} style={isSelected ? { color: 'purple' } : { color: 'pink' }}>
        {name}
    </button>
);

export default Tabs;
