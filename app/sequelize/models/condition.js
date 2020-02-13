const { Constants } = require('../../constants/Constants');
const {initializeCondition} = require('../utils/defaultCondition');

module.exports = (sequelize, DataTypes) => {
    const ConditionModels = sequelize.define(
        Constants.ModelNames.Condition,
        {
            name: {
                type:  DataTypes.STRING,
                allowNull: {
                    args: false,
                    msg: Constants.ModelErrors.NAME_IS_MISSING,
                }
            },
        },
        {
            timestamps: false,
        }
    );

    ConditionModels.initDefaultValues = async function(models) {
        await initializeCondition(models);
    };

    return ConditionModels;
};
