
import '../styles/App.css';
import '../styles/SnapshotPage.css';
import "react-tabs/style/react-tabs.css";
import { useEffect, useState } from 'react'
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
    getPatchDelta,
    itemsByCategory,
} from '../utils';
import { dataDummy } from '../dataDummy';

function WeaponsPage() {
    const { isMobile } = useMobile()
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [tabIndex, setTabIndex] = useState(0);
    const [weaponsGraphData, setWeaponsGraphData] = useState(null);

    const [filters, setFilters] = useState({
        faction: "terminid",
        category: "Primary",
        difficulty: 0,
        mission: "All",
        patch: patchPeriods[0],
        patchStart: patchPeriods[1]
    });

    const [filterResults, setFilterResults] = useState({
        games: 0,
        loadouts: 0
    });

    const fetchData = async (url) => {
        // const fetchPromise = await fetch(`${apiBaseUrl}${url}`);
        // const response = await fetchPromise.json();
        setData(dataDummy);
        setLoading(false);
    };

    useEffect(() => {
        if (filters.difficulty || filters.mission) {
            setLoading(true);
            fetchData(`/strategem?diff=${filters.difficulty}&mission=${filters.mission}`);
        }
    }, []);

    useEffect(() => {
        if (data && filters) {
            const factionData = data[filters.faction];
            const endPatch = itemsByCategory(factionData[filters.patch.id], filters, 'weapons')
            const startPatch = itemsByCategory(factionData[filters.patchStart.id], filters, 'weapons')
            const graphData = getPatchDelta(startPatch, endPatch)

            setWeaponsGraphData(graphData);
            setFilterResults(getFieldByFilters(factionData[filters.patch.id], filters))
        }
    }, [data, filters, tabIndex]);
 
    return (
        <div className="content-wrapper">
            <Filters tab={tabIndex} filters={filters} type={1} setFilters={setFilters} />
            <Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
                <div className="tabs-container">
                    <TabList className="custom-tab-list">
                        <Tab>Snapshot</Tab>
                        <Tab style={{ display: 'none' }}></Tab>
                        <Tab>Games</Tab>
                    </TabList>

                    {!loading && <div className="end-element">
                        <div className='filters-result-text'>
                            Matches: {filterResults.games}
                            &nbsp;&nbsp;&nbsp;
                            Loadouts: {filterResults.loadouts}
                        </div>
                    </div>}
                </div>

                <Loader loading={loading}>
                    <TabPanel>
                        {weaponsGraphData &&
                            <StrategemChart
                                barData={weaponsGraphData}
                                filters={filters}
                                options={chartsSettings.snapshotWeapons}
                                limit={10}
                                type="weapons"
                            />
                        }
                    </TabPanel>
                    <TabPanel> </TabPanel>
                    <TabPanel>
                        <div className="show-games-table-wrapper">
                            <GamesTable filters={filters} />
                        </div>
                    </TabPanel>
                </Loader>
            </Tabs>
        </div >
    );
}

export default WeaponsPage;

   // function mergeAndSum(arrays) {
    //     const merged = {};

    //     arrays.flat().forEach(({ name, rank }) => {
    //         merged[name] = (merged[name] || 0) + rank;
    //     });

    //     return Object.entries(merged).map(([name, rank]) => ({ name, rank }));
    // }
    // const arr = Object.keys(weaponsByCategory(data['automaton'][filters.patch.id], filters)).map((item)=> {
    //     return {
    //         name: item,
    //         rank: getWeaponRank(data['automaton'][filters.patch.id], item, true) 
    //     }
    // })

    // const arr2 = Object.keys(weaponsByCategory(data['terminid'][filters.patch.id], filters)).map((item)=> {
    //     return {
    //         name: item,
    //         rank: getWeaponRank(data['terminid'][filters.patch.id], item, true) 
    //     }
    // })

    // const arr3 = Object.keys(weaponsByCategory(data['illuminate'][filters.patch.id], filters)).map((item)=> {
    //     return {
    //         name: item,
    //         rank: getWeaponRank(data['illuminate'][filters.patch.id], item, true) 
    //     }
    // })u
    // console.log(arr);
    // console.log(arr2);

    // console.log(arr3);

    // console.log(mergeAndSum([arr, arr2, arr3]).sort((a,b)=> a.rank-b.rank))