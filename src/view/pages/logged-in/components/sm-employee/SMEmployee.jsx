import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { get } from 'client/lib/axiosWrapper';
import { SMUserBar } from '../SMUserBar';
import { SMTabs } from 'view/components';
import { Summary } from './Summary';
import { Assessment } from './Assessment';

function SMEmployee(props) {

    const currentUser = useSelector(state => state.CurrentUser);
    const [user, setUser] = useState(currentUser);

    if (!user && currentUser) {
        setUser(currentUser);
    }

    useEffect(() => {
        if (user && props.match && props.match.params.id !== user.data.guid) {
            get({ url: `users/${props.match.params.id}` })
                .then(result => {
                    setUser(result);
                })
                .catch(error => {
                    user.data = {};
                })
        }
    }, [])

    return (
            <SMTabs
                className='sm-tabs'
                defaultActiveKey='Summary'
                userData={user}
                renderTabBar={(tabBarProps, TabBar) => (
                    <div className='sm-tabs-header sm-component'>
                        <SMUserBar
                            className='sm-user'
                            firstName={user && user.data.fname}
                            lastName={user && user.data.lname}
                            size='large'
                        />
                        <TabBar {...tabBarProps} />
                    </div>)
                }
            >
                <Summary key='Summary' />
                <Assessment key='Assessment' />
                <div key='History'> <h1> History </h1> </div>
                <div key='About'> <h1> About </h1> </div>
            </SMTabs>
    )
}

export { SMEmployee }