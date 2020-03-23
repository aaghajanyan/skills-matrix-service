import React from 'react';
import {Row, Col} from 'antd';
import PropTypes from 'prop-types';


function SMDictionary(props) {

    const renderAbout = () => {
        return props.data && (
            <div className="sm-about-user">
                <Col>
                    <Row className="sm-about-row"><Col span={12}><span>Email: </span></Col><Col span={12}>{props.data.email}</Col></Row>
                    <Row className="sm-about-row"><Col span={12}><span>Branch: </span></Col><Col span={12}>{props.data.branch}</Col></Row>
                    <Row className="sm-about-row"><Col span={12}><span>Started to work: </span></Col><Col span={12}>{props.data.started_to_work_date}</Col></Row>
                    <Row className="sm-about-row"><Col span={12}><span>Position: </span></Col><Col span={12}>{props.data.position}</Col></Row>
                </Col>
            </div>
        )
    }

    return (
        <Row>
            <Col span={24}>
                {renderAbout()}
            </Col>
        </Row>
    )
}

SMDictionary.propTypes = {
    data: PropTypes.shape({
        email: PropTypes.string,
        firstName: PropTypes.string,
        lastName: PropTypes.string,
        started_to_work_date: PropTypes.string,
        branch: PropTypes.string,
        position: PropTypes.string
    }),
};

export {SMDictionary};