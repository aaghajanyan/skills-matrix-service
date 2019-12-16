const sendInvitationsMessages = {
    success: {
        message: 'Invitation has been sent successfully',
    },
    error: {
        message: 'Operation failed',
        description: 'Invitation already sent to this email address',
    },
}

const nonexistentInvitationMessage = {
    message: 'Invalid invitation URL',
}

export { sendInvitationsMessages, nonexistentInvitationMessage };
