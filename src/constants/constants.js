const sendInvitationsMessages = {
    success: {
        message: 'Invitation has been send success',
    },
    error: {
        message: 'Operation failed',
        description: 'Email already exists in invitations',
    },
}

const nonexistentInvitationMessage = {
    message: 'Invitation url does not exist',
}

module.exports = { sendInvitationsMessages, nonexistentInvitationMessage };
