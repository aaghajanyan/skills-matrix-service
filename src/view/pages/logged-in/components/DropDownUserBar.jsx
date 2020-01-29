import React, {useState} from "react";

import {SMUserBar} from "src/view/pages/logged-in/components/SMUserBar";
import {DropdownMenu} from "src/view/pages/logged-in/components/sm-menu";


function DropDownUserBar({className, firstName, lastName, size}) {

    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    const toggleDropdownVisibility = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    return (
            <div className={className}>
                <SMUserBar
                    firstName={firstName}
                    lastName={lastName}
                    size={size}
                    onClick = {toggleDropdownVisibility}
                />
                <DropdownMenu isVisible={isDropdownVisible} onClick={toggleDropdownVisibility} key="ant-dropdown-link" />
            </div>
    );
}

export {DropDownUserBar}