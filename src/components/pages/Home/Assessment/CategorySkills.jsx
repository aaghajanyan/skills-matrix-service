import React, { useState } from 'react';
import { SMTable } from 'components/common/SMTable/SMTable';
import { Popconfirm } from 'antd';
import { Tag } from 'antd'; //TODO : move to common components
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
library.add(fab, far, fas)


function CategorySkills({ className }) {
  const item = [
    {
      key: '1',
      icon: <FontAwesomeIcon icon={['fab', 'js']} style={{ width: '30px', height: '30px' }} />,
      skill: "JavaScript",
      assesment: "5",
      date: "25.07.2018",
      categories: [
          <Tag color="volcano" className='skills-categories-tags'>Front End</Tag>,
          <Tag color="cyan" className='skills-categories-tags'>Scripting</Tag>,
          <Tag color="orange" className='skills-categories-tags'>Back End</Tag>
      ]
    },
    {
      key: '2',
      icon: <FontAwesomeIcon icon={['fab', 'git-alt']} style={{ width: '30px', height: '30px' }} />,
      skill: "Git",
      assesment: "2",
      date: "14.06.2017",
      categories: [
        <Tag color="blue" className='skills-categories-tags'>Tools</Tag>
      ]
    },
    {
      key: '3',
      icon: <FontAwesomeIcon icon={['fab', 'react']} style={{ width: '30px', height: '30px' }} />,
      skill: "React JS",
      assesment: "5",
      date: "25.07.2018",
      categories: [
          <Tag color="volcano" className='skills-categories-tags'>Front End</Tag>
      ]
    },
    {
      key: '4',
      icon: <FontAwesomeIcon icon={['fab', 'android']} style={{ width: '30px', height: '30px' }} />,
      skill: "Android",
      assesment: "3",
      date: "14.06.2017",
      categories: [
        <Tag color="green" className='skills-categories-tags'>Mobile</Tag>
      ]
    },
    {
      key: '5',
      icon: <FontAwesomeIcon icon={['fab', 'aws']} style={{ width: '30px', height: '30px' }} />,
      skill: "AWS",
      assesment: "3",
      date: "14.06.2017",
      categories: [
        <Tag color="purple" className='skills-categories-tags'>Cloud</Tag>
      ]
    },
    {
      key: '6',
      icon: <FontAwesomeIcon icon={['fab', 'python']} style={{ width: '30px', height: '30px' }} />,
      skill: "Python",
      assesment: "3",
      date: "14.06.2017",
      categories: [
        <Tag color="cyan" className='skills-categories-tags'>Scripting</Tag>,
        <Tag color="orange" className='skills-categories-tags'>Back End</Tag>
      ]
    },
    {
      key: '7',
      icon: <FontAwesomeIcon icon={['fab', 'wordpress']} style={{ width: '30px', height: '30px' }} />,
      skill: "Wordpress",
      assesment: "3",
      date: "14.06.2017",
      categories: [
        <Tag color="volcano" className='skills-categories-tags'>Front End</Tag>
    ]
    },

  ];

  const columns = [
    {
      title: 'Skill',
      dataIndex: 'icon',
    },
    {
      dataIndex: 'skill',
    },
    {
      title: 'Assessment',
      dataIndex: 'assesment',
    },
    {
      title: "Date",
      dataIndex: "date",
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
        data.length >= 1 ? (
          <div>
            <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
            <span> <FontAwesomeIcon icon={['fas', 'pencil-alt']} style={{ width: '20px', height: '20px', color: '#42982C' }} /> </span>
              <span> <FontAwesomeIcon icon={['far', 'trash-alt']} style={{ width: '20px', height: '20px', color: '#961616', marginLeft: '10px' }} /> </span>
            </Popconfirm>

          </div>
        ) : null,
    }
  ];
  const pagination = false;
  const showHeader = true;
  const [data, setData] = useState(item);
  const handleDelete = key => {
    // const dataSources = [...data];
    // debugger;
    setData(data.filter(item => item.key !== key))
  };

  return (
    <div className={className}>
      <h1>All Skills</h1>

      <SMTable className="b c" columns={columns} showHeader={showHeader} dataSource={data} pagination={pagination} ></SMTable>
    </div>
  )
}

export { CategorySkills };