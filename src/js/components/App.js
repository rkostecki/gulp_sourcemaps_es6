var React       = require('react');
var Test = require('./Test').default;
module.exports = React.createClass({
    displayName: 'App',
    render: function () {
        return (
            <div>
                <h1>{'App example'}</h1>
                <Test
                    variable="123"
                />
            </div>
        );
    }
});
