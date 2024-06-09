import { useEffect, useState } from "react";
import axios from "../../axios";
import BookingSuccFlightPrev from "../Booking/BookingSuccFlightPrev";
import Header from "../extras/Header";
import { useFirebase } from "../../firebase";
import UpcomingCard from "./UpcomingCard";

const Upcoming = () => {
    const [trips,setTrips]=useState([]);
    const firebase=useFirebase();
    const user=firebase.user;
    const getTrips=()=>{
        firebase.setloader(true);
        axios.get("/users/getupcomingtrips",{
            headers:{
                'Content-Type':'application/json',
                'Authorization':user.uid
            }
        })
        .then(res=>{
            setTrips(res.data);
    })
        .catch(err=>console.log(err))
        firebase.setloader(false);
    }
    useEffect(()=>{
        getTrips();
    },[])
  return (
    <div className="pt-20 relative top-44 ">
        {trips.length!==0 ?<p className="text-center font-bold text-2xl">Upcoming Trips</p>:<p className="text-center font-bold text-2xl">No Upcoming Trips</p>}
        {trips && trips.map((trip,i)=>{
            return(
                <UpcomingCard key={trip._id} trip={trip} i={i+1}/>
            )
        })}
    </div>
  )
};

export default Upcoming;
