import React,{useState,useEffect} from 'react'
import { timedata } from './util';
import numeral from 'numeral';
import "./Vaccine.css"

function Vaccine({country}) {
    console.log(country);
    const [vaccineData, setvaccineData] = useState();
    const [vaccineDate, setvaccineDate] = useState([]);
    const [vaccinedpeople, setvaccinedpeople] = useState([])
    useEffect(() => {
     
        const getvaccinData= async ()=>{
           let totalpeople=[];
           let date=[]
            await fetch(`https://disease.sh/v3/covid-19/vaccine/coverage/countries/${country}?lastdays=5`).then((Response)=>{
                
            const re=Response.json();
            console.log(re)
             re.then(data=>{
                 for (const key in data.timeline) {
                      totalpeople.push(data.timeline[key]);
                      date.push(key);
                 }
                 setvaccineDate(date);
                 setvaccinedpeople(totalpeople)
                 setvaccineData(data.country)
             }).catch(e=>{
                 console.log(e)
             })
        
        }).catch(e=>{
            console.log(e)
        })
               }
    
       
      getvaccinData();
    }, []);


    
    // console.log(vaccineData)
    return (
        <div className="vaccin">
        <h3 className="vaccine__country">{vaccineData}</h3>
        <div className="vaccine__status">
        <div className="left">
            <h4>Date</h4>
          {vaccineDate.map(date=>(
              <h4 className="date">{date}</h4>
          ))}

          </div>
          <div className="right">

          <h4>total</h4>
          {vaccinedpeople.map(people=>(
              <h4 className="people">{ numeral(people).format("0,0")}</h4>
          ))}

          </div>
        
        </div>
        </div>
    )
}

export default Vaccine
