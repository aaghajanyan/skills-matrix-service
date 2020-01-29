import React from 'react';
import {Tabs} from 'antd';
import PropTypes from "prop-types";
import { SMSpinner } from 'view/components';
const { TabPane } = Tabs;

function SMTabs({ children, ...rest }) {

    const renderItems = () => {
        return React.Children.map(children, item => {
            return (
                <TabPane tab={item.key} key={item.key}>
                    <SMSpinner isLoading={!rest.userData} className='sm-spinner' size='large'>
                        {item}
                    </SMSpinner>
                </TabPane>
            )
        })
    };

    return (
        <Tabs {...rest}>
            {renderItems()}
        </Tabs>
    )
}

SMTabs.propTypes = {
    className: PropTypes.string,
    components: PropTypes.arrayOf(PropTypes.element),
    defaultActiveKey: PropTypes.string,
    onChange: PropTypes.func,
    renderTabBar: PropTypes.func
};

export { SMTabs };