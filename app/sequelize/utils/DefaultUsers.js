const bcrypt = require("bcrypt");

class DefaultUsers {

    static async initializeUserTable(models) {
        const salt = await bcrypt.genSalt(10);
        const password = bcrypt.hashSync('Tester01!', salt);
        let user = {
            password: password,
            email: 'admin@instigatemobile.com',
            fname: 'Admin',
            lname: 'Admin',
            branchName: 'Vanadzor',
            startedToWorkDate: '2017-11-16',
            position: 'Project Manager',
            roleGroupId: 1
        };
        await models.user.build(user).save().catch((err) => {});
    }
}

module.exports = DefaultUsers;
