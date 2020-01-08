const { Constants } = require("../../constants/Constants");

module.exports = (sequelize, DataTypes) => {
    const Position = sequelize.define(
        Constants.ModelNames.Position,
        {
            name: {
                type: DataTypes.STRING,
                allowNull: {
                    args: false,
                    msg: Constants.ModelErrors.POSITION_IS_MISSING
                },
                unique: {
                    args: true,
                    msg: Constants.ModelErrors.POSITION_ALREADY_EXISTS
                }
            },
            guid: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
        },
        {
            timestamps: false
        }
    );

    Position.associate = models => {};
    return Position;
};
