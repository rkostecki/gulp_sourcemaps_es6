import React, {Component, PropTypes} from 'react';
import Sub from './Sub';
export default class Test2 extends Component {

    allSubs() {
        const arr = [1, 2, 3, 12454];
        return arr.map((sub, index) => {
            return <li key={index}><Sub id={sub} /></li>;
        });
    }

    render() {
        const arr = [1, 2, 3, 12454];
        const {variable} = this.props;
        return (
            <div>
                <ul>{this.allSubs()}</ul>
                <div>{`It prints test2 in ${variable}`}</div>
            </div>
        );
    }
}

Test2.propTypes = {
    variable: PropTypes.string.isRequired
};
