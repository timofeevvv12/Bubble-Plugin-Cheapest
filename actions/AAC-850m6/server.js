function(properties, context) {

const moment = require('moment');

function calCheapest(startDate, endDate, emissionClass, axles) {
  // 1. First, calculate how many years, months, weeks, days this is
  function getPeriodsBetweenDates(startDate, endDate) {
    const start = moment(startDate);
    const end = moment(endDate);

    const years = end.diff(start, "years");
    start.add(years, "years");

    const months = end.diff(start, "months");
    start.add(months, "months");

    const weeks = end.diff(start, "weeks");
    start.add(weeks, "weeks");

    const days = end.diff(start, "days") + 1;

    return { years, months, weeks, days };
  }

  // 2. Then, calculate the cost for each of these periods
  function getCostPerPeriod(emissionClass, axles) {
    let costPerYear, costPerMonth, costPerWeek, costPerDay;
switch (emissionClass) {
  case 0:
    costPerYear = axles >= 4 ? 2359 : 1407;
    costPerMonth = axles >= 4 ? 235 : 140;
    costPerWeek = axles >= 4 ? 62 : 37;
    costPerDay = 12;
    break;
  case 1:
    costPerYear = axles >= 4 ? 2042 : 1223;
    costPerMonth = axles >= 4 ? 204 : 122;
    costPerWeek = axles >= 4 ? 54 : 32;
    costPerDay = 12;
    break;
  case 2:
    costPerYear = axles >= 4 ? 1776 : 1065;
    costPerMonth = axles >= 4 ? 177 : 106;
    costPerWeek = axles >= 4 ? 47 : 28;
    costPerDay = 12;
    break;
  case 3:
    costPerYear = axles >= 4 ? 1543 : 926;
    costPerMonth = axles >= 4 ? 154 : 92;
    costPerWeek = axles >= 4 ? 41 : 24;
    costPerDay = 12;
    break;
  case 4:
    costPerYear = axles >= 4 ? 1404 : 842;
    costPerMonth = axles >= 4 ? 140 : 84;
    costPerWeek = axles >= 4 ? 37 : 22;
    costPerDay = 12;
    break;
  case 5:
    costPerYear = axles >= 4 ? 1327 : 796;
    costPerMonth = axles >= 4 ? 132 : 79;
    costPerWeek = axles >= 4 ? 35 : 21;
    costPerDay = 12;
    break;
  case 6:
  case 7:
  case 8: // For Emission class ≥ 6
    costPerYear = axles >= 4 ? 1250 : 750;
    costPerMonth = axles >= 4 ? 125 : 75;
    costPerWeek = axles >= 4 ? 33 : 20;
    costPerDay = 12;
    break;
  default:
    costPerYear = 0;
    costPerMonth = 0;
    costPerWeek = 0;
    costPerDay = 0;
}
    return [costPerYear, costPerMonth, costPerWeek, costPerDay];
  }

  function recalculateCost(periods, costPerPeriod) {
    return (
      costPerPeriod[0] * periods.years +
      costPerPeriod[1] * periods.months +
      costPerPeriod[2] * periods.weeks +
      costPerPeriod[3] * periods.days
    );
  }

  let periods = getPeriodsBetweenDates(startDate, endDate);
  let costPerPeriod = getCostPerPeriod(emissionClass, axles);
  let allCalculations = [];
  let periodRecords = [];

  let firstCalculation = recalculateCost(periods, costPerPeriod);
  allCalculations.push(firstCalculation);
  periodRecords.push({ ...periods }); // add clone of periods

  periods.days = 0;
  periods.weeks += 1;
  let secondCalculation = recalculateCost(periods, costPerPeriod);
  allCalculations.push(secondCalculation);
  periodRecords.push({ ...periods });

  periods.weeks = 0;
  periods.months += 1;
  let thirdCalculation = recalculateCost(periods, costPerPeriod);
  allCalculations.push(thirdCalculation);
  periodRecords.push({ ...periods });

  periods.months = 0;
  periods.years += 1;
  let fourthCalculation = recalculateCost(periods, costPerPeriod);
  allCalculations.push(fourthCalculation);
  periodRecords.push({ ...periods });

  console.log(periodRecords)
  console.log(allCalculations);

  let cheapest = Math.min(...allCalculations);
  let cheapestIndex = allCalculations.indexOf(cheapest);
  let cheapestPeriod = periodRecords[cheapestIndex];
  return cheapest;
}

let startDate = new Date(properties.dateStart);
let endDate = new Date(properties.dateEnd);
let emissionClass = properties.emissionNumber;
let axles = properties.axlesNumber;

let cheapest = calCheapest(startDate, endDate, emissionClass, axles);
console.log(startDate.toDateString() + ' --> ' + endDate.toDateString())
console.log(cheapest);
return {price: cheapest};

}