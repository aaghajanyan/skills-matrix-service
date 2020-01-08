import React from 'react';
import { Tag } from 'antd'; //TODO : move to common components
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
library.add(fab, far, fas)

const categories = [
  {
    key: '1',
    name: "Front End",
    average: "3.5",
    date: "2019.07.25",
  },
  {
    key: '2',
    name: "Back End",
    average: "3.7",
    date: "2018.07.25",
  },
  {
    key: '3',
    name: "Database technologies",
    average: "4.4",
    date: "2018.06.15",
  },
  {
    key: '4',
    name: "Mobile",
    average: "3.2",
    date: "2017.06.14",
  },
  {
    key: '5',
    name: "Tools",
    average: "3.3",
    date: "2017.07.15",
  },

];

const categorySkills = [
  {
    key: '1',
    icon: <FontAwesomeIcon icon={['fab', 'js']} style={{ width: '30px', height: '30px' }} />,
    skill: "JavaScript",
    assesment: "5",
    date: "2018.07.25",
    categories: [
      <Tag key='1' color="volcano" className='sm-tag'>Front End</Tag>,
      <Tag key='2' color="cyan" className='sm-tag'>Scripting</Tag>,
      <Tag key='3' color="orange" className='sm-tag'>Back End</Tag>
    ]
  },
  {
    key: '2',
    icon: <FontAwesomeIcon icon={['fab', 'git-alt']} style={{ width: '30px', height: '30px' }} />,
    skill: "Git",
    assesment: "2",
    date: "2017.06.14",
    categories: [
      <Tag key='4' color="blue" className='sm-tag'>Tools</Tag>
    ]
  },
  {
    key: '3',
    icon: <FontAwesomeIcon icon={['fab', 'react']} style={{ width: '30px', height: '30px' }} />,
    skill: "React JS",
    assesment: "5",
    date: "2018.07.25",
    categories: [
      <Tag key='1' color="volcano" className='sm-tag'>Front End</Tag>
    ]
  },
  {
    key: '4',
    icon: <FontAwesomeIcon icon={['fab', 'android']} style={{ width: '30px', height: '30px' }} />,
    skill: "Android",
    assesment: "3",
    date: "2018.06.15",
    categories: [
      <Tag key='1' color="green" className='sm-tag'>Mobile</Tag>
    ]
  },
  {
    key: '5',
    icon: <FontAwesomeIcon icon={['fab', 'aws']} style={{ width: '30px', height: '30px' }} />,
    skill: "AWS",
    assesment: "3",
    date: "2017.06.14",
    categories: [
      <Tag key='1' color="purple" className='sm-tag'>Cloud</Tag>
    ]
  },
  {
    key: '6',
    icon: <FontAwesomeIcon icon={['fab', 'python']} style={{ width: '30px', height: '30px' }} />,
    skill: "Python",
    assesment: "3",
    date: "2017.04.29",
    categories: [
      <Tag key='1' color="cyan" className='sm-tag'>Scripting</Tag>,
      <Tag key='2' color="orange" className='sm-tag'>Back End</Tag>
    ]
  },
  {
    key: '7',
    icon: <FontAwesomeIcon icon={['fab', 'wordpress']} style={{ width: '30px', height: '30px' }} />,
    skill: "Wordpress",
    assesment: "3",
    date: "2019.06.16",
    categories: [
      <Tag key='1' color="volcano" className='sm-tag'>Front End</Tag>
    ]
  },

];

export { categories, categorySkills }