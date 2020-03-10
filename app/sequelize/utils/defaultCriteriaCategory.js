module.exports.initializeCriteriaCategory = async models => {
    const Experience = {
        'name': 'Experience',
        'key': 'experience',
        'items': [
            {
                'name': '1'
            },
            {
                'name': '2'
            },
            {
                'name': '3'
            },
            {
                'name': '4'
            },
            {
                'name': '5'
            }
        ]
    };
    const Proficiency = {
        'name': 'Proficiency',
        'key': 'proficiency',
        'items': [
            {
                'name': '1'
            },
            {
                'name': '2'
            },
            {
                'name': '3'
            },
            {
                'name': '4'
            },
            {
                'name': '5'
            },
            {
                'name': '6'
            },
            {
                'name': '7'
            },
            {
                'name': '8'
            },
            {
                'name': '9'
            },
            {
                'name': '10'
            }
        ]
    };

    let defaultCriteriesPropObj =  [
        {
            name: Experience.name,
            items: Experience,
            type: ['skills', 'category']
        },
        {
            name: Proficiency.name,
            items: Proficiency,
            type: ['skills', 'category']
        },
    ];

    await models.criteria_categories.bulkCreate(defaultCriteriesPropObj).catch(err => {});
};