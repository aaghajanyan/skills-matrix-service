import React from 'react'

function SMEmployee(prop) {
    return <h1> {prop.match.params.id} </h1>
}

export { SMEmployee }