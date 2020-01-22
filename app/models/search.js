const { Constants } = require('../constants/Constants');
const {
    validateRuleBodySchema,
    validateGroupBodySchema,
} = require('../validation/search');
const replaceAll = require('../helper/recursiveReplace');

class SearchUser {
    constructor() {
        this.error = {
            isError: false,
            message: [],
        };
    }

    collectSearchQuery(data) {
        const collectedSqlComand = this.parseJsonToSql(data, true);
        if (collectedSqlComand.error &&
            collectedSqlComand.error.isError
        ) {
            return collectedSqlComand;
        }
        let sqlCommand =
            `${Constants.ViewQueries.select_all_from} ${Constants.ViewQueries.unique_view_name} \
            ${Constants.ViewQueries.where} ` +
            collectedSqlComand.currSqlStr +
            ');';
        sqlCommand = sqlCommand
            .replace(
                new RegExp(
                    `${Constants.Condition.and}  ${Constants.Condition.and}`, 'g'),
                `${Constants.Condition.and}`
            )
            .replace(
                new RegExp(
                    `${Constants.Condition.or}  ${Constants.Condition.or}`, 'g'),
                `${Constants.Condition.or}`
            )
            .replace(/and \)/g, `\)`)
            .replace(/or \)/g, `\)`);
        sqlCommand = replaceAll(sqlCommand, '() and', '');
        sqlCommand = replaceAll(sqlCommand, '() or', '');
        sqlCommand = replaceAll(sqlCommand, '()', '');
        return sqlCommand;
    }

    validateSchema(callBack, data) {
        let errorMsg = callBack(data);
        if (errorMsg) {
            this.error.isError = true;
            this.error.message.push({ errorMsg: errorMsg });
        }
    }

    parseJsonToSql(data, firstTime) {
        try {
            let currSqlStr = '';
            if (data.type === Constants.Keys.group) {
                if (firstTime) {
                    this.validateSchema(validateGroupBodySchema, data);
                }
                if (this.error.isError) {
                    return { currSqlStr: '', error: this.error };
                }
                let groupLength = Object.keys(data.childrens).length;
                const groupCondition = data.condition.toLowerCase();
                const keys = Object.keys(data.childrens);

                currSqlStr = currSqlStr.concat('(');

                for (let [index, key] of keys.entries()) {
                    if (data.childrens[key].type === Constants.Keys.rule) {
                        if (!data.childrens[key].properties.type) {
                            continue;
                        }
                        this.validateSchema(validateRuleBodySchema, data.childrens[key]);
                        currSqlStr = currSqlStr.concat(this.convertRuleToQuery(data.childrens[key]));
                        if (index < keys.length - 1) {
                            currSqlStr = currSqlStr.concat(` ${groupCondition} `);
                        }
                    } else if (data.childrens[key].type === Constants.Keys.group) {
                        this.validateSchema(validateGroupBodySchema, data.childrens[key]);
                        currSqlStr = currSqlStr + this.parseJsonToSql(data.childrens[key], false).currSqlStr;
                        currSqlStr = currSqlStr.concat(')');
                        currSqlStr = groupLength > 1 ? currSqlStr.concat(` ${groupCondition} `) : currSqlStr;
                    } else {
                        this.error.isError = true;
                        this.error.message.push({
                            errorMsg: `type is required`,
                            object: data.childrens[key],
                        });
                    }
                }
            }
            return { currSqlStr: currSqlStr, error: this.error };
        } catch (error) {
            console.log(error); // TBD
        }
    }

    convertRuleToQuery(rule) {
        if (rule.properties) {
            const properties = rule.properties;
            if (properties.type) {
                switch (properties.type.toLowerCase()) {
                    case Constants.Keys.skill:
                        return this.convertSkillCategoryRuleToQuery(
                            properties,
                            true
                        );
                    case Constants.Keys.category:
                        return this.convertSkillCategoryRuleToQuery(
                            properties,
                            false
                        );
                    case Constants.Keys.branch:
                        return this.convertBranchPositionRuleToQuery(
                            properties,
                            true
                        );
                    case Constants.Keys.position:
                        return this.convertBranchPositionRuleToQuery(
                            properties,
                            false
                        );
                }
            }
        }
    }

    getCondition(condition) {
        if (condition) {
            switch (condition.toLowerCase()) {
                case Constants.Controllers.Search.EQUAL:
                    return '=';
                case Constants.Controllers.Search.NOT_EQUAL:
                    return '!=';
            }
        }
    }

    convertSkillCategoryRuleToQuery(properties, isSkillRule) {
        let sqlStr = isSkillRule
            ? ` ${Constants.Keys.skill_experience_proficiency} ~ \'.*\\[`
            : ` ${Constants.Keys.category_experience_proficiency} ~ \'.*\\[`;
        const experience = properties.experience ? properties.experience : 0;
        const proficiency = properties.proficiency ? properties.proficiency : 0;
        properties.name = properties.name.replace(Constants.SPECIAL_CHARACTER_REG_EXP_BEGINING,
            Constants.SPECIAL_CHARACTER_REG_EXP_ENDING);

        sqlStr = sqlStr
            .concat(`${properties.name},`)
            .concat(`[${experience}-${Constants.Controllers.Search.MAX_EXPERIENCE}],`)
            .concat(`[${proficiency}-${Constants.Controllers.Search.MAX_PROFICIENCY}]]`)
            .concat("'");
        return sqlStr;
    }

    convertBranchPositionRuleToQuery(properties, isBranchRule) {
        const opCondition = this.getCondition(properties.opCondition);
        let sqlStr = isBranchRule
            ? ` ${Constants.Keys.branch_name}${opCondition}`
            : ` ${Constants.Keys.position_name}${opCondition}`;
        sqlStr = sqlStr.concat(`'${properties.name}'`);
        return sqlStr;
    }
}

module.exports = SearchUser;
