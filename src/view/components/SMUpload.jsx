import React from "react";
import PropTypes from 'prop-types';
import {library} from '@fortawesome/fontawesome-svg-core';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';
import { PlusOutlined } from '@ant-design/icons';
import {SMIcon} from 'src/view/components';
import { toRGB } from "../../helpers/generateColor";

library.add(fab, far, fas);

function SMUpload({openSelectIconModal, iconType, ...props}) {

    const uploadButton = (
        props.icon ?
            <div className="sm-upload-icon">
                <SMIcon style={{color: toRGB(props.icon).color}} className='skills-icon' iconType={iconType} icon={props.icon}/>
                {/* <p style={{color: toRGB(props.icon).color}} className='icon-name'>{props.icon}</p> */}
                <SMIcon style={{color: toRGB(props.icon).color}} visibility={'hidden'} className='sm-skill-icon-edit-selected' iconType='far' icon='edit'/>
            </div>
            :
            <div className="sm-upload-default-container">
                <SMIcon className='sm-upload-default-icon' iconType='far' icon='image'/>
                <SMIcon className='sm-skill-icon-edit' iconType='far' icon='edit'/>
            </div>
    );

    const handleClick = (e) => {
        openSelectIconModal(e);
    }

    return (
        <button onClick={(e) => handleClick(e)} {...props}>{uploadButton}</button>
    );
}

SMUpload.propTypes = {
    className: PropTypes.string,
    name: PropTypes.string,
    children: PropTypes.string,
    openSelectIconModal: PropTypes.func,
    icon: PropTypes.string,
    iconType: PropTypes.string
};

export { SMUpload };
