import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import BiggerSimpleButton from '../../common/components/BiggerSimpleButton';
import PageCell from '../../common/components/PageCell';
import StandardStyledText from '../../common/components/StandardStyledText';
import DemoMates from './components/DemoMates';

import './Demo.css';

const Demo: React.FC = () => {
    const [showDemo, setShowDemo] = useState(false);
    const [redirectToLogin, setRedirectToLogin] = useState(false);
    const goToDemo = () => {
        setShowDemo(true);
    };

    if (redirectToLogin) {
        return <Redirect to="/" />;
    } else if (showDemo) {
        return <DemoMates setShowDemo={setShowDemo} />;
    } else {
        return (
            <PageCell
                onHeaderClick={() => setRedirectToLogin(true)}
                content={
                    <div className="demo-about-container">
                        <div className="demo-about-text-container-one">
                            <div className="demo-about-text-inner-container">
                                <h1>{'About Mates'}</h1>
                                <StandardStyledText
                                    text={
                                        'Mates is a unique web-application designed to make roommate life easier. Mates uses a React/Typescript front-end and a Node/Express/Mongoose back-end along with a MongoDB database. The Mates demo allows you to interact with a pre-populated apartment.'
                                    }
                                />
                            </div>
                        </div>
                        <div className="demo-about-view-button-container">
                            <BiggerSimpleButton onClick={goToDemo} text={'Start Demo'} />
                        </div>
                        <div className="demo-about-text-container-two">
                            <div className="demo-about-text-inner-container">
                                <h1>{'About Me'}</h1>
                                <StandardStyledText
                                    text={
                                        'Mates was built in 2020-2021 by Jeremy Karson, a full-stack developer living in Brooklyn, New York. For questions, comments, concerns, feedback, or inquiries, please contact jeremy.karson@gmail.com.'
                                    }
                                />
                            </div>
                        </div>
                    </div>
                }
            />
        );
    }
};

export default Demo;
