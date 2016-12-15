/* let's hack date */
Date.prototype.isLeapYear = function() {
    var year = this.getFullYear();
    if((year & 3) != 0) return false;
    return ((year % 100) != 0 || (year % 400) == 0);
};

Date.prototype.getYearDays =  function () {
  return this.isLeapYear() ? 366 : 365;
}

Date.prototype.getMonthDays = function(){
    var d = new Date(this.getFullYear(), this.getMonth()+1, 0);
    return d.getDate();
}

Date.prototype.getDayOfYear = function() {
    var dayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    var mn = this.getMonth();
    var dn = this.getDate();
    var dayOfYear = dayCount[mn] + dn;
    if(mn > 1 && this.isLeapYear()) dayOfYear++;
    return dayOfYear;
};

Date.prototype.getMillisecondsOfMinutes = function () {
  return this.getMilliseconds() + 1000 * this.getSeconds() - 1;
};

Date.prototype.getSecondsOfHour = function() {
  return this.getSeconds() + 60 * this.getMinutes();
};

Date.prototype.getSecondsOfDay = function() {
  return this.getSeconds() + (60 * this.getMinutes()) + (3600 * this.getHours());
};

Date.prototype.getSecondsOfWeek = function() {
  var d = this.getDay();
  d = (d == 0 ? 7 : d);
  return this.getSecondsOfDay() + 86400 * (d - 1);
};

Date.prototype.getSecondsOfMonth = function() {
  return this.getSecondsOfDay() + 86400 * (this.getDate() - 1);
};

Date.prototype.getSecondsOfYear = function () {
  return this.getSecondsOfDay() + 86400 * (this.getDayOfYear() - 1);
};

Date.prototype.percentOf = function(unit) {
  var percent = function(part, full) { return part == 0 ? 0 : (full/part) };
  if (unit == 'min') return percent(60000, this.getMilliseconds() + 1000 * this.getSeconds());
  if (unit == 'hrs') return percent(3600, this.getSecondsOfHour());
  if (unit == 'day') return percent(3600 * 24, this.getSecondsOfDay());
  if (unit == 'week') return percent(86400 * 7, this.getSecondsOfWeek());
  if (unit == 'mon') return percent(this.getMonthDays() * 86400, this.getSecondsOfMonth());
  if (unit == 'yrs') return percent(this.getYearDays() * 86400, this.getSecondsOfYear());
};

Date.prototype.isFinished = function (unit) {
  if (unit == 'min') return (this.getSeconds() >= 59 && this.getMilliseconds() >= 950);
  if (unit == 'hrs') return (this.getSecondsOfHour() >= 3599 && this.getMilliseconds() >= 950);
  if (unit == 'day') return (this.getSecondsOfDay() >= 86399 && this.getMilliseconds() >= 950);
  if (unit == 'week') return (this.getSecondsOfWeek() >= 604799 && this.getMilliseconds() >= 950);
  if (unit == 'mon') return (this.getSecondsOfMonth() >= ((this.getMonthDays() * 86400) - 1) && this.getMilliseconds() >= 950);
  if (unit == 'yrs') return (this.getSecondsOfYear() >= ((this.getYearDays() * 86400) - 1) && this.getMilliseconds() >= 950);
};
