import React, {Component, PropTypes} from 'react';
import Test2 from './Test2';


export default class Test extends Component {
    render() {
        const b = 1;
        const a = 11;
        const {variable} = this.props;
        return (
            <div>
                <Test2
                    variable={'Test'}
                />{a} {b}
                <span>{`It prints test in ${variable}`}</span>
            </div>
        );
    }
}

Test.propTypes = {
    variable: PropTypes.string.isRequired
};
