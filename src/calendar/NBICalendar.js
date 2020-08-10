import React, { Component } from "react";
//import { Button, IconSvg } from "../../../infraFacade";

import NBIMonthTable from "./NBIMonth";
import "./SeasonCalendar.css";
import moment from "moment";
import { CALENDAR_TYPE_MAP, US_DATE_FORMAT } from "./CalendarConstants";

class NBICalendar extends Component {
  state = {
    metadata: {},
    monthsmetadata: [],
    calendarType: this.props.calendarType,
    currentIndex: null,
    newCurrentIndex: null
  };

  getMetaDataProperties = (
    day,
    year,
    monthNo,
    monthData,
    weekNo,
    nielsenMonthNumber
  ) => {
    let dayMetaData = {};
    dayMetaData.date = day;
    dayMetaData.day = moment([year, monthNo, day]).format("dd");
    dayMetaData.month = monthNo;
    dayMetaData.monthName = monthData.clnd_mon_name;
    dayMetaData.weekNo = weekNo;
    dayMetaData.year = year;
    dayMetaData.quarter = monthData.quarter.slice(0, 2);
    dayMetaData.nielsenMonthNumber = nielsenMonthNumber;
    return dayMetaData;
  };

  getValidDateWindow = () => {
    this.props.dataAvailability.filter((dataAvailability) => {
      return dataAvailability.dataReleaseName === "Syndicated Buyergraphics";
    });
  };
  createMetaData = () => {
    let metadata = {};

    let data = this.props.data;
    //let calendarType = this.state.calendarType;
    let calendarType = CALENDAR_TYPE_MAP.get(this.props.calendarType);
    let monthIndex = 1;
    /*Isaac stuff */
    let prunedCalendar = [];
    let dataAvailabilityEnd = moment("4/30/2020", US_DATE_FORMAT);
    let dataAvailabilityStart = moment(dataAvailabilityEnd).subtract(
      2,
      "years"
    );
    data[calendarType].map((month) => {
      let monthStart = moment(month.month_start, US_DATE_FORMAT);
      let monthEnd = moment(month.month_end, US_DATE_FORMAT);
      console.log(month.month_start);
      console.log(month.month_end);

      if (
        monthStart.isBetween(
          dataAvailabilityStart,
          dataAvailabilityEnd,
          undefined,
          "[]"
        )
      )
        prunedCalendar.push(month);
      //console.log("START DATE WITHIN RANGE")
      else if (
        monthEnd.isBetween(
          dataAvailabilityStart,
          dataAvailabilityEnd,
          undefined,
          "[]"
        )
      )
        prunedCalendar.push(month);
      //console.log("END DATE WITHIN RANGE")
      else console.log("START AND END OUT OF RANGE");
    });

    prunedCalendar.map((month) => {
      //data[calendarType].map(month => {
      /*End Isaac stuff */

      let monthData = [];
      let nielsenMonthNumber = moment(month.month_end, US_DATE_FORMAT).year();
      let quarter = month.quarter;
      let month_start_date = moment(month.month_start, US_DATE_FORMAT);
      let month_end_date = moment(month.month_end, US_DATE_FORMAT);
      let weekNo = month.min_week;
      for (
        let date = month_start_date;
        date <= month_end_date;
        month_start_date.add(1, "days")
      ) {
        monthData.push(
          this.getMetaDataProperties(
            date.date(),
            date.year(),
            date.month(),
            month,
            weekNo,
            monthIndex,
            nielsenMonthNumber
          )
        );
        if (moment(date).format("dd") === "Su") {
          weekNo += 1;
        }
      }
      metadata[
        `${month.clnd_mon_name}-${month_end_date.year()}/${quarter}`
      ] = monthData;
      monthIndex++;
    });
    /* Start Isaac stuff */
    let transformedCalendar = [];
    let monthkeys = Object.entries(metadata).reverse();
    let numchunks = Math.ceil(monthkeys.length / 6);

    console.log(`numchunks is : ${numchunks}`);
    for (let i = 0, j = 0; j < monthkeys.length; i++, j += 6) {
      console.log(`#keys is ${monthkeys.length}`);
      console.log(`Value of j is : ${j} Value of i is : ${i}`);
      console.log(`the length of metadata is ${metadata.length}`);
      let sixMonths = monthkeys.slice(j, j + 6);
      if (sixMonths.length < 6 && i === 0) {
        transformedCalendar.splice(i, 0, monthkeys.slice(j, j + 6));
      } else {
        transformedCalendar.splice(i, 0, monthkeys.slice(j, j + 6));
      }
    }

    this.setState({
      monthsmetadata: transformedCalendar.reverse()
    });
    /* End Isaac stuff */
    this.setState({
      metadata: metadata
    });
    return metadata;
  };

  handleMonthStyle = () => {
    let style = {
      width: "250px",
      height: "180px"
    };
    return style;
  };

  handleMonths = (currentIndex) => {
    /*Isaac stuff*/
    console.log(`newcurrentIndex is ${this.state.newCurrentIndex}`);
    console.log("Metadata is:" + this.state.metadata);
    console.log("Months Metadata is :" + this.state.monthsmetadata);
    let topMonths = [];
    let bottomMonths = [];
    //let topMonths = this.state.monthsmetadata[0].slice(0,3)
    if (this.state.monthsmetadata.length === 0) {
      return null;
    } else {
      topMonths = this.state.monthsmetadata[this.state.newCurrentIndex].slice(
        3,
        6
      );
      bottomMonths = this.state.monthsmetadata[
        this.state.newCurrentIndex
      ].slice(0, 3);
    }
    let totalMonths = [topMonths.reverse(), bottomMonths.reverse()];
    return totalMonths.map((months, index) => {
      return (
        <tr key={index}>
          {months.map((month, monthIndex) => {
            return (
              <td key={monthIndex}>
                <NBIMonthTable
                  calendarType={this.props.calendarType}
                  dateSelectedHandler={this.props.dateSelectedHandler}
                  //monthData={this.state.metadata[month]}
                  monthData={month}
                  style={this.handleMonthStyle()}
                />
              </td>
            );
          })}
        </tr>
      );
    });
    /* end Isaac Stuff */
    /*
    let topMonths = Object.keys(this.state.metadata).slice(
      currentIndex,
      currentIndex + 3
    );
    let bottomMonths = Object.keys(this.state.metadata).slice(
      currentIndex + 3,
      currentIndex + 6
    );
    let totalMonths = [topMonths, bottomMonths];
    return totalMonths.map((months, index) => {
      return (
        <tr key={index}>
          {months.map((month, monthIndex) => {
            return (
              <td key={monthIndex}>
                <NBIMonthTable
                  dateSelectedHandler = {this.props.dateSelectedHandler}
                  monthData={this.state.metadata[month]}
                  style={this.handleMonthStyle()}
                />
              </td>
            );
          })}
        </tr>
      );
    });*/
  };

  changeYear = (swipe) => {
    let prevIndex = this.state.currentIndex;
    if (swipe === "Prev") {
      let sub = prevIndex - 6 < 0 ? prevIndex : 6;
      this.setState({
        currentIndex: (prevIndex -= sub)
      });
    } else if (swipe === "Next") {
      let length = Object.keys(this.state.metadata).length;
      let add = prevIndex + 6 >= length ? 0 : 6;
      this.setState({
        currentIndex: (prevIndex += add)
      });
    }
  };

  handleCalendarChange = (event) => {
    this.setState({
      calendarType: event.target.value
    });
  };

  initCalendar = () => {
    let metadata = this.createMetaData();
    if (metadata) {
      let length = Object.keys(metadata).length;
      this.setState({
        currentIndex: length - 6
      });
      //ISAAC !!!!!!CHANGE THIS
      this.setState({
        newCurrentIndex: 0
      });
    }
  };

  componentDidMount() {
    this.initCalendar();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.calendarType !== this.props.calendarType) {
      this.initCalendar();
    }
    if (prevState.currentIndex !== this.state.currentIndex) {
      this.createMetaData();
    }
    if (prevState.selectedStartDate != this.state.selectedStartdate) {
      console.log("startDate changed");
    }
    if (prevState.selectedEndDate != this.state.selectedEnddate) {
      console.log("endDate changed");
    }
  }

  render() {
    console.log(this.props);
    return (
      <div>
        <div style={{ display: "flex", width: "740px", align: "center" }}>
          <div
            style={{
              width: "370px",
              height: "25px",
              padding: "0px 25px 25px 25px"
            }}
            onClick={() => this.changeYear("Prev")}
          >
            <button
              accent={false}
              dataSelector="infra-button"
              disabled={false}
              onClick={function noRefCheck() {}}
              tooltip="previous"
              variant="default"
            >
              Prev
            </button>
          </div>
          <div
            style={{
              width: "370px",
              height: "25px",
              padding: "0px 0px 25px 310px"
            }}
            onClick={() => this.changeYear("Next")}
          >
            <button
              accent={false}
              dataSelector="infra-button"
              disabled={false}
              onClick={function noRefCheck() {}}
              tooltip="next"
              variant="default"
            >
              {" "}
              Next{" "}
            </button>
          </div>
        </div>
        <div>
          <table className="season-calendar-table">
            <tbody>{this.handleMonths(this.state.currentIndex)}</tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default NBICalendar;
