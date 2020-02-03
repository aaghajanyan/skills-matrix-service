const getSkills = (data) => {
    return {
        type: 'GET_SKILLS',
        payload: data
    }
}

const addSkill = (data) => {
    return {
        type: 'ADD_SKILL',
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
    getSkills,
    addSkill,
    deleteSkill
}