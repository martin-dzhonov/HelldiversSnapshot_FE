
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
import useFilter from '../hooks/useFilter';
import { useReports } from '../hooks/useReports';
import useMobile from '../hooks/useMobile';

const defaultFilters = {
    page: "weapons",
    faction: "terminid",
    category: "Primary",
    difficulty: 0,
    mission: "All",
    patch: patchPeriods[patchPeriods.length - 1],
};

function WeaponsPage() {
    const [filters, setFilters] = useFilter('weapons', defaultFilters);
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
            let axisWidth = filters.category === "Throwable" ? 85 : 145;
        
            setChartData({
                data: chartData,
                options: chartsSettings.weapons({axisWidth})
            });
            setFilterResults(totals);
        }
    }, [data, filters]);

    return (
        <div className="content-wrapper">
            <Filters filters={filters} type={1} setFilters={setFilters} />
            <ChartLegend
                items={legendItems}
                onCheckChange={handleLegendCheck}
                filterResults={filterResults} />
            <Loader loading={isLoading}>
                {chartData &&
                    <StrategemChart
                        type="weapons"
                        barData={chartData.data}
                        options={chartData.options}
                        filters={filters}
                        legendItems={legendItems}
                        limit={10}
                    />}
            </Loader>
        </div >
    );
}

export default WeaponsPage;