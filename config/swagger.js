const swaggerJSDoc = require('swagger-jsdoc');
const swaggerConfig = require('./env-settings.json').swagger;

swaggerSpec = swaggerJSDoc(swaggerConfig.options);

swaggerSpec.definitions.login = require('../app/definitions/login.json');
swaggerSpec.definitions.branch = require('../app/definitions/branch.json');
swaggerSpec.definitions.addCategory = require('../app/definitions/addCategory.json');
swaggerSpec.definitions.updateCategory = require('../app/definitions/updateCategory.json');
swaggerSpec.definitions.updateCategoryAllData = require('../app/definitions/updateCategoryAllData.json');

module.exports = swaggerSpec;
