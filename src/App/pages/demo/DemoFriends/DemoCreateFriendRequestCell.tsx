import React from 'react';

import './DemoCreateFriendRequestCell.css';

const DemoCreateFriendRequestCell: React.FC = () => {
    return (
        <div>
            <div className="demo-create-friend-request-cell-text-container">
                <h1>{'Sorry, this feature is not available in demo mode.'}</h1>
            </div>
        </div>
    );
};

export default DemoCreateFriendRequestCell;
