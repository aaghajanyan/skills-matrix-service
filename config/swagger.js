const swaggerJSDoc = require('swagger-jsdoc');
const swaggerConfig = require('./env-settings.json').swagger;

swaggerSpec = swaggerJSDoc(swaggerConfig.options);

swaggerSpec.definitions.login = require('../app/definitions/login.json');
swaggerSpec.definitions.signUp = require('../app/definitions/signUp.json');
swaggerSpec.definitions.updateUser = require('../app/definitions/updateUser.json');
swaggerSpec.definitions.branch = require('../app/definitions/branch.json');
swaggerSpec.definitions.addCategory = require('../app/definitions/addCategory.json');
swaggerSpec.definitions.updateCategory = require('../app/definitions/updateCategory.json');
swaggerSpec.definitions.updateCategoryAllData = require('../app/definitions/updateCategoryAllData.json');
swaggerSpec.definitions.categoryRelation = require('../app/definitions/categoryRelation.json');
swaggerSpec.definitions.updateCategoryRelation = require('../app/definitions/updateCategoryRelation.json');
swaggerSpec.definitions.userCategory = require('../app/definitions/userCategory.json');
swaggerSpec.definitions.userCategoriesArray = require('../app/definitions/userCategoriesArray.json');
swaggerSpec.definitions.deleteUserCategory = require('../app/definitions/deleteUserCategory.json');
swaggerSpec.definitions.criteria = require('../app/definitions/criteria.json');
swaggerSpec.definitions.forgotPassword = require('../app/definitions/forgotPassword.json');
swaggerSpec.definitions.forgotPasswordChange = require('../app/definitions/forgotPasswordChange.json');
swaggerSpec.definitions.invitation = require('../app/definitions/invitation.json');
swaggerSpec.definitions.position = require('../app/definitions/position.json');
swaggerSpec.definitions.addSkill = require('../app/definitions/addSkill.json');
swaggerSpec.definitions.updateSkill = require('../app/definitions/updateSkill.json');
swaggerSpec.definitions.updateSkillAllData = require('../app/definitions/updateSkillAllData.json');
swaggerSpec.definitions.skillsRelation = require('../app/definitions/skillsRelation.json');
swaggerSpec.definitions.updateSkillRelation = require('../app/definitions/updateSkillRelation.json');
swaggerSpec.definitions.userSkill = require('../app/definitions/userSkill.json');
swaggerSpec.definitions.userSkillsArray = require('../app/definitions/userSkillsArray.json');
swaggerSpec.definitions.deleteUserSkill = require('../app/definitions/deleteUserSkill.json');
swaggerSpec.definitions.profficience = require('../app/definitions/profficience.json');

module.exports = swaggerSpec;
