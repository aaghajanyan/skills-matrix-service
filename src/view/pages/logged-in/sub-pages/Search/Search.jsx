import React, { useState, useRef, useEffect } from "react";
import { Row, Form, Icon } from "antd";
import { SearchDataView } from "view/pages/logged-in/sub-pages/Search/SearchDataView/SearchDataView";
import { SMUserBar } from "view/pages/logged-in/components/SMUserBar";
import { SMButton } from "view/components/SMButton";
import { useSelector, useDispatch } from "react-redux";
import { SMConfig } from "config";
import { doSearch, getCriteria } from "store/actions/search";

import SearchTree from "./SearchTree";
import moment from 'moment';

import ReactExport from "react-data-export";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const badColor = 'faad14';    // orange
const normalColor = '1890ff'; // blue
const goodColor = '52C41A';   // green
const borderColor = '000';    // black
const contentSize = '11';
const titleSize = '11';
const columnWidth = '150';

function SearchPeople(props) {
    const [collapseFind, setCollapseFind] = useState(false);

    const refForScroll = useRef();
    const dispatch = useDispatch();

    useEffect(() => {
        getCriteria();
    }, []);

    const getTree = data => {
        dispatch(doSearch(data));
    };

    const handleSubmit = e => {
        e.preventDefault();
        refForScroll.current.scrollTo(0, 0);
        setCollapseFind(true);
    };

    const collapsesOut = () => {
        setCollapseFind(false);
    };

    const usersData = useSelector(state => {
        if (state.search.items && state.search.items.data) {
            state.search.items.data = state.search.items.data.map(item => {
                item.key = item.guid;
                item.avatar = (
                    <SMUserBar
                        firstName={item.fname}
                        lastName={item.lname}
                        size="medium"
                    />
                );
                return item;
            });

            return {
                users: state.search.items.data,
                fieldValues: state.search.items.values,
                loading: state.search.loading,
                error: state.search.error
            };
        }
    });

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

    const collectColumns = (exportingData) => {
        const columnsLists = usersData ? exportingData[0].columns = ["Employee", "Position", "Branch", ...getUniqueSkillsList(usersData.users)] : [];
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

    const downloadExcel = () => {
        const exportingData = [
            {
                columns: [],
                data: []
            }
        ];
        usersData ? exportingData[0].columns = collectColumns(exportingData) : [];
        usersData && usersData.users.forEach(user => {
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

    return (
        <>
            <div
                ref={refForScroll}
                className={`main_container_search ${collapseFind &&
                    "default_main_container"} `}
            >
                <Row className="search_header">
                    <div> <h1> {SMConfig.search.title} </h1> </div>
                    <div>
                        <ExcelFile filename="findEmployees" element={<SMButton className="sm-button skills-table-add-skill-button">
                            {SMConfig.search.search.buttons.export}
                            </SMButton>}>
                            <ExcelSheet dataSet={downloadExcel()} name="employees"/>
                        </ExcelFile>
                    </div>
                </Row>
                <Row
                    className={collapseFind ? "collapses_visible" : "collapses_hidden"}>
                    <Icon onClick={collapsesOut} type="double-right" />
                </Row>
                <Form onSubmit={handleSubmit}>
                    <Form.Item>
                        <SearchTree
                            disabledBtn={collapseFind}
                            data={usersData}
                            location={props.location}
                            getTree={getTree}
                            formItem={props.form}
                        />
                    </Form.Item>
                </Form>
            </div>

            {usersData && usersData.users && (
                <SearchDataView
                    userData={usersData.users}
                    history={props.history}
                    id="xls-table"
                />
            )}
        </>
    );
}

const Search = Form.create({ name: "Search" })(SearchPeople);
export { Search };
