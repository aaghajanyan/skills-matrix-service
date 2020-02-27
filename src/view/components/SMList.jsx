import React from 'react';
import {List, Row, Col} from 'antd';
import PropTypes from 'prop-types';

function SMList(props) {

    return <List
    header={props.header ? <h2 className="sm-about-header" >{props.header}</h2> : <></>}
    dataSource={props.data}
    renderItem={item => {
        return (
            <>
                {props.path ?
                    <Row className="sm-about-left">
                        <Col span={24}>
                            {item}
                        </Col>
                    </Row>
                :
                    <div className={props.className}> {item} </div>}
            </>
    )}}
  />;
}

SMList.propTypes = {
    className: PropTypes.string,
    header: PropTypes.string,
    data: PropTypes.array,
    path: PropTypes.string,
};

export {SMList};