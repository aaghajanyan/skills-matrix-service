import React, { useState, useEffect } from 'react';
import { get } from 'client/lib/axiosWrapper';
import { SMUserBar } from '../SMUserBar';
import {SMSpinner} from 'components/common/SMSpinner/SMSpinner';

import { Summary } from './Summary';
import { SMTabs } from 'components/common/SMTabs/SMTabs';
import { Assessment } from './Assessment/Assessment';

function SMEmployee(props) {

    const [user, setUser] = useState(props.match ? null : {fname: 'Admin', lname: 'Admin' })

    useEffect(() => {
        !user && get({ url: `users/${props.match.params.id}` })
            .then(result => {
                setUser(result.data)
            })
            .catch(error => {
                //TODO handle error
            })
    }, [])

    return (
        <SMSpinner isLoading={!user} className='sm-spinner' size='large'>
            <SMTabs
                defaultActiveKey='Summary'
                renderTabBar={(tabBarProps, TabBar) => (
                    <div className='home_tabs-header'>
                        <SMUserBar
                            className='home_tabs-header-user-bar'
                            firstName={user.fname}
                            lastName={user.lname}
                            colorCode={15551}
                            size={55} />
                        <TabBar {...tabBarProps} />
                    </div>)
                }
        >
            <Summary key='Summary' />
            <Assessment key='Assessment' />
            <div key='History'> <h1> History </h1> </div>
            <div key='About'> <h1> About </h1> </div>
            </SMTabs>
        </SMSpinner>
    )
}

export { SMEmployee }