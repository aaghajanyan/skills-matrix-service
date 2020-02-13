module.exports.initializeProfficienceTable = async models => {
    let values = [];

    for(let i = 1; i <= 10; i++ ) {
        values.push({ name: "", value: i });
    };

    await models.profficiences.bulkCreate(values).catch(err => {});
};