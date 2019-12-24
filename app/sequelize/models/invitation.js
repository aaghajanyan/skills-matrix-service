const { Constants } = require("../../constants/Constants");

module.exports = (sequelize, DataTypes) => {
    const Invitation = sequelize.define(
        Constants.ModelNames.Invitations,
        {
            id: {
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: {
                    args: false,
                    msg: Constants.ModelErrors.EmailMissing
                },
                unique: {
                    args: true,
                    msg: Constants.ModelErrors.EmailAlreadyExists
                },
                validate: {
                    isEmail: {
                        args: true,
                        msg: Constants.ModelErrors.EmailAdressIsInvalid
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
