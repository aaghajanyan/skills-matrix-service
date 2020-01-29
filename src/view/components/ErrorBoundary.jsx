import * as React from "react";
import {Modal} from "antd";

class ErrorBoundary extends React.Component {
    state = {
        error: null,
        errorInfo: null
    };

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        })
    }

    handleError = () => {
        // window.location.href = "/"
    };


    render() {
        if (this.state.error !== null) {
            let timeout = 5;
            const errorModal = Modal.error({
                title: 'Something went wrong',
                okText: "Reload immediately",
                onOk: this.handleError
            });
            const interval = setInterval(() => {
                errorModal.update( {
                    content: `This page will be reloaded after ${ timeout-- }s`,
                });
                if(timeout < 1){
                    errorModal.update( {
                        visible: false,
                    });
                    clearInterval(interval);
                    this.handleError()
                }
            }, 1000);


        }
        return this.props.children;
    }
}


export {ErrorBoundary}