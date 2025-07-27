
import '../styles/App.css';
import '../styles/StrategemsPage.css';
import "react-tabs/style/react-tabs.css";
import { useEffect, useState } from 'react'
import { patchPeriods } from '../constants';
import Filters from '../components/Filters';
import Loader from '../components/Loader';
import StrategemChart from '../components/charts/StrategemChart';
import * as chartsSettings from "../settings/chartSettings";
import {
  getChartData,
} from '../utils';
import ChartLegend from '../components/ChartLegend';
import useLegendItems from '../hooks/useLegendItems';
import { useReports } from '../hooks/useReports';
import useFilter from '../hooks/useFilter';

const defaultFilters = {
  page: "strategem",
  faction: "terminid",
  category: "All",
  difficulty: 0,
  mission: "All",
  patch: patchPeriods[patchPeriods.length - 1],
};

function StrategemsPage() {
  const [filters, setFilters] = useFilter('strategems', defaultFilters);
  const [filterResults, setFilterResults] = useState({
    games: 0,
    loadouts: 0
  });
  const { data, isLoading } = useReports(filters);
  const [chartData, setChartData] = useState(null);
  const { legendItems, handleLegendCheck } = useLegendItems(setChartData, filters);

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
    <div className="content-wrapper">
      <Filters filters={filters} type={0} setFilters={setFilters} />

      <ChartLegend
        items={legendItems}
        onCheckChange={handleLegendCheck}
        filterResults={filterResults} />

      <Loader loading={isLoading}>
        {chartData &&
          <StrategemChart
            type='strategem'
            barData={chartData.data}
            options={chartData.options}
            filters={filters}
            legendItems={legendItems}
            limit={10}
          />
        }
      </Loader>
    </div >
  );
}

export default StrategemsPage;