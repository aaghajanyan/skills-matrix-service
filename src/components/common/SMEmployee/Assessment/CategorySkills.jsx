import React from 'react';
import { SMTable } from 'components/common/SMTable/SMTable';
import { SMButton } from 'components/common/SMButton/SMButton';
// import { Popconfirm } from 'antd';
import { Tag } from 'antd'; //TODO : move to common components
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
library.add(fab, far, fas)


function CategorySkills({ className }) {
  const items = [
    {
      key: '1',
      icon: <FontAwesomeIcon icon={['fab', 'js']} style={{ width: '30px', height: '30px' }} />,
      skill: "JavaScript",
      assesment: "5",
      date: "2018.07.25",
      categories: [
        <Tag key='1' color="volcano" className='skills-categories-tags'>Front End</Tag>,
        <Tag key='2' color="cyan" className='skills-categories-tags'>Scripting</Tag>,
        <Tag key='3' color="orange" className='skills-categories-tags'>Back End</Tag>
      ]
    },
    {
      key: '2',
      icon: <FontAwesomeIcon icon={['fab', 'git-alt']} style={{ width: '30px', height: '30px' }} />,
      skill: "Git",
      assesment: "2",
      date: "2017.06.14",
      categories: [
        <Tag key='4' color="blue" className='skills-categories-tags'>Tools</Tag>
      ]
    },
    {
      key: '3',
      icon: <FontAwesomeIcon icon={['fab', 'react']} style={{ width: '30px', height: '30px' }} />,
      skill: "React JS",
      assesment: "5",
      date: "2018.07.25",
      categories: [
        <Tag key='1' color="volcano" className='skills-categories-tags'>Front End</Tag>
      ]
    },
    {
      key: '4',
      icon: <FontAwesomeIcon icon={['fab', 'android']} style={{ width: '30px', height: '30px' }} />,
      skill: "Android",
      assesment: "3",
      date: "2018.06.15",
      categories: [
        <Tag key='1' color="green" className='skills-categories-tags'>Mobile</Tag>
      ]
    },
    {
      key: '5',
      icon: <FontAwesomeIcon icon={['fab', 'aws']} style={{ width: '30px', height: '30px' }} />,
      skill: "AWS",
      assesment: "3",
      date: "2017.06.14",
      categories: [
        <Tag key='1' color="purple" className='skills-categories-tags'>Cloud</Tag>
      ]
    },
    {
      key: '6',
      icon: <FontAwesomeIcon icon={['fab', 'python']} style={{ width: '30px', height: '30px' }} />,
      skill: "Python",
      assesment: "3",
      date: "2017.04.29",
      categories: [
        <Tag key='1' color="cyan" className='skills-categories-tags'>Scripting</Tag>,
        <Tag key='2' color="orange" className='skills-categories-tags'>Back End</Tag>
      ]
    },
    {
      key: '7',
      icon: <FontAwesomeIcon icon={['fab', 'wordpress']} style={{ width: '30px', height: '30px' }} />,
      skill: "Wordpress",
      assesment: "3",
      date: "2019.06.16",
      categories: [
        <Tag key='1' color="volcano" className='skills-categories-tags'>Front End</Tag>
      ]
    },

  ];

  const  comparator =  (a, b) =>{
    if (a > b) { return -1; }
    if (a < b) { return 1; }
    return 0;
  }
  const  comparatorDate =  (a, b) => {
    const date1 = new Date(a)
    const date2 = new Date(b)
    if (date1 > date2) { return -1; }
    if (date1 < date2) { return 1; }
    return 0;
  }

  const columns = [
    {
      title: 'Skill',
      dataIndex: 'icon',
      width: '5%'
    },
    {
      dataIndex: 'skill',
      width: '15%',
      sorter: (a, b) => comparator(a.skill, b.skill),
    },
    {
      title: 'Assessment',
      dataIndex: 'assesment',
      sorter: (a, b) => comparator(a.assesment, b.assesment),
      width: '20%'
    },
    {
      title: "Date",
      dataIndex: "date",
      width: '20%',
      sorter: (a, b) => comparatorDate(a.date, b.date),
    },
    {
      title: 'Categories',
      dataIndex: 'categories',
      width: '30%'
    },
    {
      title: "",
      dataIndex: "operation",
      render: (text, record) =>
        items.length >= 1 ? (
          <div style={{cursor : 'not-allowed', opacity: '0.5', width: '100px', paddingLeft: '45px'}}>
              <span> <FontAwesomeIcon icon={['fas', 'pencil-alt']} style={{ width: '20px', height: '20px'}} /> </span>
              <span> <FontAwesomeIcon icon={['far', 'trash-alt']} style={{ width: '20px', height: '20px', marginLeft: '10px'}} /> </span>
            {/*
            //TODO check if current user is admin
            <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
            </Popconfirm> */}

          </div>
        ) : null,
        width: '10%'
    }
  ];
  const pagination = false;
  const showHeader = true;

  //TODO
  // const handleDelete = key => {
  //   setData(data.filter(item => item.key !== key))
  // };

  return (
    <div className={className}>
      <div className='skills-table-header'>
        <h1>All Skills</h1>
        <SMButton className='sm-button skills-table-add-skill-button'>
          Add Skill
        </SMButton>
      </div>
      <SMTable className="b c" columns={columns} showHeader={showHeader} dataSource={items} pagination={pagination} ></SMTable>
    </div>
  )
}

export { CategorySkills };