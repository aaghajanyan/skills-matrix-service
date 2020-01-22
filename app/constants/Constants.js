const Constants = {
    SPECIAL_CHARACTER_REG_EXP_BEGINING: /[!@#$%^&*()+=\-[\]\\';,./{}|":<>?~_]/g,
    SPECIAL_CHARACTER_REG_EXP_ENDING: '\\$&',
    AUTHORIZATION: 'Authorization',
    BEARER: 'Bearer ',
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
        create_or_replace_view: 'CREATE OR REPLACE VIEW ',
        select_all_from: 'select * from',
        where: 'where',
    },

    Permissions: {
        ACCESS_DENIED: 'Access denied.',
        NEEDED_ADMIN_PERMISSIONS: 'Need admin permissions.',
        UNAUTHORIZED: 'Unauthorized'
    },

    TableNames: {
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
        Criteria: 'criteria',
    },
    ModelNames: {
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
        Criteria: 'criteria',
    },

    ModelErrors: {
        USERNAME_OR_PASSWORD_IS_INCORRECT: 'Username or password is incorrect.',
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
        SKILL_ID_IS_MISSING: 'Skill id is missing',
        CATEGORY_ID_IS_MISSING: 'Category id is missing',
        SKILL_ALREADY_EXISTS: 'Skill already exists',
        PASSWORD_IS_MISSING: 'Password is missing',
        FIRSTNAME_IS_MISSING: 'FirstName is missing',
        LASTNAME_IS_MISSING: 'LastName is missing',
        BRANCH_IS_MISSING: 'Branch is missing',
        STARTED_TO_WORK_DATE_IS_MISSING: 'Started to work date is missing',
        POSITION_IS_MISSING: 'Position is missing',
    },

    Keys: {
        id: 'id',
        branch_id: 'branch_id',
        branch_name: 'branch_name',
        position_name: 'position_name',
        role_group_id: 'role_group_id',
        role_id: 'role_id',
        categoryId: 'categoryId',
        category_id: 'category_id',
        category: 'category',
        userId: 'userId',
        user_id: 'user_id',
        skillId: 'skillId',
        skill_id: 'skill_id',
        skill: 'skill',
        skills: 'skills',
        unique: 'unique',
        related_category_id: 'related_category_id',
        name: 'name',
        password: 'password',
        branch: 'branch',
        branch_id: 'branch_id',
        position_id: 'position_id',
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
        group: 'group',
        rule: 'rule',
        skill_experience_proficiency: 'skill_experience_proficiency',
        category_experience_proficiency: 'category_experience_proficiency',
    },

    Condition: {
        and: 'and',
        or: 'or',
    },

    Migrations: {
        RoleRelation: {
            id: 'id',
            role_id: 'role_id',
            role_group_id: 'role_group_id',
            uniqueRoleRel: 'uniqueRoleRel',
        },
        CategoryRelation: {
            related_category_id: 'related_category_id',
        },
        SkillRelation: {
            uniqueSkillRel: 'uniqueSkillRel',
        },
        UserSkill: {
            uniqueUserSkill: 'uniqueUserSkill',
        },
        History: {
            userSkillId: 'userSkillId',
            user_skill_id: 'user_skill_id',
        },
        UsersCategories: {
            uniqueUserCategory: 'uniqueUserCategory',
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
            categoryMark: 'categoryMark',
        },
    },

    ErrorMessages: {
        COULD_NOT_GET: 'Could not get %1.',
        COULD_NOT_FIND: 'Could not find %1.',
        COULD_NOT_ADD: 'Could not add %1.',
        COULD_NOT_UPDATE: 'Could not update %1.',
        COULD_NOT_DELETE: 'Could not delete %1.',
        DOES_NOT_EXSTS: '%1 does not exists.',
        ALREADY_EXISTS: '%1 already exists.',
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

    Controllers: {
        Users: {
            COULD_NOT_REGISTER_USER: 'Could not register new user.',
            COULD_NOT_LOGIN: 'Could not make login.',
            invitationId: 'invitationId',
            guid: 'guid',
        },
        Invitation: {
            EMAIL_ALREADY_EXISTS_USER_MODEL: 'Email already exists in users.',
            EMAIL_ALREADY_EXISTS_INVITATION_MODEL:
                'Email already exists in invitations',
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
            SENDED_MAIL_ADDRESS: 'Mail sended to %1 email.',
            COULD_NOT_CHANGE_PASSWORD: 'Could not change password.',
        },
        CategoryRelation: {
            REL_CATEGORY_DOES_NOT_EXISTS: 'Related categories does not exists.',
            CATEGORY_DOES_NOT_EXISTS: 'Category does not exists.',
        },
        RolesGroup: {
            COULD_NOT_GET_ROLE_GROUP_F:
                'Could not get role group with %1 guid.',
        },
        UserSkills: {
            ALREADY_EXISTS: 'Skill with %1 already exists.',
        },
        UserCategory: {
            ALREADY_EXISTS: 'Category with %1 already exists.',
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
            MAX_EXPERIENCE: 5,
            MIN_EXPERIENCE: 0,
            MAX_PROFICIENCY: 5,
            MIN_PROFICIENCY: 0,
            Op: {
                EQ: '$eq',
                GTE: '$gte',
                LTE: '$lte',
                OR: '$or',
                AND: '$and',
                NE: '$ne',
            },
            QUERY_PARAM_IS_INVALID: '<%1> query parameter is invalid.',
            QUERY_PARAM_IS_MISSING: '<%1> query parameter is missing.',
            QUERY_PARAM_NAME: 'search_query',
        },
    },
    Roles: {
        SUPER_USER: 'super_user'
    }
};

module.exports = { Constants };
