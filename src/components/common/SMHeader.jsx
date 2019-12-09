import React from 'react';
import logo from '../../assets/images/instigate.svg'

function SMHeader({title}) {
    return (
        <React.Fragment>
            <img className="sm-header-icon" src={logo} alt="instigate mobile logo"/>
            <span className="sm-header-title"> { title } </span>
        </React.Fragment>
    )
}

export { SMHeader };