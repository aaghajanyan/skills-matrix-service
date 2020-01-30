const {Constants} = require('../../constants/Constants');

module.exports = (sequelize, DataTypes) => {
    const Invitation = sequelize.define(
        Constants.ModelNames.Invitations,
        {
            id: {
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4
            },
            email: {
                type: DataTypes.STRING,
                allowNull: {
                    args: false,
                    msg: Constants.ModelErrors.EMAIL_IS_MISSING
                },
                unique: {
                    args: true,
                    msg: Constants.ModelErrors.EMAIL_ALREADY_EXISTS
                },
                validate: {
                    isEmail: {
                        args: true,
                        msg: Constants.ModelErrors.EMAIL_IS_INVALID
                    }
                }
            }
        },
        {
            timestamps: false
        }
    );

    return Invitation;
};
