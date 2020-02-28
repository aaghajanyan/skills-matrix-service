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

import ReactExport from "react-export-excel";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const multiDataSet = [
    {
        columns: ["Employee", "Position", "Branch"],
        data: [
            [
                {value: "H1", style: {font: {sz: "24", bold: true}}},
                {value: "Bold", style: {font: {bold: true}}},
                {value: "Red", style: {fill: {patternType: "solid", fgColor: {rgb: "FFFF0000"}}}},
            ],
            [
                {value: "H2", style: {font: {sz: "18", bold: true}}},
                {value: "underline", style: {font: {underline: true}}},
                {value: "Blue", style: {fill: {patternType: "solid", fgColor: {rgb: "FF0000FF"}}}},
            ],
            [
                {value: "H3", style: {font: {sz: "14", bold: true}}},
                {value: "italic", style: {font: {italic: true}}},
                {value: "Green", style: {fill: {patternType: "solid", fgColor: {rgb: "FF00FF00"}}}},
            ],
            [
                {value: "H4", style: {font: {sz: "12", bold: true}}},
                {value: "strike", style: {font: {strike: true}}},
                {value: "Orange", style: {fill: {patternType: "solid", fgColor: {rgb: "FFF86B00"}}}},
            ],
            [
                {value: "H5", style: {font: {sz: "10.5", bold: true}}},
                {value: "outline", style: {font: {outline: true}}},
                {value: "Yellow", style: {fill: {patternType: "solid", fgColor: {rgb: "FFFFFF00"}}}},
            ],
            [
                {value: "H6", style: {font: {sz: "7.5", bold: true}}},
                {value: "shadow", style: {font: {shadow: true}}},
                {value: "Light Blue", style: {fill: {patternType: "solid", fgColor: {rgb: "FFCCEEFF"}}}}
            ]
        ]
    }
];

function SearchPeople(props) {
    const [collapseFind, setCollapseFind] = useState(false);

    const exportingData = [
        {
            columns: [],
            data: []
        }
    ];

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
        return list.indexOf(name);
    }

    const collectSkillExelObj = (skill) => {
        return {value: 'Exp: ' + skill.skillMark.experience +
                        '\nProf: ' + skill.skillMark.profficience +
                        '\nLDate: ' + moment(skill.skillMark.last_worked_date).format('YYYY-MM-DD')};
    }

    const downloadExcel = () => {
        exportingData[0].columns = ["Employee", "Position", "Branch", ...getUniqueSkillsList(usersData.users)]
        usersData.users.forEach(user => {
            const userResult = [].fill({value: ''}, 0, exportingData[0].columns.length);
            userResult[0] = {value: user.fname + ' ' + user.lname};
            userResult[1] = {value: user.position.name};
            userResult[2] = {value: user.branch.name};
            user.skills.forEach(skill => {
                userResult[getSkillIndex(exportingData[0].columns ,skill.name)] = collectSkillExelObj(skill)
            })
            exportingData[0].data.push(userResult);
        });
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
                        <ExcelFile element={<SMButton className="sm-button skills-table-add-skill-button" onClick={downloadExcel}>
                            {SMConfig.search.search.buttons.export}
                            </SMButton>}>
                            <ExcelSheet dataSet={exportingData} name="employees"/>
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
