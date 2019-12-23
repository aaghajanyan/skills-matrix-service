import React from 'react';
import { SMTable } from 'components/common/SMTable/SMTable';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
library.add(fab)

function Categories({ className }) {
  const items = [
    {
      key: '1',
      name: "Front End",
      average: "3.5",
      date: "25.07.2018",
    },
    {
      key: '2',
      name: "Back End",
      average: "3.7",
      date: "25.07.2018",
    },
    {
      key: '3',
      name: "Database technologies",
      average: "4.4",
      date: "14.06.2017",
    },
    {
      key: '4',
      name: "Mobile",
      average: "3.2",
      date: "14.06.2017",
    },
    {
      key: '5',
      name: "Tools",
      average: "3.3",
      date: "14.06.2017",
    },

  ];

  const  comparator =  (a, b) =>{
    if (a > b) { return -1; }
    if (a < b) { return 1; }
    return 0;
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: '33%',
      sorter: (a, b) => comparator(a.name, b.name),

    },
    {
      title: 'Average',
      dataIndex: 'average',
      width: '33%',
      sorter: (a, b) => comparator(a.average, b.average),
    },
    {
      title: "Date",
      dataIndex: "date",
      width: '33%',
    },
  ];

  return (
    <div className={className}>
      <h1>Categories</h1>

      <SMTable columns={columns} dataSource={items} pagination={false} ></SMTable>
    </div>
  )
}

export { Categories };