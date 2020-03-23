import React from 'react';
import {Row, Col} from 'antd';
import {SMList} from '../../../../components/SMList';
import {SMDictionary} from '../../../../components/SMDictionary';
import {SMUserBar} from 'src/view/pages/logged-in/components/SMUserBar';
import moment from 'moment';

function About(props) {


  const userInfo = () => {
      return props.dashboard && ({
        email: props.dashboard.email,
        started_to_work_date: moment(props.dashboard['started_to_work_date']).format("MMM Do YY"),
        branch: props.dashboard.branch.name,
        position: props.dashboard.position.name})
    };

   return (
    <React.Fragment>
            <Row className="sm-about-main sm-component">
                <Col span={8}>
                    <SMUserBar
                            className="sm-user"
                            firstName={props.user.firstName}
                            lastName={props.user.lastName}
                            size="large"
                        />
                        <Col span={18}>
                        {props.dashboard && <h1 className="sm-about-header-name" >{`${props.dashboard.fname} ${props.dashboard.lname}`}</h1>}
                        </Col>
                    <SMDictionary data={userInfo()} />
                </Col>
                <Col span={16} >
                    <Col span={24}>
                        <h3 className="sm-about-title sm-subheading">About</h3>
                    </Col>
                    <Col span={18}>
                        <SMList  header="Assessment history" path="skillMark" data={['Coming Soon']} />
                    </Col>
                </Col>
            </Row>
    </React.Fragment>
   )
}

export {About};