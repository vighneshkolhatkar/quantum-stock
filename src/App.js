import logo from './logo.svg';
import './App.css';
import { useState,useEffect,useRef } from "react";
import {db} from './firebase-config';
import {collection, getDocs, addDoc,updateDoc, deleteDoc, query, where, doc, limit} from "firebase/firestore";
import {TextField} from "@mui/material"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Alert, AlertTitle } from '@mui/material';
import {Line} from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import React, { Component } from 'react';


function App() {
  const [newDate, setNewDate] = useState("")
  const [newOpen, setNewOpen] = useState(0)
  const [newHigh, setNewHigh] = useState(0)
  const [newLow, setNewLow] = useState(0)
  const [newClose, setNewClose] = useState(0)
  const [newAdjclose, setNewAdjclose] = useState(0)
  const [newVolume, setNewVolume] = useState(0)
  const [newTicker, setNewTicker] = useState("")
  const [newID, setNewID] = useState("")

  const [readID, setReadID] = useState("")
  const [deleteID, setDeleteID] = useState("")
  const [updateID, setUpdateID] = useState("")
  const [updateOpen, setUpdateOpen] = useState(0)
  const [updateHigh, setUpdateHigh] = useState(0)
  const [updateLow, setUpdateLow] = useState(0)
  const [updateClose, setUpdateClose] = useState(0)
  const [updateAdjclose, setUpdateAdjclose] = useState(0)
  const [updateVolume, setUpdateVolume] = useState(0)

  const [showCreate, setShowCreate] = useState(false)
  const [showRead, setShowRead] = useState(false)
  const [showUpdate, setShowUpdate] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [showData, setShowData] = useState(false)
  const [showViz, setShowViz] = useState(false);
  const [showPlot, setShowPlot] = useState(false);

  const [readData, setReadData] = useState([])

  const [vizStock, setVizStock] = useState("")
  const [plotData, setPlotData] = useState([]);

  const [stocks, setStocks] = useState([]);
  const stocksCollectionRef = collection(db, "stocks");
  var readDataArr = [];
  var vizDataArr = [];
  var updateDocID;
  var deleteDocID;
  const [labels, setLabels] = useState([]);
  const [sourceA, setSourceA] = useState([]);
  const [sourceB, setSourceB] = useState([]);
  const [sourceC, setSourceC] = useState([]);
  const [sourceD, setSourceD] = useState([]);

  // var labels, source1, source2, source3, source4;
  const vizRef = useRef();
  

  // -------------------------------------- CREATE Data in the Database --------------------------------------

  const createStock = async () => {
    await addDoc(stocksCollectionRef, 
      { Date: newDate, ID: newID,  adjclose: Number(newAdjclose), close: Number(newClose), high: Number(newHigh), low: Number(newLow),   
        open: Number(newOpen), ticker: newTicker, volume: Number(newVolume)
    });
    alert("Record Created!");
    setShowCreate(false);
  };

  // -------------------------------------- UPDATE Data from the Database --------------------------------------

  const updateStock = async () => {
    const dquery = query(stocksCollectionRef, where("ID", "==", updateID) );
    const querySnapshot = await getDocs(dquery);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      updateDocID = doc.id;
    });

    if(updateOpen !== 0){
      var updateFields = {open: updateOpen};
    }

    if(updateHigh !== 0){
      var updateFields = {high: updateHigh};
    }

    if(updateLow !== 0){
      var updateFields = {low: updateLow};
    }

    if(updateClose !== 0){
      var updateFields = {close: updateClose};
    }

    if(updateAdjclose !== 0){
      var updateFields = {adjclose: updateAdjclose};
    }

    if(updateVolume !== 0){
      var updateFields = {volume: updateVolume};
    }

    const stockDoc = doc(db, "stocks", updateDocID);
    await updateDoc(stockDoc, updateFields);
    alert("Record Updated!");
    setShowUpdate(false);
  };

  // -------------------------------------- READ Data from the Database --------------------------------------

  const readStock = async () => {
    console.log("Here Reading");
    console.log(readID);
    const dquery = query(stocksCollectionRef, where("ID", "==", readID) );
    const querySnapshot = await getDocs(dquery);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
    readDataArr.push({Date: doc.data().Date,
                          Open: doc.data().open,
                          High: doc.data().high,
                          Low: doc.data().low,
                          Close: doc.data().close,
                          Adjclose: doc.data().adjclose,
                          Volume: doc.data().volume,
                          Ticker: doc.data().ticker,
                          ID: doc.data().ID,
                        })
          });
    setReadData(readDataArr);
    setShowData(true);
    };

  // -------------------------------------- DELETE Data from the Database --------------------------------------

  const deleteStock = async () => {
    const dquery = query(stocksCollectionRef, where("ID", "==", deleteID) );
    const querySnapshot = await getDocs(dquery);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      deleteDocID = doc.id;
    });
    const stockDoc = doc(db, "stocks", deleteDocID);
    deleteDoc(stockDoc, deleteDocID);
    alert("Record Deleted!");
      setShowDelete(false);
  };

  // -------------------------------------- Sort Json Array --------------------------------------

  function sortJsonArray(key){  
    return function(a,b){  
       if(a[key] > b[key])  
          return 1;  
       else if(a[key] < b[key])  
          return -1;  

       return 0;  
    }  
 }
  
  // -------------------------------------- Visualize Data from the Database --------------------------------------

  const dataViz = async () => {
    const searchTicker = vizStock.toUpperCase();
    const dquery = query(stocksCollectionRef, where("ticker", "==", searchTicker), limit(20));
    const querySnapshot = await getDocs(dquery);
    querySnapshot.forEach((doc) => {
    // console.log(doc.id, " => ", doc.data());
    vizDataArr.push({Date: doc.data().Date,
                          Open: doc.data().open,
                          High: doc.data().high,
                          Low: doc.data().low,
                          Close: doc.data().close,
                          Adjclose: doc.data().adjclose,
                          Volume: doc.data().volume,
                          Ticker: doc.data().ticker,
                          ID: doc.data().ID,
                        })
          });
    setShowPlot(true);

    vizDataArr.sort(sortJsonArray("Date"));

    setLabels(vizDataArr.map(function(e) {
      return e.Date;
    }));
    setSourceA(vizDataArr.map(function(e) {
      return e.Open;
    }));
    setSourceB(vizDataArr.map(function(e) {
      return e.High;
    }));
    setSourceC(vizDataArr.map(function(e) {
      return e.Low;
    }));
    setSourceD(vizDataArr.map(function(e) {
      return e.Close;
    }));
  }


  // -------------------------------------- CLEAR  --------------------------------------
  
  const clear = async() => {
    console.log(plotData);
    setShowData(false);
    setShowCreate(false);
    setShowRead(false);
    setShowUpdate(false);
    setShowDelete(false);
    setShowViz(false);
    setShowPlot(false);
  };

  // -------------------------------------- RENDER Data on the webpage --------------------------------------
  return (
    <div className="App">

      <br/><br/>
      <h2 className="Heading"> Quantum Stock </h2>
      <br/>
      <div>
        <button className='Button' onClick={() => setShowCreate(true)}> Click to Create a New Record </button>
        {showCreate ? (
          <div className='AddForm'>
              <h3>Add New Quantum Stock Entry:</h3>
              <TextField sx={{mb:0.5}} size="small" variant="standard" 
                InputProps={{ style: { fontSize: 15 } }}
                InputLabelProps={{ style: { fontSize: 15 } }}
                className="form-control" label="Enter Date(YYYY-MM-DD)"  
                value={newDate} onChange={(e) => setNewDate(e.target.value)} />
              
              <br/>
              
              <TextField sx={{mb:0.5}} size="small" variant="standard" 
                InputProps={{ style: { fontSize: 15 } }}
                InputLabelProps={{ style: { fontSize: 15 } }}
                className="form-control" label="Open"  
                value={newOpen} onChange={(e) => setNewOpen(e.target.value)} />
              <br/>
              
              <TextField sx={{mb:0.5}} size="small" variant="standard" 
                InputProps={{ style: { fontSize: 15 } }}
                InputLabelProps={{ style: { fontSize: 15 } }}
                className="form-control" label="High"  
                value={newHigh} onChange={(e) => setNewHigh(e.target.value)} />

              <br/>
              
              <TextField sx={{mb:0.5}} size="small" variant="standard" 
                InputProps={{ style: { fontSize: 15 } }}
                InputLabelProps={{ style: { fontSize: 15 } }}
                className="form-control" label="Low"  
                value={newLow} onChange={(e) => setNewLow(e.target.value)} />

              <br/>

              <TextField sx={{mb:0.5}} size="small" variant="standard" 
                InputProps={{ style: { fontSize: 15 } }}
                InputLabelProps={{ style: { fontSize: 15 } }}
                className="form-control" label="Close"  
                value={newClose} onChange={(e) => setNewClose(e.target.value)} />

              <br/>

              <TextField sx={{mb:0.5}} size="small" variant="standard" 
                InputProps={{ style: { fontSize: 15 } }}
                InputLabelProps={{ style: { fontSize: 15 } }}
                className="form-control" label="Adjclose"  
                value={newAdjclose} onChange={(e) => setNewAdjclose(e.target.value)} />

              <br/>

              <TextField sx={{mb:0.5}} size="small" variant="standard" 
                InputProps={{ style: { fontSize: 15 } }}
                InputLabelProps={{ style: { fontSize: 15 } }}
                className="form-control" label="Volume"  
                value={newVolume} onChange={(e) => setNewVolume(e.target.value)} />

              <br/>

              <TextField sx={{mb:0.5}} size="small" variant="standard" 
                InputProps={{ style: { fontSize: 15 } }}
                InputLabelProps={{ style: { fontSize: 15 } }}
                className="form-control" label="Ticker"  
                value={newTicker} onChange={(e) => setNewTicker(e.target.value)} />

              <br/>

              <TextField sx={{mb:0.5}} size="small" variant="standard" 
                InputProps={{ style: { fontSize: 15 } }}
                InputLabelProps={{ style: { fontSize: 15 } }}
                className="form-control" label="ID(Ticker + MMDDYYYY)"  
                value={newID} onChange={(e) => setNewID(e.target.value)} />

              <br/>

              <button disabled={!newDate || !newOpen || !newHigh || !newLow ||!newClose 
                || !newAdjclose || !newVolume || !newTicker || !newID } className='Button'
                onClick={createStock}> Submit </button>
              
              <button className='Button' onClick={clear}> Clear </button>
          </div>
        ) : null}
      </div>
      <br/><br/>

      <div>
        <button className='Button' onClick={() => setShowRead(true)}> Click to Read a Record </button>
        {showRead ? (
          <div className='ReadForm'>
            <h3>Enter the ID of the stock you want to view</h3>
            <TextField sx={{mb:0.5}} size="small" variant="standard" 
                InputProps={{ style: { fontSize: 15 } }}
                InputLabelProps={{ style: { fontSize: 15 } }}
                className="form-control" label="ID(Ticker + MMDDYYYY)"  
                value={readID} onChange={(e) => setReadID(e.target.value)} />
            <br/>

            <button className='Button' disabled={!readID } onClick={readStock}> Retrieve </button>
            <br/>
            <button className='Button' onClick={clear}> Clear </button>
          </div>
        ) : null}

        {showData ? (
          <div>
            <h3>Data:</h3>
            <TableContainer style={{ width: 1000 }} component={Paper}>
              <Table  aria-label="simple table">
                <TableHead>
                  <TableRow sx={{
                      backgroundColor: "#de994f",
                      borderBottom: "1px solid black",
                      "& th": {
                        fontSize: "0.8rem",
                        color: "#0b0719"
                      }
                    }}>
                    <TableCell>Date </TableCell>
                    <TableCell align="right">Open</TableCell>
                    <TableCell align="right">High</TableCell>
                    <TableCell align="right">Low</TableCell>
                    <TableCell align="right">Close</TableCell>
                    <TableCell align="right">Adjclose</TableCell>
                    <TableCell align="right">Volume</TableCell>
                    <TableCell align="right">Ticker</TableCell>
                    <TableCell align="right">ID</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {readData.map((data) => (
                    <TableRow
                      key={data.ID}
                      sx={{
                        backgroundColor: "#e0c49d",
                        borderBottom: "1px solid black",
                        "& th": {
                          fontSize: "0.8rem",
                          color: "#0b0719"
                        }
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {data.Date}
                      </TableCell>
                      <TableCell align="right">{data.Open}</TableCell>
                      <TableCell align="right">{data.High}</TableCell>
                      <TableCell align="right">{data.Low}</TableCell>
                      <TableCell align="right">{data.Close}</TableCell>
                      <TableCell align="right">{data.Adjclose}</TableCell>
                      <TableCell align="right">{data.Volume}</TableCell>
                      <TableCell align="right">{data.Ticker}</TableCell>
                      <TableCell align="right">{data.ID}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

          </div>
        ) : null}
    </div>
    <br/><br/>
    <div>
        <button className='Button' onClick={() => setShowUpdate(true)}> Click to Update a Record </button>
        {showUpdate ? (
          <div className='UpdateForm'>
              <h3>Update a Quantum Stock Entry:</h3>

              <TextField sx={{mb:0.5}} size="small" variant="standard" 
                InputProps={{ style: { fontSize: 15 } }}
                InputLabelProps={{ style: { fontSize: 15 } }}
                className="form-control" label="ID(Ticker + MMDDYYYY)"  
                value={updateID} onChange={(e) => setUpdateID(e.target.value)} />
              
              <br/>
              
              <TextField sx={{mb:0.5}} size="small" variant="standard" 
                InputProps={{ style: { fontSize: 15 } }}
                InputLabelProps={{ style: { fontSize: 15 } }}
                className="form-control" label="Open"  
                value={updateOpen} onChange={(e) => setUpdateOpen(e.target.value)} />
              <br/>
              
              <TextField sx={{mb:0.5}} size="small" variant="standard" 
                InputProps={{ style: { fontSize: 15 } }}
                InputLabelProps={{ style: { fontSize: 15 } }}
                className="form-control" label="High"  
                value={updateHigh} onChange={(e) => setUpdateHigh(e.target.value)} />

              <br/>
              
              <TextField sx={{mb:0.5}} size="small" variant="standard" 
                InputProps={{ style: { fontSize: 15 } }}
                InputLabelProps={{ style: { fontSize: 15 } }}
                className="form-control" label="Low"  
                value={updateLow} onChange={(e) => setUpdateLow(e.target.value)} />

              <br/>

              <TextField sx={{mb:0.5}} size="small" variant="standard" 
                InputProps={{ style: { fontSize: 15 } }}
                InputLabelProps={{ style: { fontSize: 15 } }}
                className="form-control" label="Close"  
                value={updateClose} onChange={(e) => setUpdateClose(e.target.value)} />

              <br/>

              <TextField sx={{mb:0.5}} size="small" variant="standard" 
                InputProps={{ style: { fontSize: 15 } }}
                InputLabelProps={{ style: { fontSize: 15 } }}
                className="form-control" label="Adjclose"  
                value={updateAdjclose} onChange={(e) => setUpdateAdjclose(e.target.value)} />

              <br/>

              <TextField sx={{mb:0.5}} size="small" variant="standard" 
                InputProps={{ style: { fontSize: 15 } }}
                InputLabelProps={{ style: { fontSize: 15 } }}
                className="form-control" label="Volume"  
                value={updateVolume} onChange={(e) => setUpdateVolume(e.target.value)} />

              <br/>

              <button className='Button' onClick={updateStock}>Update Stock Record </button>
              <button className='Button' onClick={clear}> Clear </button>
          </div>
        ) : null}
      </div>
      <br/><br/>
      <div>
        <button className='Button' onClick={() => setShowDelete(true)}> Click to Delete a Record </button>
        {showDelete ? (
          <div className='DeleteForm'>
              <h3>Enter the ID of the stock you want to Delete</h3>
            <TextField sx={{mb:0.5}} size="small" variant="standard" 
                InputProps={{ style: { fontSize: 15 } }}
                InputLabelProps={{ style: { fontSize: 15 } }}
                className="form-control" label="ID(Ticker + MMDDYYYY)"  
                value={deleteID} onChange={(e) => setDeleteID(e.target.value)} />
            <br/>

              <button className='Button' onClick={deleteStock}>Delete Stock Record </button>
              <button className='Button' onClick={clear}> Clear </button>
          </div>
        ) : null}
      </div>

      <br/><br/>
      <div>
        <button className='Button' onClick={() => setShowViz(true)}> Generate Dashboard </button>
        {showViz ? (
          <div className='VizForm'>
              <h3>Enter the name of the quantum stock you want to Visualize</h3>
            <TextField sx={{mb:0.5}} size="small" variant="standard" 
                InputProps={{ style: { fontSize: 15 } }}
                InputLabelProps={{ style: { fontSize: 15 } }}
                className="form-control" label="Ticker"  
                value={vizStock} onChange={(e) => setVizStock(e.target.value)} />
            <br/>

              <button className='Button' disabled={!vizStock} onClick={dataViz}>Visualize </button>
              <br/>
              <button className='Button' onClick={clear}> Clear </button>
          </div>
        ) : null}
        <br/>
        {showPlot ? (
          <div className='VizChart'>
           <h2>Quantum Stock Dashboard</h2>
           {/* <canvas ref={vizRef} width="400" height="400"></canvas> */}
            <Line data={{
                  labels: labels,
                  datasets: [{
                            label: "Open",
                            data: sourceA,
                            borderWidth:"1.75",
                            backgroundColor: "rgba(6, 167, 125, 0.1)",
                            borderColor: "#1ab29e"
                         }, {
                            label: "High",
                            data: sourceB,
                            borderWidth:"1.75",
                            backgroundColor: "rgba(246, 71, 64, 0.1)",
                            borderColor: "#e0a61f"
                         },{
                            label: "Low",
                            data: sourceC,
                            borderWidth:"1.75",
                            backgroundColor: "rgba(24, 45, 65, 0.1)",
                            borderColor: "#130d3c"
                         }, {
                            label: "Close",
                            data: sourceD,
                            borderWidth:"1.75",
                            backgroundColor: "rgba(26, 143, 227, 0.1)",
                            borderColor: "#9d2561"
                         }]
              
            }}
            height="500px"
            width="500px"
            options={{
              scales: {
                yAxes: [{
                  ticks: {
                     max: 3,
                     min: 0,
                     stepSize: 10000
                   }
                 }],
                },
              scaleOverride : true,
              maintainAspectRatio: false
            }}
            />
          </div>
        ) : null}

      </div>

    </div>
  );
}

export default App;
