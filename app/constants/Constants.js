const Constants = {
    AUTHORIZATION: 'Authorization',
    TOKEN: 'token',
    CASCADE: 'CASCADE',
    LOGIN_TOKEN_EXPiRE_DATE: '1 d',
    FORGOT_PASSWORD_TOKEN_EXPiRE_DATE: '1 d',
    INVITATION_TOKEN_EXPiRE_DATE: '7 d',

    REGISTRATION_ENDPOINT: '/registration/',
    FORGOT_PASSWORD_ENDPOINT: '/forgot_password/change/',

    ViewQueries: {
        view_name: 'users_view',
        unique_view_name: 'users_view_unique',
        users_view: `SELECT u.email, u.guid as user_guid,u."branchId" as branch_id, u."positionId" as position_id, \
                    ('[' || us."skillId" || ',' || us.experience || ',' || us.profficience || ']') as skill_info, \
                    ('[' || uc."categoryId" || ',' || uc.experience || ',' || uc.profficience || ']') as category_info \
                    FROM users u inner join users_skills us on u.id=us.user_id left outer join users_categories uc on u.id=uc.user_id`,
        users_view_unique: `SELECT user_guid, branch_id, position_id, string_agg(skill_info, ', ') AS skill_experience_proficiency, \
                            string_agg(category_info, ', ') AS category_experience_proficiency \
                            FROM users_view GROUP  BY user_guid,branch_id,position_id`
    },

    TableNames : {
        Users: 'users',
        Invitations: 'invitations',
        Roles: 'roles',
        RolesGroup: 'roles_groups',
        Branches: 'branches',
        Positions: 'positions',
        RolesRelation: 'roles_relations',
        Skills: 'skills',
        Categories: 'categories',
        CategoriesRelations: 'categories_relations',
        SkillsRelations: 'skills_relations',
        UsersSkills: 'users_skills',
        History: 'history',
        UsersCategories: 'users_categories',
        Criteria: 'criteria'
    },
    ModelNames : {
        User: 'user',
        Branch: 'branch',
        Position: 'position',
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
        UsersCategories: 'users_categories',
        Criteria: 'criteria'
    },

    ModelErrors: {
        CATEGORY_ID_IS_MISSING: 'Category id is missing.',
        RELATED_CATEGORY_ID_IS_MISSING: 'Related category id is missing.',
        NAME_IS_MISSING: 'Name is missing.',
        BRANCH_IS_MISSING: 'Branch is missing.',
        BRANCH_ALREADY_EXISTS: 'BRANCH already exists.',
        POSITION_IS_MISSING: 'Position is missing.',
        POSITION_ALREADY_EXISTS: 'Position already exists.',
        NAME_ALREADY_EXISTS: 'Name already exists.',
        TYPE_IS_MISSING: 'Type is missing.',
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

    Keys: {
        id: 'id',
        branchId: 'branchId',
        roleGroupId: 'roleGroupId',
        roleId: 'roleId',
        categoryId: 'categoryId',
        category: 'category',
        userId: 'userId',
        user_id: 'user_id',
        skillId: 'skillId',
        skill: 'skill',
        skills: 'skills',
        unique: 'unique',
        relatedCategoryId: 'relatedCategoryId',
        name: 'name',
        password: 'password',
        branch: 'branch',
        branchName: 'branchName',
        position: 'position',
        user: 'user',
        guid: 'guid',
        addedCategories: 'addedCategories',
        removedCategories: 'removedCategories',
        addRelatedCategories: 'addRelatedCategories',
        removedRelatedCategories: 'removedRelatedCategories',
        addedSkills: 'addedSkills',
        removedSkills: 'removedSkills',
    },

    Migrations: {
        SKILL: 'Skill',
        CATEGORY: 'Category',
        CRITERIA: 'Criteria',

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

    Associate: {
        Aliases: {
            branch: 'branch',
            position: 'position',
            relatedCategories: 'relatedCategories',
            categoryRelation: 'categoryRelation',
            skillRelation: 'skillRelation',
            relatedCategoriesRef: 'relatedCategoriesRef',
            skills: 'skills',
            categories: 'categories',
            roles: 'roles',
            roleGroup: 'roleGroup',
            roleRelation: 'roleRelation',
            skillMark: 'skillMark',
            categoryMark: 'categoryMark'
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
            CRITERIA: 'Criteria',
            BRANCH: 'Branch',
            POSITION: 'Position',
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
            SKILL_ALREADY_EXISTS: ' skill already exists.'
        },
        Categories: {
            CATEGORY_ALREADY_EXISTS: ' category already exists.'
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
        UserSkills: {
            ALREADY_EXISTS: 'Skill with %s already exists.',
        },
        UserCategory: {
            ALREADY_EXISTS: 'Category with %s already exists.',
        },
        Search: {
            COULD_NOT_SEARCH_DATA: 'Could not search data.',
            INVALID_TYPE_TO_SEARCH: 'Invalid type to search employees',
            EQUAL: 'equal',
            NOT_EQUAL: 'not equal',
            EXPERIENCE: 'experience',
            PROFFICIENCE: 'profficience',
            GREATER: 'greater',
            LESSER: 'lesser',
            OR: 'or',
            AND: 'and',
            Op: {
                EQ: '$eq',
                GTE: '$gte',
                LTE: '$lte',
                OR: '$or',
                AND: '$and',
                NE: '$ne',
            }

        },
    },
    notExists: function(type, param, paramName) {
        return `${type} with ${param} ${paramName} does not exists`;
    },
    couldNot: function(type, modelName) {
        return `Could not ${type} ${modelName}`;
    },
    parse: function(str) {
        let args = [].slice.call(arguments, 1);
        return str.replace(/%s/g, () => args[0]);
    }
}

module.exports = { Constants };