import "../styles/App.css";
import "../styles/WeaponPage.css";

import "../styles/StrategemPage.css";
import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import * as chartsSettings from "../settings/chartSettings";
import StratagemRank from "../components/StratagemRank";
import useMobile from "../hooks/useMobile";
import BarChart from "../components/charts/BarChart";
import StrategemChart from '../components/charts/StrategemChart';

import Loader from "../components/Loader";
import {
    apiBaseUrl,
    patchPeriods,
    strategemsDict,
    weaponsDict,
    missionTypes,
    factions,
    factionColors,
    itemCategories,
    difficultiesNamesShort,
    itemsDict,
} from "../constants";
import {
    getItemColor,
    getPercentage,
    capitalizeFirstLetter,
    getWeaponRank,
    getPatchItemCount,
    getCompanionChartData,
    getDatasetValue,
    getDatasetByKey,
    getMaxRounded,
    getItemRank,
    getItemsByCategory,
    getFactionsMax
} from "../utils";
import ItemFilters from "../components/ItemFilters";
import PatchChart from "../components/charts/PatchChart";
import { dataDummy } from "../dataDummy";

function WeaponPage() {
    let { itemID, factionID } = useParams();
    const { isMobile } = useMobile();

    const [fetchData, setFetchData] = useState();
    const [factionChart, setFactionChart] = useState(null);
    const [companionCharts, setCompanionCharts] = useState(null);
    const [diffChart, setDiffChart] = useState(null);
    const [missionChart, setMissionChart] = useState(null);
    const [levelChart, setLevelChart] = useState(null);

    const [filters, setFilters] = useState({
        type: "weapons",
        faction: factionID,
        format: 'pick_rate',
        patch: { ...patchPeriods[0] }
    });

    useEffect(() => {
        setFetchData(dataDummy);

        // const fetchStratagem = fetch(apiBaseUrl + `/strategem`)
        //     .then((response) => response.json());
        // fetchStratagem.then((res) => {
        //     setFetchData(res);
        // });
    }, []);

    const dataFilter = useMemo(() => {
        if (fetchData && filters) {
            const filtered = fetchData[filters.faction][filters.patch.id];
            return filtered;
        }
    }, [fetchData, filters]);

    const weaponData = useMemo(() => {
        if (dataFilter) {
            if (!dataFilter.weapons[itemID]) {
                return { loadouts: 0 }
            }
            return dataFilter.weapons[itemID];
        }
    }, [dataFilter, itemID]);

    useEffect(() => {
        if (fetchData && itemID) {
            const currData = fetchData[filters.faction][filters.patch.id];
            const factionsData = factions.map((factionName) => {
                const currPatchData = fetchData[factionName][filters.patch.id];
                return getDatasetValue(itemID, currPatchData, filters);
            });
            const factionsMax = getFactionsMax(itemID, factionsData, currData, filters);

            setFactionChart({
                labels: factions.map((item) => capitalizeFirstLetter(item)),
                datasets: [{
                    data: factionsData,
                    backgroundColor: factionColors,
                    barThickness: 24
                }],
                options: chartsSettings.faction({
                    max: factionsMax + 2,
                    type: filters.format
                }),
            });
        }
    }, [itemID, fetchData, filters]);

    useEffect(() => {
        if (weaponData && weaponData.total.loadouts > 0 > 0) {
            const diffsDataset = getDatasetByKey(itemID, weaponData, dataFilter, 'diffs');
            setDiffChart({
                labels: difficultiesNamesShort,
                datasets: diffsDataset
            });

            const missionsDataset = getDatasetByKey(itemID, weaponData, dataFilter, 'missions');
            setMissionChart({
                labels: missionTypes,
                datasets: missionsDataset
            });

            console.log(getCompanionChartData(weaponData))
            setCompanionCharts(getCompanionChartData(weaponData));

            const levelDataset = {
                labels: ['1-50', '50-100', '100+'],
                datasets: [{
                    data: Object.values(weaponData.levels).map(((item) => getPercentage(item, weaponData.total.loadouts))),
                    backgroundColor: getItemColor(itemID),
                    barThickness: 24
                }]
            }
            setLevelChart(levelDataset);
        }
    }, [weaponData]);

    const onFactionClick = (element) => {
        if (element) {
            setFilters({ ...filters, faction: factions[element.index] });
        }
    }

    return (
        <div className="content-wrapper">
            <div className="row">
                <div className="col-lg-6 col-md-12 col-sm-12">
                    <div className="weapon-title">
                        {itemID &&
                            <div className={`${weaponsDict[itemID].category === "Throwable" ?
                                'weapon-title-img-small' : 'weapon-title-img'}`}>
                                <img src={weaponsDict[itemID].image} alt=""></img>
                            </div>}

                        <div className="weapon-title-text">
                            {weaponsDict[itemID].nameFull}
                        </div>
                    </div>
                </div>
                <ItemFilters filters={filters} setFilters={setFilters} />
            </div>

            <div className="strategem-divider"></div>
            <Loader loading={!weaponData || !companionCharts}>
                {weaponData?.loadouts < 3 ?
                    <div className="empty-chart-text-wrapper">
                        <div className="empty-chart-text">
                            Insufficient Data
                        </div>
                    </div> :
                    <>
                        <div className="row">
                            <div className="col-lg-6 col-sm-12">
                                {weaponData &&
                                    <div className="row">
                                        <div className="col-12 col-lg-6 col-sm-6">
                                            <StratagemRank
                                                text={["pick ", "rate"]}
                                                value={getPercentage(weaponData?.total.loadouts, dataFilter?.total.loadouts)}
                                                onClick={() => setFilters({ ...filters, format: "pick_rate" })}
                                                color={getItemColor(itemID)}
                                                active={filters.format === "pick_rate"}
                                                percent />
                                            <StratagemRank
                                                text={["of", "games"]}
                                                value={getPercentage(weaponData?.total.games, dataFilter?.total.games)}
                                                onClick={() => setFilters({ ...filters, format: "game_rate" })}
                                                color={getItemColor(itemID)}
                                                active={filters.format === "game_rate"}
                                                percent />
                                        </div>
                                        <div className="col-12 col-lg-6 col-sm-6">
                                            <StratagemRank
                                                text={["in", weaponsDict[itemID].category]}
                                                value={getItemRank(itemID, getItemsByCategory(dataFilter.weapons, itemsDict[itemID].category))}
                                                onClick={() => setFilters({ ...filters, format: "rank_category" })}
                                                color={getItemColor(itemID)}
                                                active={filters.format === "rank_category"}
                                                suffix />
                                            <StratagemRank
                                                text={["times", "played"]}
                                                value={weaponData?.total.loadouts}
                                                onClick={() => { }}
                                                color={getItemColor(itemID)}
                                            />
                                        </div>
                                    </div>}
                            </div>
                            <div className="col-lg-3 col-sm-12">
                                {factionChart && (
                                    <div className="stratagem-graph-wrapper-faction">
                                        <BarChart
                                            data={factionChart}
                                            options={factionChart.options}
                                            onBarClick={onFactionClick}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="col-lg-3 col-sm-12">
                                <div className="empty-chart-text-wrapper">
                                    <div className="empty-chart-text">
                                        Data Pending
                                    </div>
                                </div>
                            </div>
                        </div>
                        {companionCharts && <>
                            <div className="stratagem-graphs-title">Companion Picks</div>
                            <div className="strategem-divider"></div>
                            <div className="row">
                                {itemCategories.map((category, index) => {
                                    return <div className="col-lg-3 col-md-3 col-sm-6 col-12">
                                        <div className="companion-chart-wrapper">
                                            <div className="stratagem-loadouts-title">{category}</div>
                                            <StrategemChart
                                                barData={companionCharts[index].data}
                                                filters={filters}
                                                options={companionCharts[index].options}                                                
                                                type={"strategem"}
                                                legendItems={[]}
                                                limit={null}
                                            />
                                        </div>
                                    </div>
                                })}
                            </div>
                        </>}
                        {diffChart && missionChart && <>
                            <div className="stratagem-graphs-title">Other</div>
                            <div className="strategem-divider"></div>
                            <div className="row">
                                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                                    <div className="stratagem-level-graph-wrapper">
                                        <div className="stratagem-other-title">Player Level</div>
                                        <BarChart
                                            data={levelChart}
                                            options={chartsSettings.level}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                                    <div className="stratagem-other-graph-wrapper">
                                        <div className="stratagem-other-title">Difficulty</div>
                                        <BarChart
                                            data={diffChart}
                                            options={chartsSettings.detailsBase}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                                    <div className="stratagem-mission-graph-wrapper">
                                        <div className="stratagem-other-title">Mission Type</div>
                                        <BarChart
                                            data={missionChart}
                                            options={chartsSettings.detailsBase}
                                        />
                                    </div>
                                </div>

                            </div>
                        </>}
                    </>}
            </Loader>
        </div>
    );
}

export default WeaponPage;
