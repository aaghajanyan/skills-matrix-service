const { Constants } = require("../constants/Constants");
const Joi = require("joi");
const { validateRuleBodySchema, validateGroupBodySchema, validateConditionBodySchema } = require('../validation/search');

class SearchUser {

    constructor() {
        this.error = {
            isError: false,
            message: []
        };
    }

    collectSearchQuery(data, response, next) {
        const collectedSqlComand = this.parseJsonToSql(data, response, next, true);
        if(collectedSqlComand.error.isError != undefined && collectedSqlComand.error.isError) {
            return collectedSqlComand;
        }
        let sqlCommand =  `${Constants.ViewQueries.select_all_from} ${Constants.ViewQueries.unique_view_name} \
            ${Constants.ViewQueries.where} ` + collectedSqlComand.currSqlStr + ');';
        sqlCommand = sqlCommand.replace(new RegExp(`${Constants.Condition.and}  ${Constants.Condition.and}`, 'g'), `${Constants.Condition.and}`)
            .replace(new RegExp(`${Constants.Condition.or}  ${Constants.Condition.or}`, 'g'), `${Constants.Condition.or}`);;
        return sqlCommand;
    }


    validateSchema(callBack, data) {
        let errorMsg = callBack(data);
        if (errorMsg != null) {
            this.error.isError = true;
            this.error.message.push({errorMsg: errorMsg});
        }
    }

    parseJsonToSql(data, response, next, firstTime) {
        try {
            let currSqlStr = '';
            if (data.type == Constants.Keys.group) {
                if (firstTime) {
                    this.validateSchema(validateGroupBodySchema, data);
                }
                if (this.error.isError) {
                    return { currSqlStr: '', error: this.error};
                }
                let hasGroup = false;
                let groupIndex = Object.keys(data.childrens).length;
                const groupCondition = data.condition.toLowerCase();
                const keys = Object.keys(data.childrens);

                currSqlStr = currSqlStr.concat('(');

                for (let [index, key] of keys.entries()) {
                    if (data.childrens[key].type == Constants.Keys.rule) {
                        this.validateSchema(validateRuleBodySchema, data.childrens[key]);
                        currSqlStr = currSqlStr.concat(this.convertRuleToQuery(data.childrens[key]));
                        if (index < keys.length-1) {
                            currSqlStr = currSqlStr.concat(` ${groupCondition} `);
                        }
                    } else if (data.childrens[key].type == Constants.Keys.group){
                        this.validateSchema(validateGroupBodySchema, data.childrens[key]);
                        hasGroup = true;
                        currSqlStr = currSqlStr + this.parseJsonToSql(data.childrens[key], response, next, false).currSqlStr;
                        currSqlStr = currSqlStr.concat(')');
                        currSqlStr = groupIndex > 1 ? currSqlStr.concat(` ${groupCondition} `) : currSqlStr;
                    } else {
                        this.error.isError = true;
                        this.error.message.push({errorMsg: `type is required`, object: data.childrens[key]});
                    }
                    if (groupIndex-1 == index) {
                        if (!hasGroup) {
                            hasGroup = false;
                          }
                    }
                  }
            }
            return { currSqlStr: currSqlStr, error: this.error};
        } catch(error) {
            console.log(error)
        }
    };

    convertRuleToQuery(rule) {
        if (rule.properties) {
            const properties = rule.properties;
            if (properties.type) {
                switch(properties.type.toLowerCase()) {
                    case Constants.Keys.skill:
                        return this.convertSkillCategoryRuleToQuery(properties, true);
                    case Constants.Keys.category:
                        return this.convertSkillCategoryRuleToQuery(properties, false);
                    case Constants.Keys.branch:
                        return this.convertBranchPositionRuleToQuery(properties, true);
                    case Constants.Keys.position:
                        return this.convertBranchPositionRuleToQuery(properties, false);
                }
            }
        }
    }

    getCondition(condition) {
        if (condition) {
            switch(condition.toLowerCase()) {
                case Constants.Controllers.Search.EQUAL:
                    return '=';
                case Constants.Controllers.Search.NOT_EQUAL:
                    return '!=';
            }
        }
    }

    convertSkillCategoryRuleToQuery(properties, isSkillRule) {
        let sqlStr = isSkillRule ? ` ${Constants.Keys.skill_experience_proficiency} ~ \'.*\\[` :
            ` ${Constants.Keys.category_experience_proficiency} ~ .*\\[`;
        const experience = properties.experience ? properties.experience : 0;
        const proficiency = properties.proficiency ? properties.proficiency : 0;
        sqlStr = sqlStr.concat(`${properties.id},`)
                        .concat(`[${experience}-${Constants.Controllers.Search.MAX_EXPERIENCE}],`)
                        .concat(`[${proficiency}-${Constants.Controllers.Search.MAX_PROFICIENCY}]]`)
                        .concat('\'');
        return sqlStr;
    }

    convertBranchPositionRuleToQuery(properties, isBranchRule) {
        const opCondition = this.getCondition(properties.opCondition);
        let sqlStr = isBranchRule ? ` ${Constants.Keys.branch_id}${opCondition}` : ` ${Constants.Keys.position_id}${opCondition}`;
        sqlStr = sqlStr.concat(`${properties.id}`);
        return sqlStr;
    }
}

module.exports = SearchUser;
