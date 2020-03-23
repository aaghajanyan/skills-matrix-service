import React, {useEffect, useState} from 'react';
import {SMUserBar} from 'src/view/pages/logged-in/components/SMUserBar';
import {Summary} from 'src/view/pages/logged-in/components/sm-employee/Summary';
import {Assessment} from 'src/view/pages/logged-in/components/sm-employee/Assessment';
import {About} from 'src/view/pages/logged-in/components/sm-employee/About';
import {History} from 'src/view/pages/logged-in/components/sm-employee/History';
import {getUser} from 'src/services/usersService';
import {getDashboardInfo} from 'src/services/dashboardService';
import {SMTabs} from 'src/view/components';
import {getCurrentUser} from 'src/services/usersService';

import {getHistoryInfo} from 'src/services/skillsHistoryService';
import {getCategoryHistoryInfo} from 'src/services/categoriesHistoryService';

function SMEmployeeInitial(props) {

    const [user, setUser] = useState({
        fname:'',
        lname:''
    });

    const [dashboardInfo, setDashboardInfo] = useState([]);
    const [dataIsChanged, setDataIsChanged] = useState(false);
    const [skillsHistory, setSkillsHistory] = useState([]);
    const [categoriesHistory, setCategoriesHistory] = useState([]);

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
        if(user.guid){
            getDashboardInfo(user.guid)
            .then(dashboardInfo => {
                setDashboardInfo(dashboardInfo);
            }) .catch(error => {
                console.warn('Handle error', error);
            });

            getHistoryInfo(user.guid)
            .then(result => {
                setSkillsHistory(result.historySkills)
            })
            .catch(error => {
                console.log("Handle Error: ", error)
            })

            getCategoryHistoryInfo(user.guid)
            .then(result => {
                setCategoriesHistory(result.historyCategory)
            })
            .catch(error => {
                console.log("Handle Error: ", error)
            })
        }
    }

    useEffect(() => {
        getDashboardAllInfo();
    }, [props.match, user, dataIsChanged]);

    useEffect(()=> {
        getCurrentUser()
        .then(user => {
            if(user){
                setUser(user);
            }
        })
        .catch(error => {
            console.log("Handle Error: ", error)
        })
    },[])

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
            <Summary dashboard={dashboardInfo && dashboardInfo[1]} userGuid={user && user.guid} key="Summary"/>
            <Assessment isChanged={dataIsChanged} renderParent={setDataIsChanged} dashboard={dashboardInfo && dashboardInfo[1]} userGuid={user && user.guid} key="Assessment"/>
            <History skills={skillsHistory} categories={categoriesHistory} dashboard={dashboardInfo} userGuid={user && user.guid} key="History"/>
            <About dashboard={dashboardInfo && dashboardInfo[0]} userGuid={user && user.guid}  user={{firstName: user.fname,lastName: user.lname}} key="About"/>
        </SMTabs>
    );
}


const SMEmployee = React.memo(SMEmployeeInitial,
    () => true);

export {SMEmployee};