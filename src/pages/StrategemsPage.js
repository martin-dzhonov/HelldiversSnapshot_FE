
import '../styles/App.css';
import '../styles/StrategemsPage.css';
import "react-tabs/style/react-tabs.css";
import { useEffect, useState } from 'react'
import { patchPeriods } from '../constants';
import Filters from '../components/filters/Filters';
import Loader from '../components/Loader';
import ToggleableChart from '../components/charts/ToggleableChart';
import * as chartsSettings from "../settings/chartSettings";
import {
  getChartData,
} from '../utils/utils';
import useLegendItems from '../hooks/useLegendItems';
import { useReports2 } from '../hooks/useReports2';
import useFilter from '../hooks/useFilter';

const defaultFilters = {
  page: "strategem",
  faction: "terminid",
  category: "All",
  difficulty: 0,
  mission: "All",
  modifier: "ALL",
  patch: patchPeriods[patchPeriods.length - 1], 
};

//add hover tooltip for details and games too
//hover patch tooltip flicker

//BE stress test

//mobile design
//add wiki links


 
const defaultFilterResults = { games: 0, loadouts: 0 };

function StrategemsPage() {
  const [filters, setFilters] = useFilter(defaultFilters);
  const [filterResults, setFilterResults] = useState(defaultFilterResults);
  const { data, isLoading } = useReports2(filters);
  const [chartData, setChartData] = useState(null);

  const [showFull, setShowFull] = useState(true); 
  const { legendItems, handleLegendCheck } = useLegendItems(setChartData, filters);

  const resetFilters = () => {
    setFilters({ ...defaultFilters });
  };
  useEffect(() => {
    if (data) {
      const { chartData, totals } = getChartData(data, filters);

      setChartData({
        data: chartData,
        options: chartsSettings.strategem()
      });

      setFilterResults(totals);
    }
  }, [data, filters]);

  return (
    <>
      <Filters
        filters={filters}
        totals={filterResults}
        setFilters={setFilters}
        resetFilters={resetFilters}
      />
      <div className="content-wrapper">
        <Loader loading={isLoading}>
          {chartData && (
            <ToggleableChart
            isLoading={isLoading}
            chartData={chartData}
            filters={filters}
            legendItems={legendItems}
            showFull={showFull}
            setShowFull={setShowFull}
          />
          
          )}
        </Loader>
      </div>
    </>
  );
}

export default StrategemsPage;