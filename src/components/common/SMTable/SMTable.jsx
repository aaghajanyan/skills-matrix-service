
import React from 'react';
import { Table } from 'antd';
import PropTypes from 'prop-types';

function SMTable(props) {
    return <Table {...props} />;
}

SMTable.propTypes = {
    className: PropTypes.string,
    id: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string,
    style: PropTypes.string,
    htmlType: PropTypes.string,
    href: PropTypes.string,
    loading: PropTypes.bool,
    onClick: PropTypes.func,
    target: PropTypes.string,
};

export { SMTable };