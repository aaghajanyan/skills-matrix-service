import React, { useState } from 'react';
import { emailValidator } from 'helpers/FormValidators';
import { SMModal } from 'components/common/SMModal/SMModal';
import { SMForm } from 'components/common/Forms/SMForm/SMForm';
import { SMButton } from 'components/common/SMButton/SMButton';
import { SMInput } from 'components/common/Forms/SMInput/SMInput';
import login_email_icon from 'assets/images/login_email_icon.svg';

function Employees() {

    const [visible, setVisible ] = useState(false);
    const [ modalValue, setModalValue ] = useState(null);

    const emailRules = { rules: [{ validator: emailValidator }] };

    const handleOk = () => {
        //TODO
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

    return (
        <div className="employees-content">
            <SMButton id='employees-modal-button' onClick={openModal}> Add employ </SMButton>
            <SMModal
                className='add-employ-modal'
                title="Send invitations email"
                visible={visible}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <SMButton
                        id='cancel-invitation-btn'
                        key='cancel'
                        type='link'
                        onClick={handleCancel}
                    >
                        Cancel
                    </SMButton>,
                    <SMButton
                        id='send-invitation-btn'
                        key='ok'
                        type='primary'
                        onClick={handleOk}
                    >
                        Send invitation
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
