import React, { useState } from 'react';
import { IByCountryRow, IByCountrySummaryRow } from '../types';
import { AllInOneChart } from './AllInOneChart';

interface ICountryAllChartProps {
  country: string,
  summary: IByCountrySummaryRow,
  data: IByCountryRow,
}

export const CountryAllChart = (props: ICountryAllChartProps) => {
  const [isOpen, setOpened] = useState(true);

  const { country, summary, data } = props;

  const confirmed = `${summary?.confirmed}` || '-';
  const recovered = `${summary?.recovered}` || '-';
  const deaths = `${summary?.deaths}` || '-';
  const active = `${summary?.active}` || '-';

  return (
    <div className="col-6" key={country}>
      <h1><a onClick={() => setOpened(!isOpen)}>{country} <span className="active">{active}</span> <span className="confirmed">{confirmed}</span> <span className="recovered">{recovered}</span> <span className="deaths">{deaths}</span></a></h1>
      {isOpen &&
      <AllInOneChart
        labels={Object.keys(data.confirmed)}
        confirmedData={Object.values(data.confirmed)}
        recoveredData={Object.values(data.recovered)}
        deathsData={Object.values(data.deaths)}
        activeData={Object.values(data.active)}
      />
      }
    </div>
  );
};
