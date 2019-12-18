import React from 'react'

function SMEmployee(props) {
    return <h1> {`Users id: ${props.match.params.id}`} </h1>
}

export { SMEmployee }