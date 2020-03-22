import Papa from 'papaparse';
import React, { useState } from 'react';
import './App.css';
import { CountryAllChart } from './Components/CountryAllChart';
import { Dictionary, IByCountrySummaryRow, TByCountry, TByCountryRowKey, TByCountrySummary } from './types';
import moment from 'moment';

function App() {

  const confirmedUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv';
  const deathsUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Deaths.csv';
  const recoveredUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Recovered.csv';

  const [isLoaded, setLoaded] = useState(false);
  const [byCountry, setByCountry] = useState({} as TByCountry);
  const [countriesByConfirmed, setCountriesByConfirmed] = useState([] as string[]);
  const [byCountrySummary, setByCountrySummary] = useState({} as TByCountrySummary);

  if (!isLoaded) {
    Promise.all([getCsvData(confirmedUrl), getCsvData(recoveredUrl), getCsvData(deathsUrl)]).then(([confirmed, recovered, deaths]) => {
      setLoaded(true);
      console.log('confirmed', confirmed);
      console.log('recovered', recovered);
      console.log('deaths', deaths);

      const byCountry: TByCountry = {};
      addDataToCountry(byCountry, confirmed.data, 'confirmed');
      addDataToCountry(byCountry, recovered.data, 'recovered');
      addDataToCountry(byCountry, deaths.data, 'deaths');
      addActiveDataToCountry(byCountry);
      console.log('byCountry', byCountry);
      const byCountrySummary: TByCountrySummary = getCountrySummary(byCountry);
      console.log('byCountrySummary', byCountrySummary);
      setByCountry(byCountry);
      setByCountrySummary(byCountrySummary);
      const countriesByConfirmed: string[] = Object.keys(byCountry);
      setCountriesByConfirmed(countriesByConfirmed);
    });
  }

  return (
    <div className="App">
      <header className="App-header">

        <div className="container">
          <div className="row">
            {countriesByConfirmed.map((country, i) => (
              <CountryAllChart
                country={country}
                summary={byCountrySummary[country]}
                data={byCountry[country]}
                key={country}
              ></CountryAllChart>
            ))}
          </div>
        </div>

      </header>
    </div>
  );
}

const addActiveDataToCountry = (destination: TByCountry) => {
  const countries = Object.keys(destination);
  for (let i = 0; i < countries.length; i += 1) {
    const country = countries[i];
    const countryRow = destination[country];
    const dates = Object.keys(countryRow.confirmed);
    for (let j = 0; j < dates.length; j += 1) {
      const date = dates[j];
      countryRow.active[date] = countryRow.confirmed[date] - countryRow.recovered[date] - countryRow.deaths[date];
    }
  }
};

const addDataToCountry = (destination: TByCountry, dataInput: Dictionary<string>[], key: TByCountryRowKey) => {
  for (let i = 0; i < dataInput.length; i += 1) {
    const row = dataInput[i];
    const country = row['Country/Region'];
    if (!destination[country]) {
      destination[country] = {
        confirmed: {},
        recovered: {},
        deaths: {},
        active: {},
      };
    }

    const dateKeys = Object.keys(row).filter(k => k.match(/[0-9/]{6,}/));
    dateKeys.forEach(date => {
      const reformattedDate = moment(date, 'M/D/YY').format('D.M.YY');
      destination[country][key][reformattedDate] = parseInt(row[date]) + (destination[country][key][reformattedDate] | 0);
    });
  }
};

const getCountrySummary = (byCountry: TByCountry): TByCountrySummary => {
  const byCountrySummary: TByCountrySummary = {};
  Object.keys(byCountry).forEach((country) => {
    const confKeys = Object.keys(byCountry[country].confirmed);
    const recKeys = Object.keys(byCountry[country].recovered);
    const deKeys = Object.keys(byCountry[country].deaths);
    const confirmed = byCountry[country].confirmed[confKeys[confKeys.length - 1]];
    const recovered = byCountry[country].recovered[recKeys[recKeys.length - 1]];
    const deaths = byCountry[country].deaths[deKeys[deKeys.length - 1]];
    byCountrySummary[country] = {
      confirmed,
      recovered,
      deaths,
      active: confirmed - recovered - deaths,
    };
  });
  return byCountrySummary;
};

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
