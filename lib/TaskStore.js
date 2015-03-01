var ls = require('local-storage');
var EventEmitter = require('node-event-emitter');
var xhr = require('browser-request');

var TaskStore = function TaskStore() {
    this.localTimes = {};
    this.data = [];
    this.filter = null;
    this.currentItemId = '1';

    this.loadLocal();

};

TaskStore.prototype.__proto__ = EventEmitter.prototype;

TaskStore.prototype.loadLocal = function() {
    var local = ls.get('localtimes');
    if (local !== null) {
        this.localTimes = local;
    }
}

TaskStore.prototype.saveLocal = function() {
    ls.set('localtimes', this.localTimes);
}

TaskStore.prototype.refreshData = function() {
    var that = this;
    xhr('/api.php?action=tasks', function(err, res, data) {
        data = JSON.parse(data);
        for (var i in data) {
            for (var o in data[i]['items']) {
                if (that.localTimes.hasOwnProperty(String(data[i]['items'][o]['id']))) {
                    data[i]['items'][o]['time_current'] = that.localTimes[String(data[i]['items'][o]['id'])];
                    continue;
                }

                data[i]['items'][o]['time_current'] = 0;
            }
        }

        that.data = data;
        that.emit('change');
    });
}

TaskStore.prototype.saveTime = function(id, seconds) {
    var that = this;
    xhr.post({uri: '/api.php?action=save', json: {'id': id, 'seconds': seconds}}, function(err, data) {
        console.log('Saved');
    });
}

TaskStore.prototype.setCurrentId = function(id) {
    this.currentItemId = id;
    this.emit('changeCurrent');
}

TaskStore.prototype.getCurrentId = function() {
    return this.currentItemId;
}

TaskStore.prototype.setFilter = function(filter) {
    this.filter = filter;
    this.emit('change');
}

TaskStore.prototype.updateTimeForItem = function(id, seconds) {
    this.localTimes[String(id)] = seconds;
    this.saveLocal();

    for (var i in this.data) {
        project = this.data[i];
        var items = [];

        for (var o in project.items) {
            item = project.items[o];
            if (item.id === id) {
                item['time_current'] = seconds;
                this.emit('changeTime');

                return;
            }
        }
    }
}

TaskStore.prototype.getCurrentItem = function() {
    if (this.currentItemId == null) {
        return null;
    }

    for (var i in this.data) {
        project = this.data[i];
        var items = [];

        for (var o in project.items) {
            item = project.items[o];
            if (item.id === this.currentItemId) {
                return item;
            }
        }
    }

    return null;
}

TaskStore.prototype.getAll = function() {
    var that = this;

    if (this.filter === null) {
        return this.data;
    }

    var filtered = [];
    for (var i in this.data) {
        project = this.data[i];
        var items = [];

        for (var o in project.items) {
            item = project.items[o];
            if (item.title.toLowerCase().indexOf(that.filter.toLowerCase()) !== -1) {
                items.push(item);
            }
        };

        if (items.length > 0) {
            filtered.push({
                'title': project.title,
                'items': items
            })
        }

    };

    return filtered;
}


module.exports = new TaskStore();
