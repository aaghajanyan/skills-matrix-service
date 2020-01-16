const dbConfig = require("../../../config/env-settings.json").db;

module.exports = {
    default: {
      username: dbConfig.username,
      password: dbConfig.password,
      database: dbConfig.database,
      ...dbConfig.options
    },
    roles: ['create_user', 'create_skill', 'update_skill', 'manage_team', 'employee'],
    rolesGroups: ['super_user', 'team_lead', 'employee'],
    queryTemplate: {
      view_name: 'users_view',
      unique_view_name: 'users_view_unique',
      users_view: `SELECT u.id, u.email, u.guid as user_guid,u."branchId" as branch_id, u."positionId" as position_id, \
                    ('[' || us."skillId" || ',' || us.experience || ',' || us.profficience || ']') as skill_info, \
                    ('[' || uc."categoryId" || ',' || uc.experience || ',' || uc.profficience || ']') as category_info \
                    FROM users u inner join users_skills us on u.id=us.user_id left outer join users_categories uc on u.id=uc.user_id`,
      users_view_unique: `SELECT id, user_guid, branch_id, position_id, string_agg(skill_info, ', ') AS skill_experience_proficiency, \
                            string_agg(category_info, ', ') AS category_experience_proficiency \
                            FROM users_view GROUP  BY id, user_guid,branch_id,position_id`,
    }
  };
