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
  ];

  return (
    <div className={className}>
      <h1>Categories</h1>

      <SMTable columns={columns} dataSource={items} pagination={false} ></SMTable>
    </div>
  )
}

export { Categories };