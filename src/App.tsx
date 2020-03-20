import React from 'react';
import Papa from 'papaparse';
import logo from './logo.svg';
import './App.css';

function App() {

  const confirmedUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv';
  getCsvData(confirmedUrl).then(confirmed => {
    console.log('confirmed', confirmed);
  });

  const deathsUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Deaths.csv';
  getCsvData(deathsUrl).then(deaths => {
    console.log('deaths', deaths);
  });

  const recoveredUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Recovered.csv';
  getCsvData(recoveredUrl).then(recovered => {
    console.log('recovered', recovered);
  });


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo"/>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

async function getCsvData(url: string) {
  let csvData = await fetchCsv(url);

  return Papa.parse(csvData, { header: true });
}

async function fetchCsv(url: string) {
  return fetch(url).then(function (response) {
    if (!response.body) {
      return '';
    }
    let reader = response.body.getReader();
    let decoder = new TextDecoder('utf-8');

    return reader.read().then(function (result) {
      return decoder.decode(result.value);
    });
  });
}

export default App;
