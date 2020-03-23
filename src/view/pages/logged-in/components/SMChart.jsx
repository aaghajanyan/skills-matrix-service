import React from 'react';
import {Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis} from 'recharts';
import {toRGB} from 'src/helpers/generateColor';
import PropTypes from 'prop-types';

function SMChart(props) {
    return (
        <div className={props.className}>
            <h3 className="sm-subheading"> Top Skills Categories</h3>
            <BarChart

                width={props.width}
                height={props.height}
                data={props.data}
                className="sm-chart"

            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {props.keys.map((key) =>
                    <Bar dataKey={key} fill={toRGB(key.toLowerCase()).color} key={key}>
                    </Bar>
                )}
            </BarChart>

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