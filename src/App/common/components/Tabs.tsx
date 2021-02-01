import React from 'react';
import NotificationCell from './NotificationCell';

import '../styles/Tabs.css';

interface TabsProps<T> {
    currentTab: T;
    setTab: React.Dispatch<React.SetStateAction<T>> | ((s: T) => void);
    tabNames: readonly T[];
}

const Tabs = <T extends string>({ currentTab, setTab, tabNames }: TabsProps<T>) => {
    const tabs = tabNames.map((s) => (
        <Tab key={s} name={s} isSelected={s === currentTab} handleClick={() => setTab(s)} /> //assumes name is a good key?
    ));
    return <div className="tab-container">{tabs}</div>;
};

interface TabProps {
    name: string;
    isSelected: boolean;
    handleClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    notifications?: number;
}

const Tab: React.FC<TabProps> = ({ name, isSelected, handleClick, notifications }) => (
    <div
        className="tab"
        onClick={handleClick}
        style={isSelected ? { color: 'rgb(75,0,130)' } : undefined}
    >
        <TabBody name={name} notifications={notifications} />
    </div>
);

interface TabBodyProps {
    name: string;
    notifications?: number;
}

// EXTENSION: reorganize as red circle white letter,
// elevated off the upper right corner
// note: so all we must do for tabs is pass stateful
// notification #s (populated live by server?) to each tab
const TabBody: React.FC<TabBodyProps> = ({ name, notifications }) => {
    if (notifications && notifications > 0) {
        return (
            <div style={{ display: 'flex' }}>
                <span>{name}</span>
                <NotificationCell notifications={notifications} />
            </div>
        );
    } else {
        return <div>{name}</div>;
    }
};

export default Tabs;
