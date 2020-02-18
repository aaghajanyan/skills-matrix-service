import React, {useState} from 'react';

import {DropdownMenu} from 'src/view/pages/logged-in/components/sm-menu';


function DropDownUserBar({className, firstName, lastName, size}) {

    const SMUser = {
        firstName: firstName,
        lastName: lastName,
        size: size
    };


    return (
        <div className={className}>
            <DropdownMenu SMuser={SMUser} key="ant-dropdown-link" />
        </div>
    );
}

export {DropDownUserBar};