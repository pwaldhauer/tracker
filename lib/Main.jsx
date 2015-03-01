var React = require('react');

React.initializeTouchEvents(true);

var TimeHelper = require('./TimeHelper');
var taskStore = require('./TaskStore');
var timerStore = require('./TimerStore');

var TaskList = require('./TaskList.jsx');
var CurrentTaskView = require('./CurrentTaskView.jsx');

taskStore.refreshData();

React.render(<div className="wrapper">
            <div className="task-list">
                    <TaskList/>
            </div>
            <div className="current-task">
                <CurrentTaskView/>
            </div>
        </div>, document.querySelectorAll('body')[0]);
