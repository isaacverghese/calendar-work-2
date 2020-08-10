import React from "react";
import {
  STANDARD_DAYS_OF_WEEK,
  STANDARD_WEEK_MAP,
  DAYS_OF_WEEK,
  WEEK_MAP
} from "./CalendarConstants";
import "./SeasonCalendar.css";

import NBIWeekCell from "./NBIWeekCell";
import NBIDayCell from "./NBIDayCell";

class NBIMonthTable extends React.Component {
  oldhandleDay = () => {
    console.log(this.props.monthData);
    let month = [];
    const emptyDays = WEEK_MAP[this.props.monthData[0].day];
    let weekStartIndex = [];
    for (let i = 7 - emptyDays; i < this.props.monthData.length; i += 7) {
      weekStartIndex.push(i);
    }
    this.props.monthData.map((day, index) => {
      if (index === 0) {
        month.push(<tr key={index} />);
        month.push(<WeekCell data={day} />);
        if (emptyDays !== 0) {
          for (let i = emptyDays; i > 0; i--) {
            month.push(<td>&nbsp;</td>);
          }
        }
      }
      weekStartIndex.map(startIndex => {
        if (index === startIndex) {
          month.push(<tr />);
          month.push(<WeekCell data={day} />);
        }
      });
      month.push(<DayCell data={day} />);
    });
    console.log(month);
    return month;
  };

  mapToWeeks = () => {
    const monthData = this.props.monthData;
    let startEmptyDays = [];
    let endEmptyDays = [];
    let emptyDays = STANDARD_WEEK_MAP[this.props.monthData[1][0].day];
    for (let i = 0; i < emptyDays; i++) {
      startEmptyDays[i] = null;
    }
    //numWeeksInMonth = monthData[0].weekNo - monthData[monthData.length-1].weekNo
    let i = startEmptyDays.length + monthData[1].length;
    emptyDays = 42 - i;
    for (let index = 0; index < emptyDays; index++) endEmptyDays[index] = null;
    let transformedMonth = [
      ...startEmptyDays,
      ...monthData[1],
      ...endEmptyDays
    ];
    return transformedMonth;
  };

  handleDay = () => {
    let transformedMonth = this.mapToWeeks();
    //console.log('**************** TRANSFORMED MONTH ****************')
    //console.log(transformedMonth)
    //console.log('**************** TRANSFORMED MONTH ****************')
    //console.log(this.props.monthData)
    //console.log(this.props.monthData.length)
    let month = [];
    let weekIndex;
    let dayIndex;
    const emptyDays = WEEK_MAP[this.props.monthData[0].day];
    for (weekIndex = 0; weekIndex < 6; weekIndex++) {
      //month.push(<tr/>)
      //month.push(<td>{weekIndex + 1}</td>);
      //for (dayIndex = 1; dayIndex < 8; dayIndex++){
      //    month.push(<td>{(weekIndex +1) * (dayIndex)}</td>);
      //}
      let week = [];
      let weekNum = null;
      if (transformedMonth[7 * weekIndex] != null) {
        weekNum = transformedMonth[7 * weekIndex];
      } else {
        weekNum = transformedMonth[7 * (weekIndex + 1) - 1];
      }

      week.push(<NBIWeekCell data={weekNum} />);
      //console.log(`pushed week [${weekIndex}] [${(7*(weekIndex+1)-1)}]`)
      //console.log(transformedMonth[6*(weekIndex+1)])
      for (dayIndex = 0; dayIndex < 7; dayIndex++) {
        week.push(
          <NBIDayCell
            dateSelectedHandler={this.props.dateSelectedHandler}
            data={transformedMonth[dayIndex + 1 + weekIndex * 7 - 1]}
          />
        );
        //console.log(`pushed day wkidx:[${weekIndex}] dayidx[${dayIndex}] arrIdx:[[${(((dayIndex+1)+((weekIndex*7)))-1)}]`)
        //console.log(transformedMonth[((dayIndex+1)*(weekIndex+1)-1)])
      }
      month.push(<tr>{week}</tr>);
    }
    console.log(month);
    return month;
  };

  render() {
    console.log(this.props.monthData);
    return (
      <div style={this.props.style}>
        <table className="month-table">
          <thead>
            <tr>
              <th colSpan="8" className="month-header">
                {this.props.monthData[1][0].monthName.toUpperCase() +
                  " " +
                  this.props.monthData[1][0].year +
                  " - "}
                {this.props.monthData[1][0].quarter}
              </th>
            </tr>

            <tr key="week-header">
              <th key="week-header-key" className="week-header-WK">
                WK
              </th>
              {STANDARD_DAYS_OF_WEEK.map((day, index) => (
                <th key={index} className="week-header-days">
                  {day.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{this.handleDay()}</tbody>
        </table>
      </div>
    );
  }
}

export default NBIMonthTable;
