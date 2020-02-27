const Operator = {
    'name': 'Condition',
    'key': 'opCondition',
    'items': [
        {
            'name': 'equal'
        },
        {
            'name': 'not equal'
        }
    ]
};

const last_worked_date = {
    'name': 'Last worked date',
    'key': 'last_worked_date',
}

export const uuid = () => `ID${+ new Date() + Math.floor(Math.random() * 999999)}`;

export const CRITERIA = {
    Category : [
        Operator,
        {
            'name': 'List Category',
            'key': 'list',
            'items': []
        },
        {
            'name': 'Experince',
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
        },
        {
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
                }
            ]
        },
        last_worked_date
    ],
    Skill : [
        Operator,
        {
            'name': 'List Skills',
            'key': 'list',
            'items': []
        },
        {
            'name': 'Experince',
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
        },
        {
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
                }
            ]
        },
        last_worked_date
    ],
    Branch:  [
        Operator,
        {
            'name': 'Branch',
            'key': 'branch',
            'items': []
        }
    ],
    Position: [
        Operator,
        {
            'name': 'Position',
            'key': 'position',
            'items': []
        }
    ]
};

export const contentColForRow = {
    contentCol : {
        xs: {span: 6},
        sm: {span: 6},
        md: {span: 6},
        lg: {span: 6},
        xl: {span: 5},
        xxl: {span: 3}
    },
    rowColFirst : {
        xs: {span: 3},
        sm: {span: 3},
        md: {span: 3},
        lg: {span: 3},
        xl: {span: 3},
        xxl: {span: 2}
    },
    contentRightSelect: {
        xs: {span: 24},
        sm: {span: 24},
        md: {span: 6},
        lg: {span: 6},
        xl: {span: 5},
        xxl: {span: 5}
    },
    buttonsCol: {
        xs: {span: 4},
        sm: {span: 4},
        md: {span: 4},
        lg: {span: 4},
        xl: {span: 2},
        xxl: {span: 2}
    }
};