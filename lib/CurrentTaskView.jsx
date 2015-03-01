var taskStore = require('./TaskStore');
var timerStore = require('./TimerStore');

var TimeHelper = require('./TimeHelper');

var React = require('react');
var addons = require('react-addons');

var CurrentTaskView = React.createClass({


    getInitialState: function() {
       return {
        task: taskStore.getCurrentItem()
        }
    },

    componentDidMount: function() {
      taskStore.on('changeCurrent', this.onChange);
      taskStore.on('changeTime', this.onTimerTick);

      timerStore.on('stateChange', this.onTimerStateChange);
    },

    componentWillUnmount: function() {
      taskStore.removeListener('changeCurrent', this.onChange);
      taskStore.removeListener('changeTime', this.onTimerTick);

      timerStore.removeListener('stateChange', this.onTimerStateChange);
    },

    onChange: function(e) {
        if(!timerStore.isStopped()) {
            timerStore.pauseTimer();
        }

        var task = taskStore.getCurrentItem();

        this.setState({task: task});

        timerStore.currentTask = task;
        if(task['time_current'] !== 0) {
            timerStore.pauseTimer();
        } else {
            timerStore.stopTimer();
        }
    },

    onTimerTick: function(e) {
        this.setState({task: taskStore.getCurrentItem()});
    },

    onTimerStateChange: function(e) {
        this.forceUpdate();
    },

     endButtonClick: function() {
        taskStore.saveTime(this.state.task.id, this.state.task.time_current);
        timerStore.stopTimer();
     },


     resetButtonClick: function() {
        timerStore.stopTimer();
     },

     startButtonClick: function() {
        if(timerStore.isStarted()) {
            timerStore.pauseTimer();

            return;
        }

        if(timerStore.isStopped() || timerStore.isPaused()) {
            timerStore.startTimer();
            return;
        }
     },

  render: function() {
    if(this.state.task == null) {
        return  <div>
                   <div className="task-info">
                        <h2>Please choose a task.</h2>
                    </div>
                </div>
    }

    var cx = addons.classSet;
    var startClasses = cx({
       'button': true,
       'start-button-inactive': timerStore.isPaused() || timerStore.isStopped(),
       'start-button-active': timerStore.isStarted(),
       'start-button-pause': timerStore.isPaused(),
     });

    var endClasses = cx({
       'button': true,
       'end-button-inactive': timerStore.isStopped(),
       'end-button-active': !timerStore.isStopped()
     });

    /* TODO
        <ul className="info-times">
        <li className="list-item"><strong>Estimated time:</strong> <span className="task-time">{TimeHelper.formatHour(this.state.task.time_estimated)}</span></li>
        <li className="list-item"><strong>Logged time:</strong> <span className="task-time task-time-critical">{TimeHelper.formatHour(this.state.task.time_logged)}</span></li>
        </ul>
    */

    return  <div>
               <div className="task-info">
                    <h2>{this.state.task.title}</h2>
                    </div>

                    <div className="task-current-time">
                        {TimeHelper.renderTime(this.state.task.time_current)}
                    </div>

                    <div className="task-start-stop">
                        <button className={startClasses} onClick={this.startButtonClick}>{timerStore.isStarted() ? 'Pause' : 'Start'}</button>
                        <button className={endClasses} onClick={this.endButtonClick}>Stop & Save</button>
                    </div>

                    {(timerStore.isPaused() || timerStore.isStarted()) ?
                        <div className="task-reset">
                            <a className="reset-button" onClick={this.resetButtonClick}>Reset</a>
                        </div>: ''}

            </div>;

  }
});

module.exports = CurrentTaskView;
