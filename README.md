This is the README file of the Skills Matrix Backend.

CONTENTS

        1. AUTHOR
        2. INTRODUCTION
        3. USAGE
        4. DIRECTORY STRUCTURE

1. AUTHOR

Instigate Mobile CJSC
E-mail: info@instigatemobile.com
Tel: +1-408-454-6172
     +49-893-8157-1771
     +374-60-445500
www.instigatemobile.com

2. INTRODUCTION

Develop a web portal for registering employees, their skills (current and wanted), projects/assignments. Intended to easily manage resource skills and find matches for projects easier.

3. USAGE

3.1 Dependencies

* NodeJs (https://nodejs.org/en/docs/) – Node js is JS runtime engine.
* PostgreSQL (https://www.postgresql.org/) - The World's Most Advanced Open Source Relational Database
* React Js (https://reactjs.org/) - A JS library for building user interfaces
* Bootstrap (https://getbootstrap.com) - Bootstrap is an open source toolkit for developing with HTML, CSS, and JS

3.2 Configuration

Create DB in PostgreSql shell - create db skills_matrix

Change configs in config/env-settings.json config file(username / password /port etc...).

Install the node modules - npm ci

3.3 Run

Run the service - npm run start-dev

Run the service - npm run start-prod

3.4 Call example

curl -w "\n" -X GET 'http://localhost:3002/users'

4. DIRECTORY STRUCTURE

```
├── app
│   ├── constants
│   │   └── Constants.js
│   ├── controllers
│   │   ├── branch.js
│   │   ├── category.js
│   │   ├── category-relation.js
│   │   ├── criteria.js
│   │   ├── forgot-password.js
│   │   ├── invitation.js
│   │   ├── position.js
│   │   ├── roles-groups.js
│   │   ├── search.js
│   │   ├── skill.js
│   │   ├── skill-relation.js
│   │   ├── user.js
│   │   ├── users-categories.js
│   │   └── users-skills.js
│   ├── email
│   │   ├── email.js
│   │   └── templates
│   │       ├── invite.html
│   │       ├── invite.subject.txt
│   │       ├── invite.txt
│   │       ├── resetPassword.html
│   │       ├── resetPassword.subject.txt
│   │       └── resetPassword.txt
│   ├── errors
│   │   ├── BadRequest.js
│   │   ├── Conflict.js
│   │   ├── Error.js
│   │   ├── ErrorMessageParser.js
│   │   ├── InternalServerError.js
│   │   └── NotFound.js
│   ├── helper
│   │   ├── logger.js
│   │   └── recursiveReplace.js
│   ├── models
│   │   ├── branch.js
│   │   ├── category.js
│   │   ├── category-relation.js
│   │   ├── criteria.js
│   │   ├── invitation.js
│   │   ├── position.js
│   │   ├── roles-groups.js
│   │   ├── search.js
│   │   ├── skill.js
│   │   ├── skill-relation.js
│   │   ├── user.js
│   │   ├── users-categories.js
│   │   └── users-skills.js
│   ├── routes
│   │   ├── branch.js
│   │   ├── categories.js
│   │   ├── categories-relations.js
│   │   ├── criteria.js
│   │   ├── forgot-password.js
│   │   ├── index.js
│   │   ├── invitations.js
│   │   ├── position.js
│   │   ├── roles-groups.js
│   │   ├── search.js
│   │   ├── skills.js
│   │   ├── skills-relations.js
│   │   ├── users-categories.js
│   │   ├── users.js
│   │   └── users-skills.js
│   ├── sequelize
│   │   ├── config
│   │   │   └── config.js
│   │   ├── migrations
│   │   │   ├── 01_invitation.js
│   │   │   ├── 02_role.js
│   │   │   ├── 03_role-group.js
│   │   │   ├── 04_role-relation.js
│   │   │   ├── 05_branch.js
│   │   │   ├── 06_position.js
│   │   │   ├── 07_user.js
│   │   │   ├── 08_skill.js
│   │   │   ├── 09_category.js
│   │   │   ├── 10_category-relation.js
│   │   │   ├── 11_skill-relation.js
│   │   │   ├── 12_user-skill.js
│   │   │   ├── 13_history.js
│   │   │   ├── 14_users_categories.js
│   │   │   └── 15_criteria.js
│   │   ├── models
│   │   │   ├── branch.js
│   │   │   ├── category.js
│   │   │   ├── category-relation.js
│   │   │   ├── criteria.js
│   │   │   ├── index.js
│   │   │   ├── invitation.js
│   │   │   ├── position.js
│   │   │   ├── role-group.js
│   │   │   ├── role.js
│   │   │   ├── roles-relation.js
│   │   │   ├── skill.js
│   │   │   ├── skill-relation.js
│   │   │   ├── user.js
│   │   │   ├── users_categories.js
│   │   │   └── user-skill.js
│   │   └── utils
│   │       ├── DefaultBranches.js
│   │       ├── DefaultCriteries.js
│   │       ├── DefaultPosition.js
│   │       ├── DefaultRoles.js
│   │       └── DefaultUsers.js
│   └── validation
│       ├── branch.js
│       ├── categories.js
│       ├── categories-relations.js
│       ├── criteria.js
│       ├── forgot-password.js
│       ├── invitations.js
│       ├── permissions.js
│       ├── position.js
│       ├── search.js
│       ├── skills.js
│       ├── skills-relations.js
│       ├── token.js
│       ├── users-categories.js
│       ├── users.js
│       └── users-skills.js
├── config
│   └── env-settings.json
├── LICENSE
├── package.json
├── package-lock.json
├── README.md
└── server.js
```
