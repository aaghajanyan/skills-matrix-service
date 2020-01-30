module.exports.initializeBranchTable = async models => {
    const branchList = ['Vanadzor', 'Erevan', 'Goris'];
    let defaultBranchesObj = await branchList.map(branch => {
        return {
            name: branch
        };
    });
    await models.branch.bulkCreate(defaultBranchesObj).catch(err => {});
};
