import React, { Component } from 'react';
import { RegisterForm } from './RegisterForm';
const axios = require('client/lib/axiosWrapper');

class Register extends Component {
    constructor() {
        super();
        this.state = {};
        this.checkInvitation = this.checkInvitation.bind(this);
    }

    // TODO move to store
    async checkInvitation() {
        try {
            await axios.post("invitations",
                this.props.match.params.invitationId
            );
            this.setState({ invitationExist: true });
        } catch (error) {
            if (error.status === 404) {
                this.setState({ invitationExist: false });
            } else {
                console.log(error);
                this.setState({ invitationExist: false });
            }
        }
    }

    componentDidMount() {
        this.checkInvitation();
    }

    render() {
        if (!this.state.invitationExist) {
            return (
                <RegisterForm
                    invitationId={this.props.match.params.invitationId}
                    history={this.props.history}
                />
            );
        }
        return (
            <div>
                <p>false</p>
            </div>
        );
    }
}

export { Register };
