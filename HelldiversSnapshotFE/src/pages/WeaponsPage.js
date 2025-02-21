
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
    weaponsByCategory
} from '../utils';

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
        matchCount: 0,
        loadoutCount: 0
    });

    const fetchData = async (url) => {
        const fetchPromise = await fetch(`${apiBaseUrl}${url}`);
        const response = await fetchPromise.json();
        setData(response);
        setLoading(false);
    };

    useEffect(() => {
        if (filters.difficulty || filters.mission) {
            setLoading(true);
            fetchData(`/strategem?diff=${filters.difficulty}&mission=${filters.mission}`);
        }
    }, [filters.difficulty, filters.mission]);

    useEffect(() => {
        if ((tabIndex === 0 || tabIndex === 2) && data && filters) {
            const factionData = data[filters.faction];
            const patchData = factionData[filters.patch.id];
            setWeaponsGraphData(weaponsByCategory(patchData, filters.category));
            if (patchData) {
                setFilterResults({
                    matchCount: patchData.totalGames,
                    loadoutCount: patchData.totalLoadouts
                });
            }
        }
    }, [data, filters, tabIndex]);

    return (
        <div className="content-wrapper">
            <Filters tab={tabIndex} filters={filters} type={1} setFilters={setFilters} />
            {isMobile && !loading &&
                <div className="end-element">
                    <div className='filters-result-text'>
                        Matches: {filterResults.matchCount}
                        &nbsp;&nbsp;&nbsp;
                        Loadouts: {filterResults.loadoutCount}
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
                            Matches: {filterResults.matchCount}
                            &nbsp;&nbsp;&nbsp;
                            Loadouts: {filterResults.loadoutCount}
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
