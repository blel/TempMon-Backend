exports.createTodayLowerBoundaryDate = function () {
    var today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
}

exports.createTodayUpperBoundaryDate = function () {
    var today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
}