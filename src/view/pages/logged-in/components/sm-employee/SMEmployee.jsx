import React, {useEffect, useState} from 'react';
import {shallowEqual, useSelector} from 'react-redux';
import {SMUserBar} from 'src/view/pages/logged-in/components/SMUserBar';
import {Summary} from 'src/view/pages/logged-in/components/sm-employee/Summary';
import {Assessment} from 'src/view/pages/logged-in/components/sm-employee/Assessment';
import {About} from 'src/view/pages/logged-in/components/sm-employee/About';
import {History} from 'src/view/pages/logged-in/components/sm-employee/History';
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
    const [dataIsChanged, setDataIsChanged] = useState(false);

    const userIsDefined = () => user.fname !== '' && user.lname !== '';

    if(!userIsDefined() && currentUser) {
        setUser(currentUser);
    }

    const getDashboardAllInfo = () => {
        if(user && props.match && props.match.params.id !== user.guid) {
            getUser(props.match.params.id)
                .then(fetchUser => {
                    setUser(fetchUser);
                })
                .catch(error => {
                    console.warn('Handle error', error);
                });
        }

        user.guid && getDashboardInfo(user.guid)
            .then(dashboardInfo => {
                setDashboardInfo(dashboardInfo);
            }) .catch(error => {
                console.warn('Handle error', error);
            });
    }

    useEffect(() => {
        getDashboardAllInfo();
    }, [props.match, user, dataIsChanged]);

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
            <Summary dashboard={dashboardInfo && dashboardInfo[1]} userGuid={user.guid} key="Summary"/>
            <Assessment isChanged={dataIsChanged} renderParent={setDataIsChanged} dashboard={dashboardInfo && dashboardInfo[1]} userGuid={user.guid} key="Assessment"/>
            <History dashboard={dashboardInfo && dashboardInfo[1]} userGuid={user.guid} key="History"/>
            <About dashboard={dashboardInfo && dashboardInfo[0]} userGuid={user.guid}  user={{firstName: user.fname,lastName: user.lname}} key="About"/>
        </SMTabs>
    );
}


const SMEmployee = React.memo(SMEmployeeInitial,
    () => true);

export {SMEmployee};