const { Constants } = require('../../constants/Constants');

module.exports = (sequelize, DataTypes) => {
    const Branch = sequelize.define(
        Constants.ModelNames.Branch,
        {
            name: {
                type: DataTypes.STRING,
                allowNull: {
                    args: false,
                    msg: Constants.ModelErrors.BRANCH_IS_MISSING,
                },
                unique: {
                    args: true,
                    msg: Constants.ModelErrors.BRANCH_ALREADY_EXISTS,
                },
            },
            guid: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
        },
        {
            timestamps: false,
        }
    );

    Branch.associate = models => {};
    return Branch;
};
