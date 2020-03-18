import React, { useState, useRef, useEffect } from "react";
import { Row, Form, Tooltip, Icon } from "antd";
import { SearchDataView } from "view/pages/logged-in/sub-pages/Search/SearchDataView/SearchDataView";
import { SMUserBar } from "view/pages/logged-in/components/SMUserBar";
import { SMButton } from "view/components/SMButton";
import { useSelector, useDispatch } from "react-redux";
import { SMConfig } from "config";
import { doSearch, getCriteria } from "store/actions/search";
import {exportExcel} from 'src/helpers/exportExcel';
import SearchTree from "./SearchTree";
import ReactExport from "react-data-export";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

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
                    <Tooltip placement="top" title={`${item.fname} ${item.lname}`}>
                        <SMUserBar
                        className='smEmployeAvatar'
                        firstName={item.fname}
                        lastName={item.lname}
                        size="medium"
                    /> </Tooltip>
                );
                item.positionTable = (
                    <Tooltip placement="top" title={item.position.name}>
                        <div className='smEmployePosition'>{item.position.name}</div>
                    </Tooltip>
                );
                item.branchNameTable = (
                    <Tooltip placement="top" title={item.branch.name}>
                        <div className='smEmployeBranch'>{item.branch.name}</div>
                    </Tooltip>
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

    const isDisabled = usersData && usersData.users.length > 0 ? false : true;

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
                        <ExcelFile filename="findEmployees" element={<SMButton disabled={isDisabled} className="sm-button skills-table-add-skill-button">
                            {SMConfig.search.search.buttons.export} <Icon style={{fontSize: "16px"}} type="cloud-download" />
                            </SMButton>}>
                            <ExcelSheet dataSet={exportExcel(usersData)} name="employees"/>
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

            {usersData && (
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
