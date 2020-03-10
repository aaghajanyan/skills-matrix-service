import React from "react";
import PropTypes from 'prop-types';
import {Card, Col} from "antd";
import {SMIcon} from 'src/view/components';
import {toRGB} from 'src/helpers/generateColor';

function SMCard(props) {

    const handleClick = (name) => {
        props.onClick(name);
    }

    return (
        <Col className={props.className}>
            <Card key={props.der} className={props.cardClassName} onClick={() => handleClick(props.clickedItem)}
                hoverable
                cover={<SMIcon style={{color:toRGB(props.icon).color}}  className={props.iconClassName} iconType={props.iconType} icon={props.icon}/>}
            >
                {/* <Meta title={props.title}/> */}
            </Card>
        </Col>
    );
}

SMCard.propTypes = {
    onClick: PropTypes.func,
    className: PropTypes.string,
    cardClassName: PropTypes.string,
    iconClassName: PropTypes.string,
    iconType: PropTypes.oneOf(['fab', 'far', 'fas']),
    icon: PropTypes.string,
    title: PropTypes.string,
    clickedItem: PropTypes.string
};

export { SMCard };
