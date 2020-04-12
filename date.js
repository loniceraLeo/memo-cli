let date = new Date();

let present = {
    year: date.getFullYear(),
    month: date.getUTCMonth() + 1,          //month range [0, 11]
    day: date.getDate(),
}
module.exports = present;