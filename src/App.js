import React from "react";
import "./styles.css";
import "./calendar/NBICalendar";
import NBICalendar from "./calendar/NBICalendar";
import {
  sortAPI,
  mockApi1,
  US_DATE_FORMAT
} from "./calendar/CalendarConstants";

export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <NBICalendar 
      calendarType={2}
      data={sortAPI(mockApi1)}/>
    </div>
  );
}
