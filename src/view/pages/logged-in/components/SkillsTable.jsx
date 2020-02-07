import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {SMButton, SMTable} from 'src/view/components';
import {library} from '@fortawesome/fontawesome-svg-core';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';
import {SMIcon} from '../../../components/SMIcon';
library.add(fab, far, fas);

function SkillsTable(props) {

    return (
        <React.Fragment>
            <div className="sm-component sm-component-skill">
                <div className="skills-table-header">
                    <h3 className="sm-subheading" >All Skills</h3>
                    <SMIcon className={'sm-icon-refresh'} iconType={'fas'} icon={'sync-alt'} onClick={props.refreshTable}/>
                </div>

                <SMTable
                    className="sm-table sm-table-skill"
                    columns={props.column}
                    dataSource={props.skillsDataSource}
                    pagination={{ showQuickJumper: true, defaultPageSize: 3, showSizeChanger: true, pageSizeOptions: ['3', '5', '10', '100']}}
                />
            </div>
        </React.Fragment>
    );
}

export {SkillsTable};
