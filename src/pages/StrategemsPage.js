
import '../styles/App.css';
import '../styles/StrategemsPage.css';
import "react-tabs/style/react-tabs.css";
import { useEffect, useState } from 'react'
import { patchPeriods } from '../constants';
import Filters from '../components/filters/Filters';
import Loader from '../components/Loader';
import ImageChart from '../components/charts/ImageChart';
import * as chartsSettings from "../settings/chartSettings";
import {
  getChartData,
} from '../utils';
import ChartLegend from '../components/ChartLegend';
import useLegendItems from '../hooks/useLegendItems';
import { useReports } from '../hooks/useReports';
import useFilter from '../hooks/useFilter';
import PartnerButton from '../components/PartnerButton';

const defaultFilters = {
  page: "strategem",
  faction: "terminid",
  category: "All",
  difficulty: 0,
  mission: "All",
  patch: patchPeriods[patchPeriods.length - 1],
};

function StrategemsPage() {
  const [filters, setFilters] = useFilter(defaultFilters);
  const [filterResults, setFilterResults] = useState({games: 0, loadouts: 0});
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
      <Filters filters={filters} setFilters={setFilters} />

      <ChartLegend
        items={legendItems}
        onCheckChange={handleLegendCheck}
        filterResults={filterResults} />

      <Loader loading={isLoading}>
        {chartData &&
          <ImageChart
            barData={chartData.data}
            options={chartData.options}
            filters={filters}
            legendItems={legendItems}
            limit={10}
          />
        }
      </Loader>
      <PartnerButton />
    </div >
  );
}

export default StrategemsPage;