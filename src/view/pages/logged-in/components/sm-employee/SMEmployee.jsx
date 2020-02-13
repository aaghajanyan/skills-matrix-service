import React, {useEffect, useState} from 'react';
import {shallowEqual, useSelector} from 'react-redux';
import {SMUserBar} from 'src/view/pages/logged-in/components/SMUserBar';
import {Summary} from 'src/view/pages/logged-in/components/sm-employee/Summary';
import {Assessment} from 'src/view/pages/logged-in/components/sm-employee/Assessment';
import {getUser} from 'src/services/usersService';
import {getDashboardInfo} from 'src/services/dashboardService';
import {SMTabs} from 'src/view/components';
function SMEmployeeInitial(props) {

    const currentUser = useSelector(state => state.user, shallowEqual);

    const [user, setUser] = useState({
        fname:'',
        lname:''
    });

    const [dashboardInfo, setDashboardInfo] = useState(null);

    const userIsDefined = () => user.fname !== '' && user.lname !== '';

    if(!userIsDefined() && currentUser) {
        setUser(currentUser);
    }

    useEffect(() => {
        if(user && props.match && props.match.params.id !== user.guid) {
            getUser(props.match.params.id)
                .then(fetchUser => {
                    setUser(fetchUser);
                })
                .catch(error => {
                    console.warn('Handle error', error);
                });
        }
        if(dashboardInfo === null){
            getDashboardInfo()
               .then(dashboardInfo => {
                    setDashboardInfo(dashboardInfo);
                }) .catch(error => {
                    console.warn('Handle error', error);
                });
        }
    }, [props.match, user]);

    return (
        <SMTabs
            className="sm-tabs"
            defaultActiveKey="Summary"
            userData={user}
            renderTabBar={(tabBarProps, TabBar) => (
                <div className="sm-tabs-header sm-component">
                    {<SMUserBar
                        className="sm-user"
                        firstName={user && user.fname}
                        lastName={user && user.lname}
                        size="large"
                    />}
                    <TabBar {...tabBarProps} />
                </div>)
            }
        >
            <Summary dashboard={dashboardInfo} userGuid={user.guid} key="Summary"/>
            <Assessment dashboard={dashboardInfo} userGuid={user.guid} key="Assessment"/>
            <div key="History"><h1> History </h1></div>
            <div key="About"><h1> About </h1></div>
        </SMTabs>
    );
}


const SMEmployee = React.memo(SMEmployeeInitial,
    () => true);

export {SMEmployee};