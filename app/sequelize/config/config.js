const dbConfig = require("../../../config/env-settings.json").db;

module.exports = {
    default: {
      username: dbConfig.username,
      password: dbConfig.password,
      database: dbConfig.database,
      ...dbConfig.options
    },
    roles: ['create_user', 'create_skill', 'update_skill', 'manage_team', 'employee'],
    rolesGroups: ['super_user', 'team_lead', 'employee']
  };
