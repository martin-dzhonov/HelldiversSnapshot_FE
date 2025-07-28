
import '../styles/App.css';
import '../styles/StrategemsPage.css';
import "react-tabs/style/react-tabs.css";
import { useEffect, useMemo, useState } from 'react'
import { useMobile } from '../hooks/useMobile';
import { apiBaseUrl, patchPeriods } from '../constants';
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import Filters from '../components/Filters';
import Loader from '../components/Loader';
import GamesTable from '../components/GamesTable';
import StrategemChart from '../components/charts/StrategemChart';
import * as chartsSettings from "../settings/chartSettings";
import {
    getChartData,
} from '../utils';
import ChartLegend from '../components/ChartLegend';


import useLegendItems from '../hooks/useLegendItems';
import useFilter from '../hooks/useFilter';
import { useReports } from '../hooks/useReports';

const defaultFilters = {
    page: "armor",
    faction: "terminid",
    category: "All",
    difficulty: 0,
    mission: "All",
    patch: patchPeriods[patchPeriods.length - 1],
};

function ArmorsPage() {
    const [filters, setFilters] = useFilter('armor', defaultFilters);
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
                options: chartsSettings.armor()
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

export default ArmorsPage;