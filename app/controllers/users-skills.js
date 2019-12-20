const {
    user: userModel,
    skill: skillModel,
    "users_skills": usersSkillsModel
} = require("../sequelize/models");

const getUsersSkills = async function(_, response) {
    try {
        const usersSkills = await usersSkillsModel.findAll();
        response.status(200).json(usersSkills);
    } catch (err) {
        console.log(err);
        response.status(409).json({
            success: false,
            message: `Could not get user skill`
        });
    }

};

const getUserSkills = async function(request, response) {
    try {
        const userSkills = await usersSkillsModel.findOne({
            where: { guid: request.params.userSkillGuid }
        });
        response.status(200).json(userSkills);
    } catch (err) {
        console.log(err);
        response.status(409).json({
            success: false,
            message: `Could not get users skills`
        });
    }
};

const addUserSkill =  async function(request, response) {
    try {
        const user = await userModel.findOne({
            where: { guid: request.body.userGuid }
        });

        if (user) {
            const skill = await skillModel.findOne({
                where: { guid: request.body.skillGuid }
            });
            if (skill) {
                const obj = request.body;
                obj.userId = user.id;
                obj.skillId = skill.id;
                const userSkill = await usersSkillsModel.create(obj);
                return response.status(201).json({ userSkill })
            } else {
                return response.status(409).json({
                    success: false,
                    message: `Skill doesn't exist`
                });
            }
        } else {
            return response.status(409).json({
                success: false,
                message: `User doesn't exist`
            });
        }
    } catch (err) {
        console.log(err);
        response.status(409).json({
            success: false,
            message: `Could not add user skill`
        });
    }
};

const updateUserSkill =  async function(request, response) {
    try {
        const user = await userModel.findOne({
            where: { guid: request.body.userGuid }
        });
        if (user) {
            const skill = await skillModel.findOne({
                where: { guid: request.body.skillGuid }
            });
            if (skill) {
                await usersSkillsModel.update(request.body, {
                    where: { userId: user.id, skillId: skill.id }
                });
                return response.status(202).end();
            } else {
                return response.status(409).json({
                    success: false,
                    message: `Skill doesn't exist`
                });
            }
        } else {
            return response.status(409).json({
                success: false,
                message: `User doesn't exist`
            });
        }
    } catch(err) {
        console.log(err);
        response.status(409).json({
            success: false,
            message: `Could not update user skill`
        });
    }
};

const deleteUserSkill =  async function(request, response) {
    try {
        const user = await userModel.findOne({
            where: { guid: request.body.userGuid }
        });
        if (user) {
            const skill = await skillModel.findOne({
                where: { guid: request.body.skillGuid }
            });
            if (skill) {
                await usersSkillsModel.destroy({ where: { userId: user.id, skillId: skill.id } });
                return response.status(202).end();
            } else {
                return response.status(409).json({
                    success: false,
                    message: `Could not delete item. Skill doesn't exist`
                });
            }
        } else {
            return response.status(409).json({
                success: false,
                message: `Could not delete item. User doesn't exist`
            });
        }
    } catch(err) {
        console.log(err);
        response.status(409).json({
            success: false,
            message: `Could not delete user skill`
        });
    }
};

const deleteUserSkillById =  async function(request, response) {
    try {
        await usersSkillsModel.destroy({ where: { id: request.params.userSkillGuid } });
        response.status(202).end();
    } catch(err) {
        console.log(err);
        response.status(409).end();
    }
};

module.exports = {
    getUserSkills,
    getUsersSkills,
    addUserSkill,
    updateUserSkill,
    deleteUserSkill,
    deleteUserSkillById
};
