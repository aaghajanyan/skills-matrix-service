import React, { useState, useEffect } from 'react';
import { post, get } from 'client/lib/axiosWrapper';
import { emailValidator } from 'helpers/FormValidators';
import { SMModal } from 'view/components';
import { SMForm } from 'view/components';
import { SMButton } from 'view/components';
import { SMInput } from 'view/components';
import { sendInvitationsMessages } from 'src/constants/constants';
import { EmployeesTable } from 'view/pages/logged-in/components'
import { SMNotification } from 'view/components';
import { SMUserBar } from '../components';
import login_email_icon from 'assets/images/login_email_icon.svg';

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
                SMNotification('success', sendInvitationsMessages.success)
            })
            .catch(error => {
                setLoading(false);
                error.response.status === 409 &&
                    SMNotification('error', sendInvitationsMessages.error)
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
                    const colorCode = Math.floor(100000 + Math.random() * 900000);
                    item.avatar = <SMUserBar
                                    colorCode={colorCode}
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
        <div className="employees-content">
            <SMButton
                id='employees-modal-button'
                className='sm-button'
                onClick={openModal}
                loading={loading}
            >
                Send invitation email
            </SMButton>
            <EmployeesTable
                className='sm-table employees-table'
                history={props.history}
                loading={!users}
                showHeader={true}
                dataSource={users}
                pagination={false}
            >
            </EmployeesTable>
            <SMModal
                className='add-employ-modal'
                title="Send invitation email"
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
                                <img
                                    className="sm-form-icon"
                                    src={login_email_icon}
                                    alt="email"
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
