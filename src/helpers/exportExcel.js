import moment from 'moment';

const badColor = 'faad14';    // orange
const normalColor = '1890ff'; // blue
const goodColor = '52C41A';   // green
const borderColor = '000';    // black
const contentSize = '11';
const titleSize = '11';
const columnWidth = '150';

const getUniqueSkillsList = (userList) => {
    const skillsList = [];
    userList.map(user => {
        user.skills.map(skill => {
            skillsList.push(skill.name)
        })
    });
    return new Set(skillsList);

}

const getSkillIndex = (list, name) => {
    let i = -1;
    list.some((e, index) => {
        if (e.title === name) {
            i = index;
            return
        }
    })
    return i;
}

const collectSkillExcelObj = (skill) => {
    return {
        value: 'Exp: ' + skill.skillMark.experience +
        '\nProf: ' + skill.skillMark.profficience +
        '\nLDate: ' + moment(skill.skillMark.last_worked_date).format('YYYY-MM-DD'),
        style: {
            font: {sz: contentSize},
            fill: {
                patternType: 'solid',
                fgColor: {rgb: skill.skillMark.profficience < 3 ? badColor : skill.skillMark.profficience === 3 ? normalColor : goodColor}
            },
            border: {
                top: {style: 'thin', color: borderColor},
                bottom: {style: 'thin', color: borderColor},
                left: {style: 'thin', color: borderColor},
                right: {style: 'thin', color: borderColor}
            },
            alignment: {
                vertical: 'center',
                horizontal: 'center'
            }
        }
    };
}

const collectColumns = (exportingData, data) => {
    const columnsLists = data ? exportingData[0].columns = ["Employee", "Position", "Branch", ...getUniqueSkillsList(data.users)] : [];
    const columnsObj =  columnsLists.map(item => {
        return {title: item, width: {wpx: columnWidth}, style: {font: {sz: titleSize, bold: true}, alignment: {vertical: 'center', horizontal: 'center'}}}
    });
    return columnsObj
}

const collectNameColumnsObj = (text, nameObj) => {
    nameObj.value = text;
    nameObj.style = {
        font: {sz: contentSize},
        alignment: {
            vertical: 'center',
            horizontal: 'center'
        }
    };
}

const exportExcel = (data) => {
    const exportingData = [
        {
            columns: [],
            data: []
        }
    ];
    data ? exportingData[0].columns = collectColumns(exportingData, data) : [];
    data && data.users.forEach(user => {
        const userResult = Array.from({ length: exportingData[0].columns.length}, () => {return {value: '', style: {}}});
            collectNameColumnsObj(user.fname + ' ' + user.lname, userResult[0]);
            collectNameColumnsObj(user.position.name, userResult[1]);
            collectNameColumnsObj(user.branch.name, userResult[2]);
            user.skills && user.skills.forEach(skill => {
                userResult[getSkillIndex(exportingData[0].columns ,skill.name)] = collectSkillExcelObj(skill)
            })
            exportingData[0].data.push(userResult);
    });
    return exportingData
};

export {exportExcel};