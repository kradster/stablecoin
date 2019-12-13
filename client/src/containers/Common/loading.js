import React from 'react'
import { connect } from 'react-redux';

class Loading extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isVisible: false };
    }

    componentWillReceiveProps(np) {
        if (np.isLoading) {
            this.setState(() => {
                return {
                    isVisible: true
                };
            });
        }
    }

    render() {
        return (
            this.props.isLoading ?
                <div style={{ zIndex: "9999999999", background: "rgba(0,0,0,0.5)" }} className="w100 h100 position-fixed display-flex">
                    <div className="myloader radius-full margin-auto h100px width-100px display-block">

                    </div>
                </div>
                : <span></span>
        );
    }
}

const mapPropToState = state => {
    return {
        isLoading: state.loading.data.isLoading
    }
}

export default connect(mapPropToState)(Loading);
