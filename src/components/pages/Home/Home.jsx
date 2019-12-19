import React from 'react';
import { Summary } from './Summary'
import { SMTabs } from 'components/common/SMTabs/SMTabs'
import { Assessment } from './Assessment/Assessment'
import { SMUserBar } from 'components/common/SMUserBar/SMUserBar'

function Home() {
    return (
        <div className='home-container'>
            <SMTabs
                renderTabBar={(tabBarProps, TabBar) => (
                    <div className='home_tabs-header'>
                        <SMUserBar
                            className='aaa'
                            firstName='Admin'
                            lastName='Admin'
                            colorCode={15551}
                            size={64} />
                        <TabBar {...tabBarProps} />
                    </div>)
                }
                defaultActiveKey='summary'
            >
                <Summary key='SUMMARY' />
                <Assessment key='ASSESSMENT' />
                <div key='HISTORY'> <h1> HISTORY </h1> </div>
                <div key='ABOUT'> <h1> ABOUT </h1> </div>
            </SMTabs>
        </div>
    );
}

export { Home };
