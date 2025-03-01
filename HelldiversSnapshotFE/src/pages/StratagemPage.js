import "../styles/App.css";
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
    missionTypes,
    factions,
    factionColors,
    itemCategories,
    difficultiesNamesShort,
} from "../constants";
import {
    getItemColor,
    getPercentage,
    capitalizeFirstLetter,
    getStrategemRank,
    getPatchItemCount,
    getCompanionChartData,
    getRankDatasetValue,
    getDatasetByKey,
    getMaxRounded,
    getRankMin
} from "../utils";
import ItemFilters from "../components/ItemFilters";
import PatchChart from "../components/charts/PatchChart";
import { dataDummy } from "../dataDummy";

function StratagemPage() {
    let { itemID, factionID } = useParams();
    const { isMobile } = useMobile();

    const [fetchData, setFetchData] = useState();
    const [factionChart, setFactionChart] = useState(null);
    const [patchChart, setPatchChart] = useState(null);
    const [companionCharts, setCompanionCharts] = useState(null);
    const [diffChart, setDiffChart] = useState(null);
    const [missionChart, setMissionChart] = useState(null);

    const [filters, setFilters] = useState({
        faction: factionID,
        format: 'pick_rate',
        patch: { ...patchPeriods[0] }
    });

    useEffect(() => {
        const fetchStratagem = fetch(apiBaseUrl + `/strategem`)
            .then((response) => response.json());
        fetchStratagem.then((res) => {
            setFetchData(res);
        });
    }, []);

    useEffect(() => {
        if (fetchData && itemID) {
            const rankMax = getPatchItemCount(itemID, filters);

            const factionsDataset = factions.map((factionName) => {
                const patchData = fetchData[factionName][filters.patch.id];
                return getRankDatasetValue(
                    itemID,
                    patchData,
                    rankMax,
                    filters.format,
                    'strategems');
            }); 
            setFactionChart({
                labels: factions.map((item) => capitalizeFirstLetter(item)),
                datasets: [{
                    data: factionsDataset,
                    backgroundColor: factionColors,
                    barThickness: 24
                }], 
                options: chartsSettings.factionChart({ 
                    percentMax: getMaxRounded(factionsDataset, 5), 
                    rankMax: rankMax ? rankMax + 2 : rankMax}),
            });

            const factionData = fetchData[filters.faction];
            const patchDataset = factionData.map((patchData) => {
                return getRankDatasetValue(
                    itemID,
                    patchData,
                    rankMax,
                    filters.format,
                    'strategems');
            });

            setPatchChart({
                data: patchDataset,
                options: chartsSettings.patchChart({ 
                    min: getRankMin(filters.format, getMaxRounded(patchDataset, 5)),
                    percentMax: getMaxRounded(patchDataset, 5), 
                    rankMax: rankMax ? rankMax + 2 : rankMax})
            });
        }
    }, [itemID, fetchData, filters]);

    const dataFilter = useMemo(() => {
        if (fetchData && filters) {
            const filtered = fetchData[filters.faction][filters.patch.id];
            return filtered;
        }
    }, [fetchData, filters]);

    const strategemData = useMemo(() => {
        if (dataFilter) {
            if (!dataFilter.strategems[itemID]) {
                return { loadouts: 0 }
            }
            return dataFilter.strategems[itemID];
        }
    }, [dataFilter, itemID]);

    useEffect(() => {
        if (strategemData && strategemData.total.loadouts > 0) {

            const diffsDataset = getDatasetByKey(itemID, strategemData, dataFilter, 'diffs');
            setDiffChart({
                labels: difficultiesNamesShort,
                datasets: diffsDataset
            });
            
            const missionsDataset = getDatasetByKey(itemID, strategemData, dataFilter, 'missions');
            setMissionChart({
                labels: missionTypes,
                datasets: missionsDataset
            });

            setCompanionCharts(getCompanionChartData(strategemData));
        }
    }, [strategemData]);

    const onFactionClick = (element) => {
        if (element) {
            setFilters({ ...filters, faction: factions[element.index] });
        }
    }

    return (
        <div className="content-wrapper">
            <div className="row">
                <div className="col-lg-6 col-md-12 col-sm-12">
                    <div className="stratagem-title">
                        <div className="stratagem-title-img">
                            <img src={strategemsDict[itemID].image} alt=""></img>
                        </div>
                        <div className="stratagem-title-text">
                            {strategemsDict[itemID].nameFull}
                        </div>
                    </div>
                </div>
                <ItemFilters filters={filters} setFilters={setFilters} />
            </div>

            <div className="strategem-divider"></div>
            <Loader loading={!strategemData || !companionCharts}>
                {strategemData?.loadouts < 3 ?
                    <div className="empty-chart-text-wrapper">
                        <div className="empty-chart-text">
                            Insufficient Data
                        </div>
                    </div> :
                    <>
                        <div className="row">
                            <div className="col-lg-6 col-sm-12">
                                {strategemData &&
                                    <div className="row">
                                        <div className="col-12 col-lg-6 col-sm-6">
                                            <StratagemRank
                                                text={["pick ", "rate"]}
                                                value={getPercentage(strategemData?.total.loadouts, dataFilter?.total.loadouts)}
                                                onClick={() => setFilters({ ...filters, format: "pick_rate" })}
                                                color={getItemColor(itemID)}
                                                active={filters.format === "pick_rate"}
                                                percent />
                                            <StratagemRank
                                                text={["of", "games"]}
                                                value={getPercentage(strategemData?.total.games, dataFilter?.total.games)}
                                                onClick={() => setFilters({ ...filters, format: "game_rate" })}
                                                color={getItemColor(itemID)}
                                                active={filters.format === "game_rate"}
                                                percent />
                                        </div>
                                        <div className="col-12 col-lg-6 col-sm-6">
                                            <StratagemRank
                                                text={["in", strategemsDict[itemID].category]}
                                                value={getStrategemRank(dataFilter, itemID, true)}
                                                onClick={() => setFilters({ ...filters, format: "rank_category" })}
                                                color={getItemColor(itemID)}
                                                active={filters.format === "rank_category"}
                                                suffix />
                                            <StratagemRank
                                                text={["in", "All Stratagem"]}
                                                value={getStrategemRank(dataFilter, itemID)}
                                                onClick={() => setFilters({ ...filters, format: "rank_all" })}
                                                color={getItemColor(itemID)}
                                                active={filters.format === "rank_all"}
                                                suffix />
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
                                {patchChart &&
                                    <div className="stratagem-graph-wrapper-patch">
                                        <PatchChart
                                            data={patchChart.data}
                                            itemID={itemID}
                                            options={patchChart.options}
                                        />
                                    </div>}
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
                                                barData={companionCharts[index]}
                                                filters={filters}
                                                options={chartsSettings.strategemCompanions}
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
                                    <div className="stratagem-other-graph-wrapper">
                                        <div className="stratagem-other-title">Difficulty</div>
                                        <BarChart
                                            data={diffChart}
                                            options={chartsSettings.strategemOther}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                                    <div className="stratagem-mission-graph-wrapper">
                                        <div className="stratagem-other-title">Mission Length</div>
                                        <BarChart
                                            data={missionChart}
                                            options={chartsSettings.strategemOther}
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

export default StratagemPage;
