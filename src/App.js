import React, { useRef, useEffect } from 'react';
import { useState } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.addLicense("ch-custom-attribution");


function App(props) {
  const chart = useRef(null);

  const [locationData, setLocationData] = useState({
    X: 5,
    Y: -10
  })



  useEffect(() => {
    let board = am4core.create("chartdiv", am4charts.XYChart);
    board.startDuration = 0;
    var data = [];
    data.push(locationData);

    board.data = data;


    board.plotContainer.background.strokeWidth = 1;
    board.plotContainer.background.strokeOpacity = 1;
    board.plotContainer.background.stroke = am4core.color("#707070");
    board.svgContainer.htmlElement.style.height = 300 + "px";
    board.svgContainer.htmlElement.style.width = 400 + "px";

    // Create axes
    var xAxis = board.xAxes.push(new am4charts.ValueAxis());
    xAxis.renderer.grid.template.strokeOpacity = 1;
    xAxis.renderer.grid.template.stroke = am4core.color("#707070");
    xAxis.renderer.grid.template.strokeWidth = 2;
    xAxis.renderer.minGridDistance = 20;
    xAxis.min = 0;
    xAxis.max = 22;

    var yAxis = board.yAxes.push(new am4charts.ValueAxis());
    yAxis.renderer.grid.template.strokeOpacity = 1;
    yAxis.renderer.grid.template.stroke = am4core.color("#707070");
    yAxis.renderer.grid.template.strokeWidth = 2;
    yAxis.renderer.minGridDistance = 20;
    yAxis.min = -12;
    yAxis.max = 4;
    yAxis.border = "1px solid"
    // Create series
    var series = board.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = "Y";
    series.dataFields.valueX = "X";
    series.tooltipText = "{value}"
    series.showOnInit = false;
    series.interpolationDuration = 0;

    series.tooltip.pointerOrientation = "vertical";

    var RadarSeries = board.series.push(new am4charts.RadarSeries());

    RadarSeries.dataFields.valueY = "Y";
    RadarSeries.dataFields.valueX = "X";

    var bullet = series.bullets.push(new am4charts.CircleBullet());
    bullet.circle.radius = 7;
    bullet.circle.stroke = am4core.color("red");
    bullet.circle.fill = am4core.color("red");
    bullet.circle.strokeWidth = 3;

    board.cursor = new am4charts.XYCursor();
    board.cursor.behavior = "zoomY";

    
    const count = setInterval(function () {
      const tmpX = locationData.X;
      const tmpY = locationData.Y
      setLocationData({
        X: (tmpX+1)%22,
        Y: (tmpY+1)%20
        }
      );
  
        console.log(locationData)
    }, 2000)

    return () => {
      board.dispose();
      clearInterval(count);
    };
  }, [locationData]);

  return (
    <div id="chartdiv" style={{ width: "100%", height: "500px", marginLeft: "-25px"}}></div>
  );
}
export default App;