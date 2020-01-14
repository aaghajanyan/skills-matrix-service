class SearchUser {
    static mapGroupConditions = {};


    static collectSearchQuery(data) {
        let sqlCommand =  'select * from users_view_unique where ' + SearchUser.parseJsonToSql(data) + ');';
        sqlCommand = sqlCommand.replace(new RegExp('and  and', 'g'), 'and');
        sqlCommand = sqlCommand.replace(new RegExp('or  or', 'g'), 'or');
        return sqlCommand;
    }
    static parseJsonToSql(data) {
        let currSqlStr = '';
        if (data.type == 'group') {
            let hasGroup = false;
            let groupIndex = Object.keys(data.childrens).length;
            const groupCondition = data.properties.condition.toLowerCase();
            const keys = Object.keys(data.childrens);
            currSqlStr = currSqlStr.concat('(');
            keys.map(function(key, index) {
                if (data.childrens[key].type == 'rule') {
                    currSqlStr = currSqlStr.concat(SearchUser.convertRuleToQuery(data.childrens[key]));
                    if (index < keys.length-1){
                        currSqlStr = currSqlStr.concat(` ${groupCondition} `);
                    }
                } else {
                    hasGroup = true;
                    currSqlStr = currSqlStr.concat(` ${groupCondition} `);
                    currSqlStr = currSqlStr + SearchUser.parseJsonToSql(data.childrens[key]);
                    currSqlStr = currSqlStr.concat(')');

                }
                if (groupIndex-1 == index) {
                    if (!hasGroup) {
                        hasGroup = false;
                      }
                }
              });
        }

        return currSqlStr;
    };



    // static searchUser11(data, firstTime = false) {
    //     if (firstTime) {
    //         SearchUser.sqlStr = SearchUser.sqlStr.concat(` ${groupCondition} `);
    //     }
    //     console.log("data: ", data);
    //     if (data.type == 'group') {
    //         SearchUser.mapGroupConditions[SearchUser.indexGroup] = data.properties.condition;

    //         let hasGroup = false;
    //         let groupIndex = Object.keys(data.childrens).length;

    //         const groupCondition = data.properties.condition;
    //         console.log("data id condition = ", data.id, groupCondition);
    //         const keys = Object.keys(data.childrens);
    //         SearchUser.sqlStr = SearchUser.sqlStr.concat('(');
    //         keys.map(function(key, index) {
    //             if (data.childrens[key].type == 'rule') {
    //                 SearchUser.sqlStr = SearchUser.sqlStr.concat(SearchUser.convertRuleToQuery(data.childrens[key]));
    //                 if (index < keys.length-1){
    //                     SearchUser.sqlStr = SearchUser.sqlStr.concat(` ${groupCondition} `);
    //                 }
    //             } else {
    //                 hasGroup = true;
    //                 SearchUser.searchUser1(data.childrens[key], true);
    //             }
    //             console.log("\n\n\ndata.childrens.length = ", groupIndex);
    //             console.log("index = ", index);
    //             console.log("curr obj = ", data.childrens[key]);

    //             if (groupIndex-1 == index) {
    //                 if (!hasGroup) {
    //                     console.log("*********** IFFFFFFFFFF************");
    //                     console.log("*********** IFFFFFFFFFF************", SearchUser.sqlStr);
    //                     SearchUser.sqlStr = SearchUser.sqlStr.concat(')');
    //                     SearchUser.sqlStr = SearchUser.sqlStr.concat(` ${groupCondition} `);
    //                   }
    //             }
    //           });
    //           console.log("########## SearchUser.sqlStr = ", SearchUser.sqlStr);
    //     }
    //     return SearchUser.sqlStr;
    //     // if (data.type == 'group') {
    //         // const groupConjuction = data.properties.conjunction
    //         // const keys = Object.keys(data.children1);
    //     //     let group = new Group();
    //     //     group.groupCondition = groupConjuction;
    //     //     keys.map(key => {
    //     //         let child = data.children1;;
    //     //         if (child[key].type == 'rule') {
    //     //             const currentObj = child[key];
    //     //             console.log("currentObj = ", child[key]);
    //     //             const rule = new Rule(child[key].properties.field, child[key].properties.operator, child[key].properties.value);
    //     //             rule.printRule();
    //     //             group.addRule(rule);
    //     //         }
    //     //     })
    //     //     group.printGroup();
    //     //     group.collectWhereQueryForRules();
    //     // }

    // };

    static convertRuleToQuery(rule) {
        const properties = rule.properties;
        switch(properties.type.toLowerCase()) {
            case 'skill':
                return SearchUser.convertSkillCategoryRuleToQuery(properties, true);
            case 'category':
                return SearchUser.convertSkillCategoryRuleToQuery(properties, false);
            case 'branch':
                return SearchUser.convertBranchPositionRuleToQuery(properties, true);
            case 'position':
                return SearchUser.convertBranchPositionRuleToQuery(properties, false);
        }
    }

    static getCondition(condition) {
        switch(condition) {
            case 'equal':
                return '=';
            case 'not_equal':
                return '!='
        }
    }

    static convertSkillCategoryRuleToQuery(properties, isSkillRule) {
        let sqlStr = isSkillRule ? ` skill_experience_proficiency ~ \'.*\\[` : ` category_experience_proficiency ~ .*\\[`;
        const experience = properties.experience ? properties.experience : 0;
        const proficiency = properties.proficiency ? properties.proficiency : 0;
        const id = properties.id;
        sqlStr = sqlStr.concat(`${id},`);
        sqlStr = sqlStr.concat(`[${experience}-5],`);
        sqlStr = sqlStr.concat(`[${proficiency}-5]]`);
        sqlStr = sqlStr.concat(`\'`);
        return sqlStr
    }

    static convertBranchPositionRuleToQuery(properties, isBranchRule) {
        const opCondition = SearchUser.getCondition(properties.opCondition);
        let sqlStr = isBranchRule ? ` branch_id${opCondition}` : ` position_id${opCondition}`;
        const id = properties.id;
        sqlStr = sqlStr.concat(`${id}`);
        return sqlStr
    }
}

module.exports = SearchUser;