const addSkill = (data) => {
    return {
        type: 'ADD_SKILLS',
        payload: data
    }
}

const updateSkill = (data) => {
    return {
        type: 'UPDATE_SKILL',
        payload: data
    }
}

const deleteSkill = (id) => {
    return {
        type: 'DELETE_SKILL',
        payload: id
    }
}

export {
    addSkill,
    updateSkill,
    deleteSkill
}