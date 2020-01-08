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

const avatars = {
    colors: ['#DB4437', '#0F9D58', '#4285F4', '#DE0881', '#F4B400'],
    sizes: {
        small: 30,
        medium: 50,
        large: 70
    }
}

export { sendInvitationsMessages, nonexistentInvitationMessage, avatars };
