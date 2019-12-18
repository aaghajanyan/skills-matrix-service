import React, { useState, useEffect } from 'react';
import { get } from 'client/lib/axiosWrapper';
import { SMUserBar } from 'components/common/SMUserBar/SMUserBar';
import {SMSpinner} from 'components/common/SMSpinner/SMSpinner'

function SMEmployee(props) {

    const [user, setUser] = useState(null)
    useEffect(() => {
        get({ url: `users/${props.match.params.id}` })
            .then(result => {
                setUser(result.data)
            })
            .catch(error => {
                //TODO handle error
            })
    }, [props.match.params.id])

    return (
        <SMSpinner isLoading={!user}>
            {user && <SMUserBar firstName={user.fname} lastName={user.lname}/>}
        </SMSpinner>
    )
}

export { SMEmployee }