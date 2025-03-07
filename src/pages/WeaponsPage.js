
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
    getPatchDiffs1,
    getWeaponRank,
    printDiffs,
    printWeapons,
    weaponsByCategory
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
            // fetchData(`/report`);
            fetchData(`/strategem?diff=${filters.difficulty}&mission=${filters.mission}`);
        }
    }, []);


    useEffect(() => {
        if (data && filters) {
            const factionData = data[filters.faction];

            const startPatchData = factionData[filters.patch.id];
            const endPatchData = factionData[filters.patchStart.id];
            const endPatch = weaponsByCategory(startPatchData, filters);
            const startPatch = weaponsByCategory(endPatchData, filters);
            const graphData = getPatchDiffs1(startPatch, endPatch);
            
            setWeaponsGraphData(graphData);
            setFilterResults({
                games: startPatchData.total.games,
                loadouts: startPatchData.total.loadouts
            });

        }
    }, [data, filters, tabIndex]);


    // useEffect(() => {
    //     if (data && filters) {
    //         const factionData = data[filters.faction];
    //         const patchData = factionData[filters.patch.id];

    //         setWeaponsGraphData(weaponsByCategory(patchData, filters));


    //         if(isDev){
    //             printWeapons(weaponsByCategory(patchData, filters));
    //         }
            
    //         if (patchData) {
    //             setFilterResults(getFieldByFilters(patchData, filters));
    //         }
    //     }
    // }, [data, filters, tabIndex]);

    function mergeAndSum(arrays) {
        const merged = {};
    
        arrays.flat().forEach(({ name, rank }) => {
            merged[name] = (merged[name] || 0) + rank;
        });
    
        return Object.entries(merged).map(([name, rank]) => ({ name, rank }));
    }
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
            // })
            // console.log(arr);
            // console.log(arr2);

            // console.log(arr3);
            
            // console.log(mergeAndSum([arr, arr2, arr3]).sort((a,b)=> a.rank-b.rank))

            
    return (
        <div className="content-wrapper">
            <Filters tab={tabIndex} filters={filters} type={1} setFilters={setFilters} />
            {isMobile && !loading &&
                <div className="end-element">
                    <div className='filters-result-text'>
                        Matches: {filterResults.games}
                        &nbsp;&nbsp;&nbsp;
                        Loadouts: {filterResults.loadouts}
                    </div>
                </div>
            }
            <Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
                <div className="tabs-container">
                    <TabList className="custom-tab-list">
                        <Tab>Snapshot</Tab>
                        <Tab style={{display: 'none'}}></Tab>
                        <Tab>Games</Tab>
                    </TabList>

                    {!isMobile && !loading && <div className="end-element">
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
                                expandable
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
