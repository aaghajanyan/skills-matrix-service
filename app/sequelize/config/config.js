const dbConfig = require('../../../config/env-settings.json').db;

module.exports = {
    default: {
        username: Buffer.from(dbConfig.username, 'base64').toString('ascii'),
        password: Buffer.from(dbConfig.password, 'base64').toString('ascii'),
        database: dbConfig.database,
        ...dbConfig.options
    },
    roles: ['create_user', 'create_skill', 'update_skill', 'manage_team', 'employee'],
    rolesGroups: ['super_user', 'team_lead', 'employee'],
    queryTemplate: {
        viewName: 'users_view',
        uniqueViewName: 'users_view_unique',
        usersView: 'SELECT u.id, u.email, u.guid as user_guid, br.name as branch_name, pos.name as position_name, \
                  (\'[\' || s.name || \',\' || us.experience || \',\' || us.profficience || \']\') as skill_info, \
                  (\'[\' || c.name || \',\' || uc.experience || \',\' || uc.profficience || \']\') as category_info \
                  FROM users u left outer join branches as br on u.branch_id=br.id \
                  left outer join positions as pos on u.position_id=pos.id \
                  left outer join users_skills us on u.id=us.user_id \
                  left outer join skills s on s.id=us.skill_id \
                  left outer join users_categories uc on u.id=uc.user_id \
                  left outer join categories c on c.id=uc.category_id',
        usersViewUnique: 'SELECT id, user_guid, branch_name, position_name, string_agg(skill_info, \', \') AS skill_experience_proficiency, \
                          string_agg(category_info, \', \') AS category_experience_proficiency \
                          FROM users_view GROUP  BY id, user_guid,branch_name,position_name'
    }
};
