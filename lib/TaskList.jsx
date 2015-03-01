var ProjectTaskList = require('./ProjectTaskList.jsx');
var TaskListFilter = require('./TaskListFilter.jsx');
var taskStore = require('./TaskStore');

var React = require('react');
var TaskList = React.createClass({

    getInitialState: function() {
        return {items: taskStore.getAll()};
    },

    componentDidMount: function() {
      taskStore.on('change', this.onChange);
      taskStore.on('changeTime', this.onChange);
      taskStore.on('changeCurrent', this.onChange);
    },

    componentWillUnmount: function() {
      taskStore.removeListener('change', this.onChange);
      taskStore.removeListener('changeTime', this.onChange);
      taskStore.removeListener('changeCurrent', this.onChange);
    },

    onChange: function(e) {
        this.setState({items: taskStore.getAll()});
    },

  render: function() {
    var createItem = function(item) {
        return <ProjectTaskList items={item.items} title={item.title} />
    };

    return  <div className="task-list-wrapper">
                <TaskListFilter />
                <div className="list-lists">{this.state.items.map(createItem)}</div>
            </div>;
  }
});

module.exports = TaskList;
