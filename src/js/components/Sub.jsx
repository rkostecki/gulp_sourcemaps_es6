import React, {Component, PropTypes} from 'react';

export default class Sub extends Component {
    render() {
        const {id} = this.props;
        return (
            <div>{'Sub'} {id}</div>
        );
    }
}

Sub.propTypes = {
    id: PropTypes.number.isRequired
};
