
import './App.css';
import {FormControl,Select,MenuItem,Card,CardContent} from "@material-ui/core";
import { useState,useEffect} from 'react';
import Infobox from'./Infobox';
import Map from './Map'
import Table from "./Table"
import {prettyPrintStat, sortData} from  './util';
import Linechart from './Linechart';
import 'leaflet/dist/leaflet.css';
import Vaccine from './Vaccine'

// https://disease.sh/v3/covid-19/countries 

function App() {
  const [counteries ,setcountries]= useState([]);
  const [country, setcountry] = useState("worldwide");
  const [countryinfo, setcountryinfo] = useState({});
  const [tabledata, settabledata] = useState([]);
  const [mapcenter, setmapcenter] = useState({lat:34.80746,lng:-40.4796});
  const [zoom, setzoom] = useState(2);
  const [mapcountries, setmapcountries] = useState([])
  const [showvaccine, setshowvaccine] = useState(false);
  const [country2, setcountry2] = useState();
  useEffect(()  => {
      const getCountriesData=async()=>{
             await fetch("https://disease.sh/v3/covid-19/countries").then((response)=>response.json()).then(
               (data)=>{
                 const countriesdata= data.map((country)=>(
                   {
                     name:country.country,
                     value:country.countryInfo.iso2

                   }
             ));
             const sortedData=sortData(data);
             settabledata(sortedData);
             setmapcountries(data);
             setcountries(countriesdata) ;
             setshowvaccine(false);
               }
             )
      }
      getCountriesData();
  }, []);

  useEffect( () => {
         fetch('https://disease.sh/v3/covid-19/all').then((response)=>response.json()
         ).then((data)=>{
           
         setcountryinfo(data);
         }
         
         );
  }, [])
  const onchangeCountry= async (event)=>{
               const  countrycode=event.target.value;
              
              //  console.log("aaa",countrycode)

              countrycode==="worldwide"?setshowvaccine(false):setshowvaccine(true);
              const url = countrycode==="worldwide"?'https://disease.sh/v3/covid-19/all':` https://disease.sh/v3/covid-19/countries/${countrycode} `;
              await fetch(url).then((response)=>response.json()).then((data)=>{
                setcountry(countrycode); 
                    //data stored 
                setcountryinfo(data);
                setmapcenter({lat:data.countryInfo.lat,lng:data.countryInfo.long})
                setzoom(3);
                setshowvaccine(true);
                setcountry2(countrycode)
              
              })  
  
            };
    console.log(countryinfo);
  
  return (
    <div className="app">
    <div className="app__left">
    <div className="app__header">
      <h1>COVID-19 TRACKER</h1>
      <FormControl className="app__dropdown">
       <Select variant="outlined" value={country} onChange={onchangeCountry} >
       <MenuItem value="worldwide"  > worldwide</MenuItem>
          {
            counteries.map(country=>(
              <MenuItem value={country.value}> {country.name} </MenuItem>
            ))
          }
      
    
       </Select>
      
      </FormControl>
      </div>
     <div className="app__status">
      {/* ifoboxes  casess*/}
         
          <Infobox title="Coronavirus cases" cases={prettyPrintStat( countryinfo.todayCases)}total={countryinfo.cases}/>
             {/* infoboxes recover*/}
          <Infobox title="Recovered"  cases={prettyPrintStat(countryinfo.todayRecovered)}total={countryinfo.recovered}/>
            {/*infoboxes deaths */}
          <Infobox title="Deaths" cases={prettyPrintStat(countryinfo.todayDeaths)}total={countryinfo.deaths}/>
          
      
     
       </div>

     
       {/*map */}
       <Map center={mapcenter} zoom={zoom} countries={mapcountries} />
    
    </div>
    <Card className="app_right">
          {/* table */}
          <div className="card__box">
          <CardContent>
             <h3> live cases by country</h3>
              <Table countries={tabledata}/>
             <h3>world wide new cases</h3>
          </CardContent>
       {/*graph */}
       <Linechart casesType="cases"></Linechart>
       </div>
    
    </Card>

   {
     showvaccine===false?null: <div className="app__end">
   
     <Card>
     <CardContent>
     <h3 className="vaccine__header"> vaccine</h3>
     <Vaccine  country={country2}></Vaccine>
     </CardContent>
    
     </Card>
     </div>
   }
    </div>
  );
}

export default App;
