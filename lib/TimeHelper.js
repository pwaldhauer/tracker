var TimeHelper = {
    formatHour : function(seconds) {
        return Math.round(seconds / 3600, 1);
    },

    zeroFill : function(number) {
       if(number < 10) {
           return '0' + number;
       }

       return number;
    },

    renderTime: function(seconds) {
       var hours = TimeHelper.zeroFill((parseInt(seconds / 3600 )));
       var minutes = TimeHelper.zeroFill((parseInt(seconds / 60 ) % 60));
       var seconds = TimeHelper.zeroFill((seconds % 60));

       return hours + ':' + minutes + ':' + seconds;
    },

}

module.exports = TimeHelper;
