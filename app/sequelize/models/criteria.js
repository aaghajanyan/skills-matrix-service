const { Constants } = require('../../constants/Constants');
const {initializeCriteriaTable} = require('../utils/defaultCriteries');

module.exports = (sequelize, DataTypes) => {
    const Criteria = sequelize.define(
        Constants.ModelNames.Criteria,
        {
            guid: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
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
            type: {
                type: DataTypes.STRING,
                allowNull: {
                    args: false,
                    msg: Constants.ModelErrors.TYPE_IS_MISSING,
                },
            },
        },
        {
            timestamps: false,
        }
    );
    Criteria.associate = models => {};

    Criteria.initDefaultValues = async function(models) {
        await initializeCriteriaTable(models);
    };

    return Criteria;
};
