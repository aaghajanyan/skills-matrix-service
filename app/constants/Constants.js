const Constants = {
    CASCADE: 'CASCADE',
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
        CategoryIdMissing: 'Category id is missing.',
        RelatedCategoryIdMissing: 'Related category id is missing.',
        NameMissing: 'Name is missing.',
        CategoryAlreadyExists: 'Category already exists.',
        EmailMissing: 'Email address is missing.',
        EmailAlreadyExists: 'Email already exists.',
        EmailAdressIsInvalid: 'Email address is invalid.',
        RoleGroupAlreadyExists: 'Role Group already exists.',
        RoleAlreadyExists: 'Role already exists.',
        RoleIdMissing: 'Role id is missing.',
        RoleGroupIdMissing: 'Role Group id is missing.',
        SkillIdMissing: "Skill id is missing",
        CategoryIdMissing: "Category id is missing",
        SkillAlreadyExists: "Skill already exists",

        PasswordMissing: "Password is missing",
        FirstnameMissing: "FirstName is missing",
        LastnameMissing: "LastName is missing",
        BranchMissing: "Branch is missing",
        StartedToWorkMissing: "Started to work date is missing",
        PositionMissing: "Position is missing",
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
    }

}

module.exports = { Constants };