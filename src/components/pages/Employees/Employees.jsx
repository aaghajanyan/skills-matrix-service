import React, { useState } from 'react';
import { SMModal } from 'components/common/SMModal/SMModal';
import { SMButton } from 'components/common/SMButton/SMButton';
import { SMInput } from 'components/common/Forms/SMInput/SMInput';
import login_email_icon from 'assets/images/login_email_icon.svg';

function Employees() {


    const [visible, setVisible ] = useState(false);
    const [ modalValue, setModalValue ] = useState(null);

    const handleOk = () => {
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

    return (
        <div className="employees-content">
            <SMButton id='employees-modal-button' onClick={openModal}> Add employ </SMButton>
            <SMModal
                className='add-employ-modal'
                title="Add new employ"
                visible={visible}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <SMButton key='cancel' type="link" onCancel={handleCancel}>
                        Cancel
                    </SMButton>,
                    <SMButton key="ok" type="primary" onClick={handleOk}>
                        Send invitation
                    </SMButton>
                ]}
            >
                <SMInput
                    className='sm-input'
                    name='email'
                    type= 'text'
                    placeholder= 'Email'
                    prefix={
                        <img
                            className="employees-email-icon"
                            src={login_email_icon}
                            alt="email"
                        />
                    }
                    autoComplete='username'
                    onChange={handleChange}
                    >
                </SMInput>
            </SMModal>
        </div>
    );
}

export { Employees };
