import React from 'react';

import '../styles/Tabs.css';

//Extension: Add optional notifications to tab props, and render
//tabs with notification counts loaded in from server

interface TabsProps<T> {
    currentTab: T;
    setTab: React.Dispatch<React.SetStateAction<T>> | ((s: T) => void);
    tabNames: readonly T[];
}

const Tabs = <T extends string>({ currentTab, setTab, tabNames }: TabsProps<T>) => {
    const tabs = tabNames.map((name, index) => (
        <Tab
            key={index}
            name={name}
            isSelected={name === currentTab}
            handleClick={() => setTab(name)}
        />
    ));
    return <div className="tab-container">{tabs}</div>;
};

interface TabProps {
    name: string;
    isSelected: boolean;
    handleClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const Tab: React.FC<TabProps> = ({ name, isSelected, handleClick }) => (
    <div
        className="tab"
        onClick={handleClick}
        style={isSelected ? { color: 'rgb(75,0,130)' } : undefined}
    >
        <TabBody name={name} />
    </div>
);

interface TabBodyProps {
    name: string;
}

const TabBody: React.FC<TabBodyProps> = ({ name }) => {
    return <span>{name}</span>;
};

export default Tabs;
