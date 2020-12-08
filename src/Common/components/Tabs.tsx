import React from 'react';
import '../styles/Tabs.css';
import NotificationCell from './NotificationCell';

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
    handleClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    notifications?: number;
}

const Tab: React.FC<TabProps> = ({ name, isSelected, handleClick, notifications }) => (
    <div
        className="tab"
        onClick={handleClick}
        style={isSelected ? { color: 'purple' } : { color: 'pink' }}
    >
        <TabBody name={name} notifications={notifications} />
    </div>
);

interface TabBodyProps {
    name: string;
    notifications?: number;
}

//TO DO: reorganize as red circle white letter,
// elevated off the upper right corner
// note: so all we have to do for tabs is pass stateful
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
