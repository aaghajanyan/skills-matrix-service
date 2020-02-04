import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {SMButton, SMTable} from 'src/view/components';
import {library} from '@fortawesome/fontawesome-svg-core';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {SMIcon} from '../../../components/SMIcon';
library.add(fab, far, fas);

function SkillsTable(props) {

    const dispatch = useDispatch()

    return (
        <React.Fragment>
            <div className="sm-component">
                <div className="skills-table-header">
                    <h3 className="sm-subheading" >All Skills</h3>
                    <SMIcon className={'refresh-btn'} iconType={'fas'} icon={'sync-alt'} style={{width: '25px', height: '25px'}} onClick={props.refreshTable}/>
                </div>

                <SMTable
                    className="sm-table"
                    columns={props.column}
                    dataSource={props.skillsLists}
                    pagination={true}
                />
            </div>
        </React.Fragment>
    );
}

export {SkillsTable};
