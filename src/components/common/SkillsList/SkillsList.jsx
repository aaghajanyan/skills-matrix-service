import React from 'react'
import { List } from 'antd';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
library.add(fab)

function SkillsList({className, data}) {

    const renderItem = (item) => {
        return (
            <List.Item>
                <div className='sm-skills-list-item' style={{display:"flex", width:"100%", alignItems: 'center'}}>
                    <FontAwesomeIcon icon={['fab', item.icon]} style={{flex: '1' , width: '30px', height: '30px'}} />
                    <span style={{flex: '6' }}> {item.skill} </span>
                    <span style={{flex: '1' }}> {item.mark} </span>
                </div>
            </List.Item>
        )
    }

    return (
        <List
            className={className}
            itemLayout="horizontal"
            dataSource={data}
            renderItem={renderItem}
        >
        </List>
    )
}

export { SkillsList };