import React, { useRef, useEffect } from 'react';
import { useState } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import Papa from 'papaparse';
import csvFile from './data/test_onlyvalue.csv';
import bulletproofs from 'bulletproof-js';
import {calculate_xy, getProof, gridToProof} from './ProofGenerate';
import BasicTable from './organisms/Table';
import {Grid, Typography, makeStyles} from '@material-ui/core';
import BasicUnderTable from './organisms/Table2';
import axios from 'axios';
import Favicon from './organisms/Favicon';

am4core.addLicense("ch-custom-attribution");

let real_location = []
// let apvalue = []
let obs_location = []

const useStyles = makeStyles({
 root: {
   display: 'flex',
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
   alignContent: 'center',
   justifyItems: 'center',
   flexDirection: 'column'
 }
});


function App(props) {
  const styles = useStyles();
  const chart = useRef(null);
  const [apvalue, setApValue] = useState([]);
  const [rows1, setRow1] = useState([]);
  const [rows2, setRow2] = useState([]);
  const [proofValue, setValue] = useState('');
  const [locationData, setLocationData] = useState({
    X: 5,
    Y: -10
  })
  const [state, setState] = useState([]);
  const [cnt, setCount] = useState(0);

  
function createData1(name,ap1, ap2, ap3, ap4, ap5,ap6,ap7,ap8) {
  return {name, ap1, ap2, ap3, ap4, ap5,ap6,ap7,ap8};
}
function createData2(name,ap9, ap10, ap11, ap12, ap13,ap14,ap15) {
  return {name,ap9, ap10, ap11, ap12, ap13,ap14,ap15};
}


function sendProof(userId, proofdata){
  axios.post('http://10.0.5.62:4000/api/createasset', {
    Id : userId,
    Proof : proofdata
  })
  .then((res) => {
    console.log(res.data);
    setValue(res.data);
  })
  .catch((err) => {
    console.log(err);
    throw err;
  });
}


  useEffect( () => {
    const tempAp =[];

    if(cnt===0){
    Papa.parse(csvFile, {
        download: true,
        complete: function (input) {
             const records = input.data;
             setState(records);
             
             for(let i=0, len=records.length; i<len; i++){
              records[i] = records[i].map(str=>Number(str)) 
            }
            
            // array slice to index & value
            for(let i=0, len=records.length; i<len; i++){
              real_location[i] = records[i].slice(0,2);
              tempAp[i] = records[i].slice(2);
              obs_location[i] = calculate_xy(tempAp[i]);
            }
            setApValue(tempAp);
            // gridToProof(5n);
          
        }
    });
    }
  

 
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

      if(obs_location[cnt] !== undefined) {
        const tmpX = Math.round(obs_location[cnt][0]);
        const tmpY = Math.round(obs_location[cnt][1]);
   
        setLocationData({
          X: tmpX,
          Y: tmpY
          }
        );
      }
      

      if(apvalue[cnt] !== undefined){
        setRow1([
          createData1('value1',apvalue[cnt][0], apvalue[cnt][1], apvalue[cnt][2], apvalue[cnt][3], apvalue[cnt][4], apvalue[cnt][5], apvalue[cnt][6], apvalue[cnt][7]),
      ])
        setRow2([
          createData2('value1', apvalue[cnt][8], apvalue[cnt][9], apvalue[cnt][10], apvalue[cnt][11], apvalue[cnt][12], apvalue[cnt][13], apvalue[cnt][14]),
        ])
      }
      else{

      }
      const data = sendProof('kim', getProof(locationData.X, locationData.Y));
    
      console.log("send", sendProof('kim', getProof(locationData.X, locationData.Y)))
      setValue(data);
    

        setCount(cnt+30);
    }, 1000)


    return () => {
      board.dispose();
      clearInterval(count);
    };



  }, [locationData]);


  return (
    <Grid container xs={12} styles={styles.root}>
      <Grid item xs={12}>
    <div id="chartdiv" style={{ width: "100%", height: "500px", marginLeft: "-25px"}}/>
    </Grid>
    <Grid item xs={12}>
        <BasicTable rows={rows1}/>
    </Grid>

    <Grid item xs={12}>
        <BasicUnderTable rows={rows2}/>
    </Grid>

    <Grid item xs={12} styles={styles.root}>
      <Favicon value={proofValue}/>
    </Grid>
    </Grid>
  

  );
}
export default App;