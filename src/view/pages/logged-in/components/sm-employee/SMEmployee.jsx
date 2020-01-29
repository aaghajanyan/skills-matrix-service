import React, {useEffect, useState} from 'react';
import {shallowEqual, useSelector} from 'react-redux';
import {SMUserBar} from 'src/view/pages/logged-in/components/SMUserBar';
import {SMSpinner, SMTabs} from 'src/view/components';
import {Summary} from 'src/view/pages/logged-in/components/sm-employee/Summary';
import {Assessment} from 'src/view/pages/logged-in/components/sm-employee/Assessment';
import {getUser} from "src/services/usersService"

function SMEmployeeInitial(props) {

    const currentUser = useSelector(state => state.user, shallowEqual);

    const [user, setUser] = useState({
        fname:"",
        lname:""
    });

    const userIsDefined = () => user.fname !== "" && user.lname !== "";

    if (!userIsDefined() && currentUser) {
        setUser(currentUser);
    }

    useEffect(() => {
        if (user && props.match && props.match.params.id !== user.guid) {
            getUser(props.match.params.id)
                .then(fetchUser => {
                    setUser(fetchUser);
                })
                .catch(error => {
                    console.warn("Handle error", error)
                })
        }
    }, [props.match, user]);

    return (
        <SMSpinner isLoading={!userIsDefined()} className='sm-spinner' size='large'>
            <SMTabs
                className='sm-tabs'
                defaultActiveKey='Summary'
                renderTabBar={(tabBarProps, TabBar) => (
                    <div className='sm-tabs-header sm-component'>
                        {<SMUserBar
                            className='sm-user'
                            firstName={user.fname}
                            lastName={user.lname}
                            size='large'
                        />}
                        <TabBar {...tabBarProps} />
                    </div>)
                }
            >
                <Summary key='Summary'/>
                <Assessment key='Assessment'/>
                <div key='History'><h1> History </h1></div>
                <div key='About'><h1> About </h1></div>
            </SMTabs>
        </SMSpinner>
    )
}


const SMEmployee = React.memo(SMEmployeeInitial,
    () => true);

export {SMEmployee}