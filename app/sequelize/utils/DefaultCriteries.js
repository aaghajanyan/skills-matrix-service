const bcrypt = require("bcrypt");

class DefaultCriteries {

    static async initializeCriteriaTable(models) {
        const defaultCriteries = ['Branch', 'Position', 'Category', 'Skill'];
        let defaultCriteriesObj = await defaultCriteries.map((criteria) => { return {
            name: criteria,
            type: criteria.toLowerCase()
        }});
        await models.criteria.bulkCreate(defaultCriteriesObj).catch((err) => {});
    }
}

module.exports = DefaultCriteries;
