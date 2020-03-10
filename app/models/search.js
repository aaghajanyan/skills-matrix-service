const util = require('util');
const {Constants} = require('../constants/Constants');
const {validateRuleBodySchema, validateGroupBodySchema} = require('../validation/search');
const replaceAll = require('../helper/recursiveReplace');
const logger = require('../helper/logger');
const moment = require('moment');

class SearchUser {
    constructor() {
        this.error = {
            isError: false,
            message: [],
        };
    }

    collectSearchQuery(data) {
        const collectedSqlComand = this.parseJsonToSql(data, true);
        if (collectedSqlComand.error && collectedSqlComand.error.isError) {
            return collectedSqlComand;
        }
        let sqlCommand =
            `${Constants.ViewQueries.SELECT_ALL_FROM} ${Constants.ViewQueries.UNIQUE_VIEW_NAME} \
            ${Constants.ViewQueries.WHERE} ` +
            collectedSqlComand.currSqlStr +
            ');';

        sqlCommand = sqlCommand
            .replace(new RegExp(`${Constants.Condition.and}  ${Constants.Condition.and}`, 'g'), `${Constants.Condition.and}`)
            .replace(new RegExp(`${Constants.Condition.or}  ${Constants.Condition.or}`, 'g'), `${Constants.Condition.or}`)
            .replace(/and \(\)/g, ``)
            .replace(/or \(\)/g, ``)
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
                        currSqlStr = this.validateAndParseRuleObj(index, keys.length, data.childrens[key], currSqlStr, groupCondition);
                    } else if (data.childrens[key].type === Constants.Keys.group) {
                        currSqlStr = this.validateAndParseGroupObj(data.childrens[key], currSqlStr, groupLength, groupCondition);
                    } else {
                        this.collectCurrentStepError(data.childrens[key]);
                    }
                }
            }
            return { currSqlStr: currSqlStr, error: this.error };
        } catch (error) {
            logger.error(error);
        }
    }

    validateAndParseGroupObj(data, currSqlStr, groupLength, groupCondition) {
        this.validateSchema(validateGroupBodySchema, data);
        currSqlStr = currSqlStr + this.parseJsonToSql(data, false).currSqlStr;
        currSqlStr = currSqlStr.concat(')');
        currSqlStr = groupLength > 1 ? currSqlStr.concat(` ${groupCondition} `) : currSqlStr;
        return currSqlStr;
    }

    validateAndParseRuleObj(index, parentObjKeysLength, data, currSqlStr, groupCondition) {
        this.validateSchema(validateRuleBodySchema, data);
        currSqlStr = currSqlStr.concat(this.convertRuleToQuery(data));
        if (index < parentObjKeysLength - 1) {
            currSqlStr = currSqlStr.concat(` ${groupCondition} `);
        }
        return currSqlStr;
    }

    convertRuleToQuery(rule) {
        if (rule.properties) {
            const properties = rule.properties;
            if (properties.type) {
                switch (properties.type.toLowerCase()) {
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
            switch (condition.toLowerCase()) {
                case Constants.Controllers.Search.EQUAL:
                    return '=';
                case Constants.Controllers.Search.NOT_EQUAL:
                    return '!=';
            }
        }
    }

    convertSkillCategoryRuleToQuery(properties, isSkillRule) {
        if (!properties.last_worked_date) {
            if (properties.opCondition === 'equal') {
                properties.last_worked_date = moment('1900-01-01').format('YYYY-MM-DD')
            } else {
                properties.last_worked_date = new Date().toJSON().slice(0,10).replace(/-/g,'-');
            }
        }
        const date = properties.last_worked_date.toString().split('-');
        const [y, m, dd] = date;
        const d = dd.split('T')[0];

        let sqlStr = isSkillRule
            ? ` ${Constants.Keys.skill_experience_proficiency} ~ \'.*\\[`
            : ` ${Constants.Keys.category_experience_proficiency} ~ \'.*\\[`;
        const experience = properties.experience ? properties.experience : 1;
        const proficiency = properties.proficiency ? properties.proficiency : 1;
        properties.name = properties.name.replace(Constants.SPECIAL_CHARACTER_REG_EXP_BEGINING, Constants.SPECIAL_CHARACTER_REG_EXP_ENDING);

        sqlStr = sqlStr.concat(`${properties.name},`);
        sqlStr =
            properties.opCondition === 'equal'
                ? sqlStr.concat(`[${experience}-${Constants.Controllers.Search.MAX_EXPERIENCE}],`)
                : sqlStr.concat(`[${Constants.Controllers.Search.MIN_EXPERIENCE}-${experience - 1}],`);
        sqlStr =
            properties.opCondition === 'equal'
                ? sqlStr.concat(`[${proficiency}-${Constants.Controllers.Search.MAX_PROFICIENCY}],`)
                : sqlStr.concat(`[${Constants.Controllers.Search.MIN_PROFICIENCY}-${proficiency - 1}],`);

        if (properties.opCondition === 'equal') {
            sqlStr = sqlStr.concat(this.collectRegExpForDate(date));
        } else if (properties.opCondition === 'equal' && y[0] === '2') {
            sqlStr = sqlStr.concat(util.format(Constants.DATE_RANGE_AFTER, y[1], y[2], y[3], m[0], m[1], d[0], d[1]));
        }
        sqlStr = sqlStr.concat("]'");
        return sqlStr;
    }

    collectRegExpForDate(date) {
        let sqlStr = '';
        const [y, m, dd] = date;
        const d = dd.split('T')[0];
        sqlStr = sqlStr.concat('(');
        if ( y[0] === '1' && +y < 1999) {
            sqlStr = sqlStr.concat(util.format(Constants.DATE_RANGE_AFTER_1, y[0], y[1], y[2], +y[3]+1, 0, 0, 0, 0));
            sqlStr = sqlStr.concat('|');
            sqlStr = sqlStr.concat(util.format(Constants.DATE_RANGE_AFTER_1, 2, 0, 0, 0, 0, 0, 0, 0));
        } else {
            const nextY = +y+1;
            const nextYS = nextY.toString();
            sqlStr = sqlStr.concat(util.format(Constants.DATE_RANGE_AFTER_1, nextYS[0], nextYS[1], nextYS[2], nextYS[3], 0, 0, 0, 0));
        }
        if (+m !== 12) {
            const nextM = +m+1;
            let nextMS = nextM.toString();
            if (nextM > 9) {
                sqlStr = sqlStr.concat('|');
                sqlStr = sqlStr.concat(util.format(Constants.DATE_RANGE_AFTER_4, y, nextMS[0], nextMS[1], 0, 0));
            } else {
                sqlStr = sqlStr.concat('|');
                sqlStr = sqlStr.concat(util.format(Constants.DATE_RANGE_AFTER_4, y, 0, nextMS, 0, 0));
            }
        }
        if (+d !== 28) {
            const nextD = +d+1;
            let nextDS = nextD.toString();
            if (nextD > 9) {
                sqlStr = sqlStr.concat('|');
                sqlStr = sqlStr.concat(util.format(Constants.DATE_RANGE_AFTER_5, y, m, nextDS[0], nextDS[1]));
            } else {
                sqlStr = sqlStr.concat('|');
                sqlStr = sqlStr.concat(util.format(Constants.DATE_RANGE_AFTER_5, y, m, 0, nextDS));
            }
        }
        sqlStr = sqlStr.concat(')');
        return sqlStr;
    }

    convertBranchPositionRuleToQuery(properties, isBranchRule) {
        const opCondition = this.getCondition(properties.opCondition);
        let sqlStr = isBranchRule ? ` ${Constants.Keys.branch_name}${opCondition}` : ` ${Constants.Keys.position_name}${opCondition}`;
        sqlStr = sqlStr.concat(`'${properties.name}'`);
        return sqlStr;
    }

    collectCurrentStepError(data) {
        this.error.isError = true;
        this.error.message.push({
            errorMsg: `type is required`,
            object: data,
        });
    }
}

module.exports = SearchUser;
