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
      sorter: (a, b) => comparatorDate(a.date, b.date),
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