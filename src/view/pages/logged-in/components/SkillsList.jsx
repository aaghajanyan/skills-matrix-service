import React from 'react'
import { List } from 'antd';
import { SMUserBar } from '../components/SMUserBar';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
library.add(fab)

function SkillsList({className, data, title, isUsers}) {

    const renderItem = (item) => {
        return (
            <List.Item>
                <div className='sm-skills-list-item' style={{display:"flex", width:"100%", alignItems: 'center'}}>
                    {!isUsers ? <FontAwesomeIcon icon={['fab', item.icon]} style={{flex: '1' , width: '30px', height: '30px'}} /> :
                    <SMUserBar
                        firstName={item.firstName}
                        lastName={item.lastName}
                        colorCode={Math.floor(100000 + Math.random() * 900000)} >
                    </SMUserBar>}
                    <span style={{flex: '6' }}> {item.skill} </span>
                    {!isUsers && <span style={{flex: '1' }}> {item.mark} </span>}
                </div>
            </List.Item>
        )
    }

    return (
        <div className={className}>
            <h3 className='sm-subheading' > {title} </h3>
            <List
                itemLayout="horizontal"
                dataSource={data}
                renderItem={renderItem}
            >
            </List>
        </div>
    )
}

export { SkillsList };