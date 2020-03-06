import React, {useState} from "react";

import {library} from '@fortawesome/fontawesome-svg-core';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';
import { PlusOutlined } from '@ant-design/icons';

library.add(fab, far, fas);

function SMUpload({openSelectIconModal, ...props}) {

    const uploadButton = (
        <div className="sm-upload-plus">
            <PlusOutlined/>
            <div className="ant-upload-text">Select icon</div>
        </div>
      );

    const handleClick = (e) => {
        openSelectIconModal(e);
    }

    return (
        <button onClick={(e) => handleClick(e)} {...props}>{uploadButton}</button>
    );
}

export { SMUpload };
