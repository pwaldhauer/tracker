var React = require('react');

var taskStore = require('./TaskStore');
var TaskListFilter = React.createClass({
    onChange: function(e) {
        taskStore.setFilter(e.target.value);
    },

    render: function() {
        return <div className="list-filter">
            <input className="filter-input" type="text" placeholder="Filter tasks" onChange={this.onChange} />
        </div>
    }

});

module.exports = TaskListFilter;
