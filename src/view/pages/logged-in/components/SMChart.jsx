import React from 'react';
import {Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis} from 'recharts';
import {toRGB} from 'src/helpers/generateColor';
import {Empty} from 'antd';
import PropTypes from 'prop-types';

function SMChart(props) {

    let categories = [];
    let skills = [];

    const getValidCategories = () => {
        if(props.keys.length === 0) {
            categories = [];
        }
        categories = props.data.filter( category => {
            return Object.keys(category).length > 1;
        })

        categories.map(category => {
            Object.keys(category).map(skill => {
                if (skill !== "name") {
                    skills.push(skill);
                }
            })
        })
    }

    getValidCategories();

    return (
        <div className={props.className}>
            <h3 className="sm-subheading"> Top Skills Categories</h3>
            {categories.length === 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> :
                <BarChart
                    width={props.width}
                    height={props.height}
                    data={categories}
                    className="sm-chart"
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {skills.map((key) =>
                        <Bar dataKey={key} fill={toRGB(key.toLowerCase()).color} key={key}>
                        </Bar>
                    )}
                </BarChart>
            }
        </div>
    );
}

SMChart.propTypes = {
    className: PropTypes.string,
    id: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string,
    style: PropTypes.string,
    htmlType: PropTypes.string,
    href: PropTypes.string,
    loading: PropTypes.bool,
    onClick: PropTypes.func,
    target: PropTypes.string
};
export {SMChart};