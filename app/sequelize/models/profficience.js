const { Constants } = require('../../constants/Constants');
const {initializeProfficienceTable} = require('../utils/defaultProfficiences');

module.exports = (sequelize, DataTypes) => {
    const ProfficienceModel = sequelize.define(
        Constants.ModelNames.Profficience,
        {
            name: {
                type: DataTypes.STRING,
                allowNull: {
                    args: false,
                    msg: Constants.ModelErrors.NAME_IS_MISSING,
                },
                unique: {
                    args: false,
                    msg: Constants.ModelErrors.NAME_ALREADY_EXISTS,
                },
            },
            value: {
                unique: true,
                type:  DataTypes.INTEGER,
                allowNull: false
            },
        },
        {
            timestamps: false,
        }
    );

    ProfficienceModel.initDefaultValues = async function(models) {
        await initializeProfficienceTable(models);
    };

    return ProfficienceModel;
};