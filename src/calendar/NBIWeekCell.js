import React from "react";

class NBIWeekCell extends React.Component {
  weekStyle = () => {
    let style = {};
    if (this.props.data !== undefined) {
      //style["backgroundColor"] = "rgba(136, 0, 242, 0.07)";
      style["width"] = "26px";
      style["height"] = "23px";
      style["textAlign"] = "center";
      style["lineHeight"] = "normal";
      style["fontSize"] = "10px";
      style["fontWeight"] = "normal";
      style["lineHeight"] = "2";
      style["color"] = "#2b2b2b";
    }
    return style;
  };
  render() {
    let data = this.props.data;
    if (this.props.data != null) {
      return (
        <td key={`${data.date}`} style={this.weekStyle()}>
          {data.weekNo}
        </td>
      );
    } else {
      return <td key={"none"} style={this.weekStyle()} />;
    }
  }
}
export default NBIWeekCell;
