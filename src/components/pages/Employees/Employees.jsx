import React, { useState, useEffect } from 'react';
import { post, get } from 'client/lib/axiosWrapper';
import { emailValidator } from 'helpers/FormValidators';
import { SMTable } from 'components/common/SMTable/SMTable';
import { SMModal } from 'components/common/SMModal/SMModal';
import { SMForm } from 'components/common/Forms/SMForm/SMForm';
import { SMButton } from 'components/common/SMButton/SMButton';
import { SMInput } from 'components/common/Forms/SMInput/SMInput';
import { sendInvitationsMessages } from 'src/constants/constants';
import { SMNotification } from 'components/common/SMNotification/SMNotification';
import { SMUserBar } from 'components/common/SMUserBar/SMUserBar';
import login_email_icon from 'assets/images/login_email_icon.svg';

function Employees(props) {

    const [visible, setVisible] = useState(false);
    const [modalValue, setModalValue] = useState(null);

    const [users, setUsers] = useState(null);

    const emailRules = { rules: [{ validator: emailValidator }] };

    const handleOk = () => {
        const options = {
            url: 'invitations/',
            data: { email: modalValue }
        }
        post(options)
            .then(result => {
                SMNotification('success', sendInvitationsMessages.success)
            })
            .catch(error => {
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
                    return item;
                })
                setUsers(result.data)
            })
            .catch(error => {
                //TODO handle error
            })
    }, [])

    const columns = [
        {
            title: 'Name',
            dataIndex: 'fname',
            width: '20%',
            render: (_, record) => <SMUserBar avatarUrl={record.avatarUrl} firstName={record.fname} lastName={record.lname}/>
        },
        {
            title: 'Position',
            dataIndex: 'position',
            width: '20%',
        },
        {
            title: 'Branch',
            dataIndex: 'branchName',
            width: '20%',
        }
    ];

    const onEmployeeSelect = (record, rowIndex) => ({
        onClick: () => props.history.push(`employees/${record.guid}`)
    })

    return (
        <div className="employees-content">
            <SMButton
                id='employees-modal-button'
                className='sm-button'
                onClick={openModal}
            >
                Send invitation email
            </SMButton>
            <SMTable
                className='sm-table employees-table'
                onRow={onEmployeeSelect}
                loading={!users}
                columns={columns}
                showHeader={true}
                dataSource={users}
                pagination={false}>
            </SMTable>
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
