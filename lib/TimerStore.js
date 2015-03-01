var taskStore = require('./TaskStore');
var EventEmitter = require('node-event-emitter');

var TimerStore = function(taskStore) {
    this.states = {
        STOPPED: 0,
        PAUSED: 1,
        STARTED: 2
    };

    this.currentTask = null;
    this.currentInterval = null;
    this.state = 0;
}

TimerStore.prototype.__proto__ = EventEmitter.prototype;

TimerStore.prototype.isStarted = function() {
    return this.state === this.states.STARTED;
}

TimerStore.prototype.isPaused = function() {
    return this.state === this.states.PAUSED;
}

TimerStore.prototype.isStopped = function() {
    return this.state === this.states.STOPPED;
}

TimerStore.prototype.startTimer = function() {
    this.currentInterval = setInterval(this.tick.bind(this), 1000);
    this.state = this.states.STARTED;
    this.emit('stateChange');
}

TimerStore.prototype.pauseTimer = function() {
    clearInterval(this.currentInterval);
    this.state = this.states.PAUSED;
    this.emit('stateChange');
}

TimerStore.prototype.stopTimer = function() {
    clearInterval(this.currentInterval);
    taskStore.updateTimeForItem(this.currentTask.id, 0);
    this.state = this.states.STOPPED;
    this.emit('stateChange');
}


TimerStore.prototype.tick = function() {
    var seconds = this.currentTask.time_current + 1;
    taskStore.updateTimeForItem(this.currentTask.id, seconds);
}

module.exports = new TimerStore();
