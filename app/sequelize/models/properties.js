const { Constants } = require('../../constants/Constants');
const {initializeCriteriaCategory} = require('../utils/defaultCriteriaCategory');

module.exports = (sequelize, DataTypes) => {
    const PropertyModel = sequelize.define(
        Constants.ModelNames.criteria_categories,
        {
            name: {
                type: DataTypes.STRING,
                allowNull: {
                    args: false,
                    msg: Constants.ModelErrors.NAME_IS_MISSING,
                },
                unique: {
                    args: true,
                    msg: Constants.ModelErrors.NAME_ALREADY_EXISTS,
                },
            },
            items: {
                type:  DataTypes.JSON,
                allowNull: {
                    args: false,
                    msg: Constants.ModelErrors.NAME_IS_MISSING,
                },
            },
        },
        {
            timestamps: false,
        }
    );

    PropertyModel.initDefaultValues = async function(models) {
        await initializeCriteriaCategory(models);
    };

    return PropertyModel;
};