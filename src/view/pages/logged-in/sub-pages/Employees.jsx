import React, { useState, useEffect } from 'react';
import { post, get } from 'client/lib/axiosWrapper';
import { emailValidator } from 'helpers/validators';
import { messages } from 'constants';
import { EmployeesTable } from 'view/pages/logged-in/components'
import { SMUserBar } from '../components';

import { SMModal, SMForm, SMButton, SMInput, SMNotification, SMIcon } from 'view/components';


function Employees(props) {

    const [visible, setVisible] = useState(false);
    const [modalValue, setModalValue] = useState(null);

    const [users, setUsers] = useState(null);

    const [loading, setLoading] = useState(false);

    const emailRules = { rules: [{ validator: emailValidator }] };

    const handleOk = () => {
        setLoading(true);
        const options = {
            url: 'invitations/',
            data: { email: modalValue }
        }
        post(options)
            .then(result => {
                setLoading(false);
                SMNotification('success', messages.invitations.sendInvitation.success)
            })
            .catch(error => {
                setLoading(false);
                error.response.status === 409 &&
                    SMNotification('error', messages.invitations.sendInvitation.error)
            })
        setVisible(false);
    }

    const handleCancel = () => {
        setVisible(false);
    }

    const openModal = () => {
        setVisible(true)
    }

    const handleChange = (a) => {
        setModalValue(a.target.value)
    }

    useEffect(() => {
        get({ url: 'users/' })
            .then(result => {
                result.data = result.data.map(item => {
                    item.key = item.guid
                    item.avatar = <SMUserBar
                        firstName={item.fname}
                        lastName={item.lname}
                        size='medium'
                    />
                    return item;
                })
                setUsers(result.data)
            })
            .catch(error => {
                //TODO handle error
            })
    }, [])

    return (
        <div className="employees-content sm-content">
            <div className='employees_send-invitation-container'>
                <SMButton
                    className='sm-button'
                    onClick={openModal}
                    loading={loading}
                >
                    Send invitation email
                </SMButton>
            </div>
            <EmployeesTable
                className='sm-table sm-component'
                history={props.history}
                loading={!users}
                showHeader={true}
                dataSource={users}
                pagination={false}
            >
            </EmployeesTable>

            <SMModal
                className='add-employ-modal'
                title={
                    <h3 className='sm-subheading'>
                        Send invitation email
                    </h3>
                }
                visible={visible}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <SMButton
                        className='sm-link'
                        key='cancel'
                        type='link'
                        onClick={handleCancel}
                    >
                        Cancel
                    </SMButton>,
                    <SMButton
                        className='sm-button'
                        key='ok'
                        type='primary'
                        onClick={handleOk}
                    >
                        Send
                    </SMButton>
                ]}
            >
                <SMForm
                    items={[
                        SMInput({
                            className: 'sm-input',
                            name: 'email',
                            type: 'text',
                            placeholder: 'Email',
                            rules: emailRules.rules,
                            onChange: handleChange,
                            prefix: (
                                <SMIcon
                                    className='sm-icon-grey'
                                    iconType='fas'
                                    icon='envelope'
                                />
                            ),
                            autoComplete: 'username',
                        }),
                    ]}
                />
            </SMModal>
        </div>
    );
}

export { Employees };
