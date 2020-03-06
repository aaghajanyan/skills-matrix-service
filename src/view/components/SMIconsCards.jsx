import React, {useEffect, useState} from "react";
import { Card, Icon, Avatar } from "antd";
const { Meta, Grid } = Card;
import { Row, Col } from "antd";
import * as brandIcons from "@fortawesome/free-brands-svg-icons";
import {SMIcon} from 'src/view/components';
import {library} from '@fortawesome/fontawesome-svg-core';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';
import {debounce} from 'throttle-debounce';
import {SMSearch} from 'src/view/components';

library.add(fab, far, fas);

function SMIconsCards(props) {

    const [iconsDataSource, setIconsDataSource] = useState(null);
    const [awesomeIconsList, setAwesomeIconsList] = useState(brandIcons);

    const handleClick = (name) => {
        props.onIconClick(name);
    }

    const collectIconsData = (data) => {
        const brandIconUiList = Object.keys(data).map((icon, index) => {
            return data[icon].prefix && data[icon].iconName &&
                <Col  key={data[icon].iconName ? data[icon].iconName : index}  className="gutter-row">
                    <Card className="sm-card" onClick={() => handleClick(data[icon].iconName)}
                        hoverable
                        cover={<SMIcon style={{flex: '1' , width: '30px', height: '30px'}}  iconType={data[icon].prefix} icon={data[icon].iconName} />}
                    >
                        <Meta title={data[icon].iconName}/>
                    </Card>
                </Col>
        });
        return brandIconUiList;
    }

    const collectIconsDataAndRender = (data) => {
        setIconsDataSource(collectIconsData(data));
    }

    useEffect(() => {
        setAwesomeIconsList(brandIcons);
    },[]);

    useEffect(() => {
        collectIconsDataAndRender(awesomeIconsList);
    },[awesomeIconsList]);

    const handleSearchInputChange = (e) => {
        e.persist();
        const value = e.target.value;
        debounce(300, () => {
            const filtredData = [];
            Object.keys(awesomeIconsList).map((icon, index) => {
                if (awesomeIconsList[icon].iconName !== undefined) {
                    if (awesomeIconsList[icon].iconName.toLowerCase().includes(value.toLowerCase()) && filtredData.indexOf(awesomeIconsList[icon]) === -1) {
                        filtredData.push(awesomeIconsList[icon]);
                    }
                }
            });
            collectIconsDataAndRender(filtredData)
        })()
    }

    return (
        <>
            <SMSearch
                placeholder="Search icon..."
                className='sm-search-criteria'
                onChange={e => handleSearchInputChange(e)}
                />
            <div className="sm-icon-container">
                <Row >
                    {iconsDataSource}
                </Row>
            </div>
        </>
    );
}

export { SMIconsCards };
