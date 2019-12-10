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

Change configs in config/env-settings.json config file.

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
│   │   ├── en.messages.js
│   │   └── Messages.js
│   ├── controllers
│   │   ├── category.js
│   │   ├── category-relation.js
│   │   ├── invitation.js
│   │   ├── roles-groups.js
│   │   ├── skill.js
│   │   ├── skill-relation.js
│   │   └── user.js
│   ├── mailSender
│   │   └── mailSender.js
│   ├── models
│   │   ├── category.js
│   │   ├── skill.js
│   │   └── user.js
│   ├── routes
│   │   ├── categories.js
│   │   ├── categories-relations.js
│   │   ├── index.js
│   │   ├── invitations.js
│   │   ├── roles-groups.js
│   │   ├── skills.js
│   │   ├── skills-relations.js
│   │   └── users.js
│   ├── sequelize
│   │   ├── config
│   │   │   └── config.js
│   │   ├── migrations
│   │   │   ├── 01_invitation.js
│   │   │   ├── 02_role.js
│   │   │   ├── 03_role-group.js
│   │   │   ├── 04_role-relation.js
│   │   │   ├── 05_user.js
│   │   │   ├── 06_skill.js
│   │   │   ├── 07_category.js
│   │   │   ├── 08_category-relation.js
│   │   │   ├── 09_skill-relation.js
│   │   │   ├── 10_user-skill.js
│   │   │   └── 11_history.js
│   │   ├── models
│   │   │   ├── category.js
│   │   │   ├── category-relation.js
│   │   │   ├── index.js
│   │   │   ├── invitation.js
│   │   │   ├── role-group.js
│   │   │   ├── role.js
│   │   │   ├── roles-relation.js
│   │   │   ├── skill.js
│   │   │   ├── skill-relation.js
│   │   │   └── user.js
│   │   └── utils
│   │       └── Roles.js
│   └── validation
│       ├── categories.js
│       ├── categories-relations.js
│       ├── invitations.js
│       ├── skills.js
│       ├── skills-relations.js
│       ├── token.js
│       └── users.js
├── config
│   ├── env-settings.json
│   ├── nodeMailer.json
│   └── secretKey.json
├── package.json
├── package-lock.json
├── README.md
└── server.js
```
