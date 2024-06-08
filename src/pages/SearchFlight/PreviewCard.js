import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { TextField } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Header from '../extras/Header';
import { useState,useEffect } from 'react';
import { json, useNavigate } from 'react-router-dom';
import Autocomplete from '@mui/material/Autocomplete';

import './search.css';
import axios from '../../axios';
import { useFirebase } from '../../firebase';


const PreviewCard = () => {

   
    const date=new Date();

    const firebase=useFirebase()
    const a=[1,2,3,4,5,6,7,8,9,10];
    const navigate=useNavigate()
    const curdate=`${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    const [way,setway]=useState('oneway');
     const [focus, setFocused] = useState(false);
     const [dd,setdd]=useState(curdate)
     const [rd,setrd]=useState(curdate);
     const [adult,setadult]=useState(1);
     const [child,setchild]=useState(0);
    const [Class, setClass] = useState('');
    const [from,setfrom]=useState(null);
    const [to,setto]=useState(null);
    const [data,setdata]=useState([]);
    const [cities,setcities]=useState([]);

    const handleChange = (event) => {
        setClass(event.target.value);
    };
    const findResults=(e)=>{
      e.preventDefault();
        const obj={way,from,to,dd,rd,adult,child,Class}
        console.log(obj);
        if(obj.Class==='' || obj.from===null||obj.to===null){
            console.log("error")
        }
        if(adult+child>=10){
          console.log("Not Able to book more than 9 people")
        }
        else{
             axios.post("/users/searchresults",obj, {
            headers: {
          'Content-Type': 'application/json',
          'Authorization': firebase.token
        },
        withCredentials: true
      })
      .then((res) => {
          window.localStorage.setItem('obj',JSON.stringify([obj]));
          window.localStorage.setItem('way',way);
          window.localStorage.setItem('resultdata',JSON.stringify(res.data));
          navigate("/flights/result")
          window.location.reload();
      })
      .catch(err => console.log(err));
        }
    }
    const getcities=()=>{
        axios.get("/users/getcities",{
            headers:{
                'Content-Type':'application/json'
            },
            withCredentials:true
          }).then((res)=>{
            setcities(res.data);
        }).catch(err=>{
                console.log(err);
        })
    }
    useEffect(()=>{
        getcities();
    },[])
    const [hasValue, setHasValue] = useState(true);
    const onFocus = () => setFocused(true);
    const onBlur = () => setFocused(false);
     useEffect(()=>{
        const h=window.localStorage.getItem('obj');
        const t=JSON.parse(h)[0]
        setway(t.way);
        setfrom(t.from);
        setto(t.to);
        setdd(t.dd);
        setrd(t.rd);
        setadult(t.adult);
        setchild(t.child);
        setClass(t.Class);
    },[])
  return (
    <>
    <div>
    <form onSubmit={findResults} className='flex flex-wrap md:items-center md:justify-evenly -ml-8 md:ml-0 border-r-0 border-l-0 w-full border-2 pt-28'>
      <div className='w-full ml-20 md:ml-36  '>
        <FormControl> 
            <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            value={way}
            onChange={(e)=>setway(e.target.value)}
            >
            <FormControlLabel value="oneway" control={<Radio />} defaultChecked={true} label="One-Way" />
            <FormControlLabel value="round" control={<Radio />} label="Round-Trip" />
            </RadioGroup>
        </FormControl>
      </div>
      <div className='flex items-center w-full md:w-1/4 ml-20 md:ml-0'>
        <Autocomplete
        value={from}
        isOptionEqualToValue={(option,value)=>option===value}
        onChange={(event, newValue) => {
          setfrom(newValue);
        }}
        id="controllable-states-demo"
        options={cities}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="From" />}
      />
        <SwapHorizIcon className='shadow-sm border-2 -ml-2  rounded-lg -mr-2 bg-white z-10 border-blue-100' fontSize='large' onClick={()=>{
            setfrom(to);
            setto(from);
        }}/>

       <Autocomplete
        value={to}
        isOptionEqualToValue={(option,value)=>option===value}
        onChange={(event, newValue) => {
          setto(newValue);
        }}
        id="controllable-states-demo"
        options={cities}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="to" />}
      />
      </div>

      <div className='flex items-center w-full md:w-1/4 ml-20 md:ml-0 mt-8 md:mt-0' >
            <TextField
                onFocus={onFocus}
                 InputProps={{
                    inputProps:{min:curdate}
                }}
                className={way==="round"?'w-36 kl':'w-80 kl'}
                value={dd}
                onChange={(e) => {
                if (e.target.value){
                    setdd(e.target.value)
                    setHasValue(true);
                } 
                    else setHasValue(false);
                }}
                label="Departure"
                type={hasValue || focus ? "Date" : "text"}
                />
             {way==='round' && <TextField
                onFocus={onFocus}
                onBlur={onBlur}
                className='md:w-40 kl w-44'
                value={rd}
                 InputProps={{
                    inputProps:{min:curdate}
                }}
                onChange={(e) => {
                if (e.target.value){
                    setrd(e.target.value)
                    setHasValue(true);
                } 
                    else setHasValue(false);
                }}
                label="Return"
                type={hasValue || focus ? "date" : "text"}
                />}
      </div>
      
      <div className='flex items-center w-full md:w-1/4 ml-20 md:ml-0 md:mt-0 mt-10'>
            <FormControl className='w-40'>
            <InputLabel id="demo-simple-select-label">Adults</InputLabel>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={adult}
                label="Adult"
                onChange={(e)=>setadult(e.target.value)}
                
                >
                {a.map((t)=>{return<MenuItem key={t} value={t}>{t}</MenuItem>})}
                </Select>
      </FormControl>
      <FormControl className='w-40'>
            <InputLabel id="demo-simple-select-label">Children</InputLabel>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={child}
                label="Children"
                onChange={(e)=>setchild(e.target.value)}
                
                >
                    <MenuItem value={0}>0</MenuItem>
                {a.map((t)=>{return<MenuItem key={t} value={t}>{t}</MenuItem>})}
                </Select>
      </FormControl>
      </div>
      <div >
        <FormControl className='w-40 md:w-44'>
            <InputLabel id="demo-simple-select-label">Class</InputLabel>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={Class}
                label="Class"
                onChange={handleChange}
                
                >
                <MenuItem value={"Economy"} selected={true}>Economy</MenuItem>
                <MenuItem value={"Business"}>Business</MenuItem>
                <MenuItem value={"Firstclass"}>First Class</MenuItem>
                </Select>
      </FormControl>
      </div>
         
      
      <div className='w-full justify-center flex mt-10 pb-10'>
        <button className='bg-orange-400 w-40 h-10 text-white font-bold text-xl rounded-md hover:bg-orange-500' >Update Search</button>
      </div>
      
    </form>
    </div>
    </>
  )
};

export default PreviewCard;
