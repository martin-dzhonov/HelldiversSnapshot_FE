
import '../styles/App.css';
import '../styles/SnapshotPage.css';
import "react-tabs/style/react-tabs.css";
import { useEffect, useMemo, useState } from 'react'
import { useMobile } from '../hooks/useMobile';
import { isDev, apiBaseUrl, patchPeriods } from '../constants';
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import Filters from '../components/Filters';
import Loader from '../components/Loader';
import GamesTable from '../components/GamesTable';
import StrategemChart from '../components/charts/StrategemChart';
import * as chartsSettings from "../settings/chartSettings";
import {
    getFieldByFilters,
    getFiltersCount,
    getPatchDelta,
    itemsByCategory,
} from '../utils';
import { dataDummy } from '../dataDummy';
import ChartLegend from '../components/ChartLegend';

import trendUpIcon from "../assets/icons/trendUp.svg";
import trendDownIcon from "../assets/icons/trendDown.svg";
import rankIcon from "../assets/icons/rank.svg";
import playedIcon from "../assets/icons/people.svg";
import levelIcon from "../assets/icons/level.svg";
import useLegendItems from '../hooks/useLegendItems';

function ArmorsPage() {
    const { isMobile } = useMobile()
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [strategemGraphData, setStrategemGraphData] = useState(null);
    const [asd, setasd] = useState(null);

    const [filterResults, setFilterResults] = useState({
        games: 0,
        loadouts: 0
    });
    const [filters, setFilters] = useState({
        page: "armors",
        faction: "terminid",
        category: "All",
        difficulty: 0,
        mission: "All",
        patch: patchPeriods[0],
        patchStart: patchPeriods[1]
    });
    const { legendItems, handleLegendCheck } = useLegendItems(setStrategemGraphData, filters);

    const fetchData = async (url) => {
        // const fetchPromise = await fetch(`${apiBaseUrl}${url}`);
        //const response = await fetchPromise.json();//dataDummy
        setData(dataDummy);
        setLoading(false);
    };

    useEffect(() => {
        setLoading(true);
        fetchData(`/strategem?diff=${filters.difficulty}&mission=${filters.mission}`);
    }, []);

    useEffect(() => {
        if (data && filters) {
            const factionData = data[filters.faction];
            const endPatch = itemsByCategory(factionData[filters.patch.id], filters)
            const startPatch = itemsByCategory(factionData[filters.patch.id + 1], filters)
            const graphData = getPatchDelta(startPatch, endPatch);

            //console.log(graphData);
            
            setStrategemGraphData({
                data :graphData, 
                options: chartsSettings.strategem()
            });
            setFilterResults(getFieldByFilters(factionData[filters.patch.id], filters))
        }
    }, [data, filters]);

    return (
        <div className="content-wrapper">
            <Filters filters={filters} type={0} setFilters={setFilters} />

            <ChartLegend
                items={legendItems}
                onCheckChange={handleLegendCheck}
                filterResults={filterResults} />

            <Loader loading={loading}>
                {strategemGraphData &&
                    <StrategemChart
                        type='armors'
                        barData={strategemGraphData.data}
                        options={strategemGraphData.options}
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