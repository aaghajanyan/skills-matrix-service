import React, { useState } from 'react';
import { SMTable } from 'components/common/SMTable/SMTable';

import {Popconfirm} from 'antd';

import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
library.add(fab)

function Categories({className}) {
    const  item = [
        {
          key: '1',
          icon: <FontAwesomeIcon icon={['fab', 'java']} style={{width: '30px', height: '30px'}} />,
          name: "Front End",
          average:"3.5",
          date:"25.07.2018",  
        },
        {
          key: '2',
          icon: <FontAwesomeIcon icon={['fab', 'java']} style={{width: '30px', height: '30px'}} />,
          name: "Back End",
          average:"3.7",
          date:"25.07.2018",  
        },
        {
          key: '3',
          icon: <FontAwesomeIcon icon={['fab', 'java']} style={{width: '30px', height: '30px'}} />,
          name: "Database technologies",
          average:"4.4",
          date:"14.06.2017",  
        },
        {
          key: '4',
          icon: <FontAwesomeIcon icon={['fab', 'java']} style={{width: '30px', height: '30px'}} />,
          name: "Mobile",
          average:"3.2",
          date:"14.06.2017",  
        },
        {
          key: '5',
          icon: <FontAwesomeIcon icon={['fab', 'java']} style={{width: '30px', height: '30px'}} />,
          name: "Tools",
          average:"3.3",
          date:"14.06.2017",  
        },

      ];

    const columns = [
        {
          title: 'Name',
          dataIndex: 'name',
          
        },
        {
          title: 'Average',
          dataIndex: 'average',
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
                  {/* <span> <Svg name="delete" svg={SvgIcons['delete']}/> </span> */}
              </Popconfirm>
          </div>
            ) : null,
        },
      ];
    const pagination = false;
    const showHeader= true;
    const [data, setData] = useState(item);
    const handleDelete = key => {
      // const dataSources = [...data];
      // debugger;
      setData(data.filter(item => item.key !== key) )
    };


    return (
        <div className={className}>
            <h1>Categories</h1>

            <SMTable columns={columns} showHeader={showHeader} dataSource={data} pagination={pagination} ></SMTable>
        </div>
    )
}

export { Categories };