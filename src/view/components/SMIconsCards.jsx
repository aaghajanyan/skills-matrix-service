import React, {useEffect, useState} from "react";
import PropTypes from 'prop-types';
import {Row} from "antd";
import {debounce} from 'throttle-debounce';
import {SMSearch} from 'src/view/components';
import {SMCard} from './SMCard';

function SMIconsCards(props) {
    const icons = Object.assign({}, props.fab, props.fas, props.far)

    const [iconsDataSource, setIconsDataSource] = useState(null);
    const [awesomeIconsList, setAwesomeIconsList] = useState(icons);

    const handleClick = (name) => {
        props.clickToIcon(name);
    }

    const collectIconsData = (data) => {
        const brandIconUiList = Object.keys(data).map((icon, index) => {
            return data[icon].prefix && data[icon].iconName &&
                <SMCard
                    key={data[icon].iconName ? data[icon].iconName : index}
                    className="sm-card-col"
                    cardClassName='sm-card'
                    iconClassName='skills-icon'
                    onClick={handleClick}
                    iconType={data[icon].prefix}
                    icon={data[icon].iconName}
                    clickedItem={(data[icon].iconName)}
                    title={data[icon].iconName}
                />
        });
        return brandIconUiList;
    }

    const collectIconsDataAndRender = (data) => {
        setIconsDataSource(collectIconsData(data));
    }

    useEffect(() => {
        setAwesomeIconsList(icons);
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

SMIconsCards.propTypes = {
    clickToIcon: PropTypes.func,
};

export { SMIconsCards };
