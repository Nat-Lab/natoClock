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
  return this.getSecondsOfDay() + 86400 * (this.getDay() - 1);
};

Date.prototype.getSecondsOfMonth = function() {
  return this.getSecondsOfDay() + 86400 * (this.getDate() - 1);
};

Date.prototype.getSecondsOfYear = function () {
  return this.getSecondsOfDay() + 86400 * (this.getDayOfYear() - 1);
};

Date.prototype.precentOf = function(type) {
  var precent = function(part, full) { return (full/part) };
  if (type == 'min') return precent(60000, this.getMilliseconds() + 1000 * this.getSeconds() - 1);
  if (type == 'hrs') return precent(3600, this.getSecondsOfHour());
  if (type == 'day') return precent(3600 * 24, this.getSecondsOfDay());
  if (type == 'week') return precent(86400 * 7, this.getSecondsOfWeek());
  if (type == 'mon') return precent(30 * 86400, this.getSecondsOfMonth());
  if (type == 'yrs') return precent(this.getYearDays() * 86400, this.getSecondsOfYear());
};
