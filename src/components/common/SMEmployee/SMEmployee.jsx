import React from 'react'

function SMEmployee(props) {
    return <h1> {props.location.state.data.email} </h1>
}

export { SMEmployee }