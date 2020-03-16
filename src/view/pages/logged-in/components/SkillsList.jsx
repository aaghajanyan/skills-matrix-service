import React from 'react';
import {List, Tooltip} from 'antd';
import {SMUserBar} from '../components/SMUserBar';
import {library} from '@fortawesome/fontawesome-svg-core';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';
import {toRGB} from 'src/helpers/generateColor';
import {SMIcon} from 'src/view/components';

library.add(fab, far, fas);

function SkillsList({className, data, title, isUsers}) {

    const renderItem = (item) => {
        return (
            <List.Item>
                <div className="sm-skills-list-item" style={{display:'flex', width:'100%', alignItems: 'center'}}>
                    {!isUsers && item.icon ? <SMIcon style={{width: '30px', height: '30px', color: toRGB(item.icon).color, marginRight: "10px"}}  iconType='fab' icon={item.icon} />
                    :
                    <SMUserBar
                            firstName={item.firstName}
                            lastName={item.lastName}
                            size="medium"
                        />}
                    <span style={{flex: '6'}}> {item.skill} </span>
                    <Tooltip placement="left" title={item.profName}> {item.mark} </Tooltip>
                </div>
            </List.Item>
        );
    };

    return (
        <div className={className}>
            <h3 className="sm-subheading" > {title} </h3>
            <List
                itemLayout="horizontal"
                dataSource={data}
                renderItem={renderItem}
            >
            </List>
        </div>
    );
}

export {SkillsList};