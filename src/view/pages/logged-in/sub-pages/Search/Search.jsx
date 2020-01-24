import React, {useState, useRef, useEffect} from 'react';
import { Row, Form, Icon } from 'antd';
import { SearchDataView } from 'view/pages/logged-in/sub-pages/Search/SearchDataView/SearchDataView';
import { SMUserBar } from 'view/pages/logged-in/components/SMUserBar';
import { SMButton } from 'view/components/SMButton';
import { useSelector, useDispatch } from 'react-redux';

import {doSearch, getCriteria} from 'store/actions/search';

import SearchTree from './SearchTree';

function FindPeople(props) {

    const [collapseFind, setCollapseFind] = useState(false);

    const refForScroll = useRef();
    const dispatch = useDispatch();

    useEffect( () => {
        getCriteria();
    }, []);

    const getTree = (data) => {
        dispatch(doSearch(data));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        refForScroll.current.scrollTo(0,0);
        setCollapseFind(true);
    };

    const collapsesOut = () => {
        setCollapseFind(false);
    };

    const usersData = useSelector((state) => {
        if(state.Search.items && state.Search.items.data) {
            state.Search.items.data = state.Search.items.data.map(item => {
                item.key = item.guid;
                const colorCode = Math.floor(100000 + Math.random() * 900000);
                item.avatar = <SMUserBar
                    colorCode={colorCode}
                    firstName={item.fname}
                    lastName={item.lname}
                    size='medium'
                />;
                return item;
            });

            return ({
                users: state.Search.items.data,
                fieldValues: state.Search.items.values,
                loading: state.Search.loading,
                error: state.Search.error
            });
        }

    });

    return (
        <>
        <div ref={refForScroll} className={`main_container_people_finder ${collapseFind && 'default_main_container'} `}>
            <Row className="people_finder_header">
                <div><h1>Find people </h1></div>
                <div> <SMButton className="sm-button skills-table-add-skill-button">
                    Export AS
                </SMButton></div>
            </Row>
            <Row className= {collapseFind ? "collapses_visible" : "collapses_hidden"}>
                <Icon onClick={collapsesOut} type="double-right" />
            </Row>
            <Form onSubmit={handleSubmit}>
                <Form.Item>
                    <SearchTree disabledBtn={collapseFind} data={usersData} location={props.location} getTree={getTree} formItem={props.form}/>
                </Form.Item>
            </Form>
        </div>

        {usersData && usersData.users && <SearchDataView userData={usersData.users} history={props.history}/> }
        </>
    );
}

const Search = Form.create({ name: 'Search' })(FindPeople);
export { Search };