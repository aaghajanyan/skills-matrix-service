const Constants = {
    AUTHORIZATION: 'Authorization',
    TOKEN: 'token',
    CASCADE: 'CASCADE',
    LOGIN_TOKEN_EXPiRE_DATE: '1 d',
    FORGOT_PASSWORD_TOKEN_EXPiRE_DATE: '1 d',
    INVITATION_TOKEN_EXPiRE_DATE: '7 d',

    REGISTRATION_ENDPOINT: '/registration/',
    FORGOT_PASSWORD_ENDPOINT: '/forgot_password/change/',
    TableNames : {
        Users: 'users',
        Invitations: 'invitations',
        Roles: 'roles',
        RolesGroup: 'roles_groups',
        RolesRelation: 'roles_relations',
        Skills: 'skills',
        Categories: 'categories',
        CategoriesRelations: 'categories_relations',
        SkillsRelations: 'skills_relations',
        UsersSkills: 'users_skills',
        History: 'history',
        UsersCategories: 'users_categories'
    },
    ModelNames : {
        User: 'user',
        Invitations: 'invitation',
        Roles: 'roles',
        RolesGroup: 'roles_groups',
        RolesRelation: 'roles_relations',
        Skills: 'skill',
        Category: 'category',
        CategoriesRelation: 'categories_relation',
        SkillsRelations: 'skills_relation',
        UsersSkills: 'users_skills',
        History: 'history',
        UsersCategories: 'users_categories'
    },

    Migrations: {
        id: 'id',
        roleGroupId: 'roleGroupId',
        roleId: 'roleId',
        categoryId: 'categoryId',
        userId: 'userId',
        skillId: 'skillId',
        unique: 'unique',
        relatedCategoryId: 'relatedCategoryId',
        name: 'name',
        guid: 'guid',
        addedCategories: 'addedCategories',
        removedCategories: 'removedCategories',
        addRelatedCategories: 'addRelatedCategories',
        removedRelatedCategories: 'removedRelatedCategories',
        addedSkills: 'addedSkills',
        removedSkills: 'removedSkills',

        SKILL: 'Skill',
        CATEGORY: 'Category',

        RoleRelation: {
            id: 'id',
            roleId: 'roleId',
            roleGroupId: 'roleGroupId',
            uniqueRoleRel: 'uniqueRoleRel'
        },
        CategoryRelation: {
            relatedCategoryId: 'relatedCategoryId',
        },
        SkillRelation: {
            uniqueSkillRel: 'uniqueSkillRel'
        },
        UserSkill: {
            uniqueUserSkill: 'uniqueUserSkill'
        },
        History: {
            userSkillId: 'userSkillId'
        },
        UsersCategories: {
            uniqueUserCategory: 'uniqueUserCategory'
        },
    },

    ModelErrors: {
        CATEGORY_ID_IS_MISSING: 'Category id is missing.',
        RELATED_CATEGORY_ID_IS_MISSING: 'Related category id is missing.',
        NAME_IS_MISSING: 'Name is missing.',
        CATEGORY_ALREADY_EXITS: 'Category already exists.',
        EMAIL_IS_MISSING: 'Email address is missing.',
        EMAIL_ALREADY_EXISTS: 'Email already exists.',
        EMAIL_IS_INVALID: 'Email address is invalid.',
        ROLE_GROUP_ALREADY_EXISTS: 'Role Group already exists.',
        ROLE_ALREADY_EXISTS: 'Role already exists.',
        ROLE_ID_IS_MISSING: 'Role id is missing.',
        ROLE_GROUP_ID_IS_MISSING: 'Role Group id is missing.',
        SKILL_ID_IS_MISSING: "Skill id is missing",
        CATEGORY_ID_IS_MISSING: "Category id is missing",
        SKILL_ALREADY_EXISTS: "Skill already exists",
        PASSWORD_IS_MISSING: "Password is missing",
        FIRSTNAME_IS_MISSING: "FirstName is missing",
        LASTNAME_IS_MISSING: "LastName is missing",
        BRANCH_IS_MISSING: "Branch is missing",
        STARTED_TO_WORK_DATE_IS_MISSING: "Started to work date is missing",
        POSITION_IS_MISSING: "Position is missing",
    },

    Associate: {
        Aliases: {
            relatedCategories: 'relatedCategories',
            relatedCategoriesRef: 'relatedCategoriesRef',
            skills: 'skills',
            categories: 'categories',
            roles: 'roles',
            roleGroup: 'roleGroup'
        }
    },
    Controllers: {
        ErrorMessages: {
            COULD_NOT_GET: 'Could not get %s.',
            COULD_NOT_ADD: 'Could not add %s.',
            COULD_NOT_UPDATE: 'Could not update %s.',
            COULD_NOT_DELETE: 'Could not delete %s.',
            DOES_NOT_EXSTS: '%s does not exists.',
            ALREADY_EXISTS: '%s already exists.',
        },
        TypeNames: {
            USER: 'User',
            INVITATION: 'Invitation',
            SKILL: 'Skill',
            CATEGORY: 'Category',
            REL_CATEGORY: 'Related categories',
            SKILL_REL: 'Skill Relation',
            ROLE_GROUP: 'Role Group',
            USER_CATEGORY: 'User categories',
            USER_SKILL: 'User skill',
        },
        Users: {
            COULD_NOT_REGISTER_USER: 'Could not register new user.',
            COULD_NOT_LOGIN: 'Could not make login.',
            invitationId: 'invitationId',
            guid: 'guid'
        },
        Invitation: {
            EMAIL_ALREADY_EXISTS_USER_MODEL: 'Email already exists in users.',
            EMAIL_ALREADY_EXISTS_INVITATION_MODEL: 'Email already exists in invitations',
            COULD_NOT_SEND_EMAIL: 'Could not send email',
        },
        Skills: {
            SKILL_ALREADY_EXISTS: ' skill already exists.',
        },
        Categories: {
            CATEGORY_ALREADY_EXISTS: ' category already exists.',
        },
        ForgotPassword: {
            COULD_NOT_SEND_EMAIL: 'Could not send email.',
            SENDED_MAIL_ADDRESS: 'Mail sended to %s email.',
            COULD_NOT_CHANGE_PASSWORD: 'Could not change password.'
        },
        CategoryRelation: {
            REL_CATEGORY_DOES_NOT_EXISTS: 'Related categories does not exists.',
            CATEGORY_DOES_NOT_EXISTS: 'Category does not exists.',
        },
        RolesGroup: {
            COULD_NOT_GET_ROLE_GROUP_F: 'Could not get role group with %s guid.',
        },
        SkillRelation: {

        },
    },
    notExists: function(type, param, paramName) {
        return `${type} with ${param} ${paramName} does not exists`;
    },
    couldNot: function(type, modelName) {
        return `Could not ${type} ${modelName}`;
    },
    parse: function(str) {
        let args = [].slice.call(arguments, 1),
        i = 0;
        return str.replace(/%s/g, () => args[i++]);
    }

}

module.exports = { Constants };