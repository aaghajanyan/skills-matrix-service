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
                            className='home_tabs-header-user-bar'
                            firstName='Admin'
                            lastName='Admin'
                            colorCode={15551}
                            size={55} />
                        <TabBar {...tabBarProps} />
                    </div>)
                }
                defaultActiveKey='Summary'
            >
                <Summary key='Summary' />
                <Assessment key='Assessment' />
                <div key='History'> <h1> History </h1> </div>
                <div key='About'> <h1> About </h1> </div>
            </SMTabs>
        </div>
    );
}

export { Home };
