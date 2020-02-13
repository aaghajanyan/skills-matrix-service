module.exports.initializeCondition = async models => {
    let conditionList =  ['equal', 'not equal'];
    let defaultConditionObj = conditionList.map(condition => {
        return {
            name: condition,
        };
    });

    await models.conditions.bulkCreate(defaultConditionObj).catch(err => {});
};