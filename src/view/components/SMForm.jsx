import React, {useEffect} from 'react';
import {Form} from 'antd';
import PropTypes from 'prop-types';

function SMFormInitial(props) {
    const {getFieldDecorator, resetFields, getFieldsValue} = props.form;

    const handleSubmit = e => {
        e.preventDefault();
        if (props.onCancel) {
            props.getFormCurrentValues(getFieldsValue());
            props.onSubmit();
        }
        props.form.validateFieldsAndScroll((err, values) => {
            if(!err) {
                props.onSubmit(values);
            }
        });
    };

    useEffect(() => {
        !props.resetValues  ? resetFields() : null;
        props.getFormCurrentValues(getFieldsValue());
    }, [props.resetValues]);

    const renderFormItems = () => {
        return props.items && props.items.map(item => {
            return (
                <Form.Item
                    key={item.props.name}
                    validateStatus={item.props.status}
                    help={item.props.help}
                >
                    {getFieldDecorator(item.props.name, {
                        rules: item.props.rules, initialValue: item.props.initialvalue,
                    })(item)}
                </Form.Item>
            );
        });
    };

    const renderFormButtons = () => {
        return props.buttons && props.buttons.map(item => {
            return (
                <Form.Item
                    key={item.props.name}
                    validateStatus={item.props.status}
                    help={item.props.help}
                    onClick={item.props.name === 'cancel' ? props.onCancel : ()=>{}}
                >
                    {getFieldDecorator(item.props.name, {
                        rules: item.props.rules,
                    })(item)}
                </Form.Item>
            );
        });
    };

    return (
        <Form className={props.className} onSubmit={handleSubmit}>
            <div className="sm-form-fields">
                {renderFormItems()}
            </div>
            {renderFormButtons()}
        </Form>
    );


}

const SMForm = Form.create({name: 'SMForm'})(SMFormInitial);

export {SMForm};

SMFormInitial.propTypes = {
    className: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.node),
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    resetValues: PropTypes.bool,
    initialvalue: PropTypes.string,
    getFormCurrentValues: PropTypes.func
};