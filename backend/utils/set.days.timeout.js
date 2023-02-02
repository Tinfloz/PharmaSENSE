export function setDaysTimeout(callback, days) {
    // 86400 seconds in a day
    var msInDay = 86400 * 1000;

    var dayCount = 0;
    var timer = setInterval(function () {
        dayCount++;  // a day has passed

        if (dayCount == days) {
            clearInterval(timer);
            callback.apply(this, []);
        }
    }, msInDay);
};