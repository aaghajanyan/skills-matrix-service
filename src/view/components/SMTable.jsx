
import React from 'react';
import {Table} from 'antd';
import PropTypes from 'prop-types';

function SMTable(props) {
    return <Table {...props} />;
}

SMTable.propTypes = {
    className: PropTypes.string,
    id: PropTypes.string,
    onRow: PropTypes.func,
    loading: PropTypes.bool,
    columns: PropTypes.arrayOf(PropTypes.object),
    showHeader: PropTypes.bool,
    dataSource: PropTypes.arrayOf(PropTypes.object),
    scroll: PropTypes.object,
    pagination: PropTypes.object,
    rowSelection: PropTypes.object
};

export {SMTable};