const bcrypt = require("bcrypt");

class DefaultBranches {

    static async initializeBranchTable(models) {
        const  branchList = ['Vanadzor', 'Erevan', 'Goris'];
        let defaultBranchesObj = await branchList.map((branch) => { return {
            name: branch,
        }});
        await models.branch.bulkCreate(defaultBranchesObj).catch((err) => {});
    }
}

module.exports = DefaultBranches;
