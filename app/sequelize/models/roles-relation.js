const DefaultRoles = require('../utils/DefaultRoles');
const { Constants } = require('../../constants/Constants');

module.exports = (sequelize, DataTypes) => {
    const RoleRelation = sequelize.define(
        Constants.ModelNames.RolesRelation,
        {
            id: {
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            guid: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            role_group_id: {
                type: DataTypes.INTEGER,
                allowNull: {
                    args: false,
                    msg: Constants.ModelErrors.ROLE_GROUP_ID_IS_MISSING,
                },
            },
            role_id: {
                type: DataTypes.INTEGER,
                allowNull: {
                    args: false,
                    msg: Constants.ModelErrors.ROLE_ID_IS_MISSING,
                },
            },
        },
        {
            timestamps: false,
        }
    );

    RoleRelation.associate = models => {};
    return RoleRelation;
};
