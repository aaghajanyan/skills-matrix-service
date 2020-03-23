import React, {useEffect, useState} from 'react';
import {emailValidator} from 'src/helpers/validators';
import {EmployeesTable} from 'src/view/pages/logged-in/components';
import {SMUserBar} from '../components';
import {SMConfig} from 'src/config';
import {SMButton, SMForm, SMIcon, SMInput, SMModal, SMNotification, SMSearch} from 'src/view/components';
import {sendInvitation} from 'src/services/invitationsService';
import {getUsers} from 'src/services/usersService';
import {useValidator} from '../../../../hooks/common';


function Employees(props) {

    const [visible, setVisible] = useState(false);

    const [users, setUsers] = useState(null);

    const [loading, setLoading] = useState(false);

    const [filtered, setFiltered] = useState(null);

    const [isEmailValid, email, emailRule] = useValidator(emailValidator);

    const handleOk = () => {
        setLoading(true);
        sendInvitation(email)
            .then(() => {
                setLoading(false);
                SMNotification('success', SMConfig.messages.invitations.sendInvitation.success);
            })
            .catch(error => {
                setLoading(false);
                if(error.response) {
                    if(error.response.status === 409) {
                        SMNotification('error', SMConfig.messages.invitations.sendInvitation.error);
                    }
                }
            });
        setVisible(false);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const openModal = () => {
        setVisible(true);
    };

    const handleSearchInputChange = (e) => {
        e.persist();
        const value = e.target.value;
        let filteredUsers = [];
        users.map((user) => {
            if ( (user.fname.toLowerCase().includes(value.toLowerCase()) && filteredUsers.indexOf(user) === -1) || (user.lname.toLowerCase().includes(value.toLowerCase()) && filteredUsers.indexOf(user) === -1) ) {
                filteredUsers.push(user);
            }
        });
        setFiltered(filteredUsers);
    }

    useEffect(() => {
        getUsers()
            .then(users => {
                users = users.map(user => {
                    user.key = user.guid;
                    user.avatar = (<SMUserBar
                        firstName={user.fname}
                        lastName={user.lname}
                        size="medium"
                    />);
                    return user;
                });
                setUsers(users);
                setFiltered(users);
            })
            .catch(() => {
                setUsers([]);
            });
    }, []);

    return (
        <div className="employees-content sm-content">
            <div className="employees_send-invitation-container">
                <SMButton
                    className="sm-button"
                    onClick={openModal}
                    loading={loading}
                >
                    { loading ? 'Sending' : 'Send'} invitation email
                </SMButton>
            </div>
            <EmployeesTable
                className="sm-table sm-component"
                history={props.history}
                loading={users === null}
                showHeader={true}
                dataSource={filtered}
                pagination={false}
                searchBar = {[
                    SMSearch({
                        key: 'search',
                        placeholder: "Filter...",
                        className: 'sm-search-criteria',
                        onChange: e => handleSearchInputChange(e),
                    })
                ]}
            >
            </EmployeesTable>

            <SMModal
                className="add-employ-modal"
                title={
                    <h3 className="sm-subheading">
                        Send invitation email
                    </h3>
                }
                visible={visible}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <SMButton
                        className="sm-link"
                        key="cancel"
                        type="link"
                        onClick={handleCancel}
                    >
                        Cancel
                    </SMButton>,
                    <SMButton
                        className="sm-button"
                        key="ok"
                        type="primary"
                        onClick={handleOk}
                        disabled={!isEmailValid}
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
                            rules: emailRule,
                            prefix: (
                                <SMIcon
                                    className="sm-icon-grey"
                                    iconType="fas"
                                    icon="envelope"
                                />
                            ),
                            autoComplete: 'username'
                        })
                    ]}
                />
            </SMModal>
        </div>
    );
}

export {Employees};
