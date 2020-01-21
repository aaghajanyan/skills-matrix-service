const bcrypt = require('bcrypt');

class DefaultUsers {
    static async initializeUserTable(models) {
        const salt = await bcrypt.genSalt(10);
        const password = bcrypt.hashSync('Admin01!', salt);
        let user = {
            password: password,
            email: 'admin@instigatemobile.com',
            fname: 'Admin',
            lname: 'Admin',
            branch_id: 1,
            started_to_work_date: '2017-11-16',
            position_id: 13,
            role_group_id: 1,
        };
        await models.user
            .build(user)
            .save()
            .catch(err => {});
    }
}

module.exports = DefaultUsers;
