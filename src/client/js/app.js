
import _ from "lodash";

// API key for weatherbit
const key1 = '4bfa589976d946e894128f290f8da4a5';

// API key for pixabay
const key2 = '30063748-4f1428a79e0c061ebc19a87b3'

// API key for geonames
const key3 = 'bigfloppa'

// Event listener to add function to existing HTML DOM element

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

const keyvars  = {}

/* Function called by event listener */

function queueData(){
    const address = document.getElementById('address').value;
    const buildno = document.getElementById('buildno').value;
    const city = document.getElementById('city').value;
    const start_date = document.getElementById('startdate').value;
    const start_date2 = String(start_date.substring(0,3) + (start_date[3] - 1) + start_date.substring(4))
    const end_date = document.getElementById('enddate').value;
    const end_date2 = String(end_date.substring(0,3) + (end_date[3] - 1) + end_date.substring(4))
    console.log(address)
    console.log(buildno)
    console.log(city)
    geoNamesGet(address, buildno, city, key3)
    .then(function (){
        weatherbitGet(keyvars.lat, keyvars.long, start_date2, end_date2, key1)
        .then(function() {
            pixabay(keyvars.pixabaysearch, key2)
            .then(function(data) {
                postData('http://localhost:4202/added_data', {lat: keyvars.lat, long: keyvars.long, image: keyvars.image, high: keyvars.high, low: keyvars.low})
                .then(function() {
                    updateUI()
                })
            })
        });
        
    });
};
/* Function to GET Web API Data*/

const geoNamesGet = async (address, buildno, city, key, keysec)=>{
    const response = await fetch(`http://api.geonames.org/geoCodeAddressJSON?q=${address} + ${buildno} + ${city}&username=${key}`)
    console.log(response)
    try {
        const geodata = await response.json();
        console.log(geodata);
        keyvars.lat = geodata.address.lat
        keyvars.long = geodata.address.lng
        keyvars.pixabaysearch = geodata.address.adminName1
        return keyvars
    } catch(error) {
        console.log(error)
        alert("The address that was inputted is not valid (check formatting)")
    }
}

const weatherbitGet = async (lat, long, startdate, enddate, key)=>{
    const response = await fetch(`https://api.weatherbit.io/v2.0/history/daily?lat=${lat}&lon=${long}&start_date=${startdate}&end_date=${enddate}&key=${key}&units=I`)
    console.log(response)
    try {
        const weatherbitdata = await response.json();
        console.log(weatherbitdata);
        keyvars.low = weatherbitdata.data.at(0).min_temp
        keyvars.high = weatherbitdata.data.at(0).max_temp
        return weatherbitdata
    } catch(error) {
        alert("The dates were incorrectly formatted, make sure you input them as described in the example")
    }
}

const pixabay = async (searchterm, key)=>{
    const response = await fetch(`https://pixabay.com/api/?key=${key}&q=${searchterm}&image_type=photo`)
    console.log(response)
    try {
        const pixabaypic = await response.json();
        console.log(pixabaypic);
        keyvars.image = pixabaypic.hits.at(getRandomInt(19)).largeImageURL
        return pixabaypic
    } catch(error) {
        console.log("oops an error!", error)
    }
}
// POST function for posting Travel App data

const postData = async (url = '', data = {}) => {
    const req = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify(data),
    });
}

const updateUI = async () => {
    const req = await fetch('http://localhost:4202/all_data');
    try {
        const allData = await req.json();
        const imagelocation = document.getElementById('heading'); 
        document.getElementById('coord').innerHTML = `The coordinates of your destination are at: ${allData.lat} ${allData.long}`;
        document.getElementById('temps').innerHTML = `The highest temperatures on your first day there are ${allData.high}F˚ and the lowest temperatures are ${allData.low}F˚`
        imagelocation.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.3),rgba(0, 0, 0, 0.3)),url(${allData.image})`
    }
    catch (error) {
        console.log('error', error);
    }
}

export  { queueData }
export { getRandomInt }
