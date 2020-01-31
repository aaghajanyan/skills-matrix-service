import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {SMButton, SMTable} from 'src/view/components';
import {SMSkillBar} from '../components/SMSkillBar';
import {get} from '../../../../services/client/axiosWrapper';
import {library} from '@fortawesome/fontawesome-svg-core';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {Tag} from 'antd'; //TODO : move to common components
import {getSkills} from 'src/services/skillsService';
import { useService } from '../../../../hooks/common';

library.add(fab, far, fas);

function SkillsTable(props) {

    const dispatch = useDispatch()

    console.log("010101010101", props.skillsLists)
    console.log("030303030303", props)
    console.log("020202022002", props.column)
    return (
        <React.Fragment>
            <div className="sm-component">
                <div className="skills-table-header">
                    <h3 className="sm-subheading" >All Skills</h3>
                    <SMButton className="sm-button"> Add Skill </SMButton>
                </div>
                <SMTable
                    className="sm-table"
                    columns={props.column}
                    dataSource={props.skillsLists}
                    pagination={false}
                />
            </div>
        </React.Fragment>
    );
}

export {SkillsTable};
