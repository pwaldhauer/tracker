var taskStore = require('./TaskStore');
var TimeHelper = require('./TimeHelper');
var React = require('react');

var addons = require('react-addons');
var ProjectTaskList = React.createClass({


  render: function() {
    var createItem = function(item) {
        var onClick = function() {
            if(taskStore.getCurrentId() === item.id) {
                return;
            }

            taskStore.setCurrentId(item.id);
        };

        var cx = addons.classSet;
        var classes = cx({
           'list-item': true,
           'list-item-active': item.id === taskStore.getCurrentId()
         });


        return <li className={classes} onClick={onClick}>
                    <div className="item-info">
                        <span className="item-tracker">{item.tracker}</span>
                        <span className="item-title">{item.title} <a href={item.url} target="_blank">→</a></span>
                    </div>
                    {item.time_current ?
                    <div className="item-times">
                        {TimeHelper.renderTime(item.time_current)}
                    </div> : ''}
                </li>
    };
    return  <div>
                <div className="lists-project-header">
                    <h3>{this.props.title}</h3>
                </div>
                <ul className="lists-list">{this.props.items.map(createItem)}</ul>
            </div>;

  }
});

module.exports = ProjectTaskList;
