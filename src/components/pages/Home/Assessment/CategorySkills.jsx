import React, { useState } from 'react';
import { SMTable } from 'components/common/SMTable/SMTable';
import { Popconfirm } from 'antd';
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
    },
    {
      key: '2',
      icon: <FontAwesomeIcon icon={['fab', 'react']} style={{ width: '30px', height: '30px' }} />,
      skill: "React JS",
      assesment: "5",
      date: "25.07.2018",
    },
    {
      key: '3',
      icon: <FontAwesomeIcon icon={['fab', 'angular']} style={{ width: '30px', height: '30px' }} />,
      skill: "Angular JS",
      assesment: "4",
      date: "14.06.2017",
    },
    {
      key: '4',
      icon: <FontAwesomeIcon icon={['fab', 'html5']} style={{ width: '30px', height: '30px' }} />,
      skill: "HTML",
      assesment: "4",
      date: "14.06.2017",
    },
    {
      key: '5',
      icon: <FontAwesomeIcon icon={['fab', 'wordpress']} style={{ width: '30px', height: '30px' }} />,
      skill: "Wordpress",
      assesment: "3",
      date: "14.06.2017",
    },
    {
      key: '6',
      icon: <FontAwesomeIcon icon={['fab', 'css3']} style={{ width: '30px', height: '30px' }} />,
      skill: "CSS",
      assesment: "3",
      date: "14.06.2017",
    },
    {
      key: '7',
      icon: <FontAwesomeIcon icon={['fab', 'sass']} style={{ width: '30px', height: '30px' }} />,
      skill: "SCSS",
      assesment: "2",
      date: "14.06.2017",
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
    },
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
      <h1>Front End</h1>

      <SMTable className="b c" columns={columns} showHeader={showHeader} dataSource={data} pagination={pagination} ></SMTable>
    </div>
  )
}

export { CategorySkills };