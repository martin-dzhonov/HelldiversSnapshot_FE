import "../styles/App.css";
import "../styles/StrategemPage.css";
import { useEffect, useState, useMemo } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { useParams, useNavigate } from "react-router-dom";
import * as chartsSettings from "../settings/chartSettings";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import StratagemRank from "../components/StratagemRank";
import useMobile from "../hooks/useMobile";
import BarGraph from "../components/BarGraph";
import BarChart from '../components/BarChart';

import Loader from "../components/Loader";
import {
    apiBaseUrl,
    patchPeriods,
    strategems,
    missionTypes,
    factions,
    factionColors,
    difficultiesNames,
    itemCategories,
    difficultiesNamesShort
} from "../constants";
import {
    getItemColor,
    getPercentage,
    capitalizeFirstLetter,
    getStrategemRank,
    getChartGradient
} from "../utils";
import LineGraph from "../components/LineGraph";

function StratagemPage() {
    const navigate = useNavigate();
    const { isMobile } = useMobile();
    let { itemId } = useParams();
    let { factionId } = useParams();

    const [fetchData, setFetchData] = useState();
    const [diffGraph, setDiffGraph] = useState(null);
    const [missionGraph, setMissionGraph] = useState(null);
    const [factionGraph, setFactionGraph] = useState(null);
    const [patchGraph, setPatchGraph] = useState(null);
    const [showPatchGraph, setShowPatchGraph] = useState(false);
    const [companionGraphs, setCompanionGraphs] = useState(null);

    const [filters, setFilters] = useState({
        faction: factionId,
        patch: { ...patchPeriods[0] }
    });

    const data = useMemo(() => {
        if (fetchData && filters) {
            const patch = patchPeriods.findIndex(item => item.id === filters.patch.id);
            const filtered = fetchData[patch][filters.faction];
            return filtered;
        }
    }, [fetchData, filters]);

    const strategemData = useMemo(() => {
        if (data) {
            return data.strategems[itemId];
        }
    }, [data, itemId]);

    useEffect(() => {
        const fetchStratagem = fetch(apiBaseUrl + `/strategem`)
            .then((response) => response.json());

        fetchStratagem.then((res) => {
            setFetchData(res);
        });
    }, []);

    useEffect(() => {
        if (fetchData) {
            const patch = patchPeriods.findIndex(item => item.id === filters.patch.id);
            const patchData = fetchData[patch];

            const dataset = Object.entries(patchData).map(([key, value]) =>
                getPercentage(value.strategems[itemId].loadouts, patchData[key].totalLoadouts));

            let maxRounded = Math.round(Math.max(...dataset) / 10) * 10;

            setFactionGraph({
                labels: Object.keys(patchData).map((item) => capitalizeFirstLetter(item)),
                datasets: [
                    {
                        data: dataset,
                        backgroundColor: factionColors,
                        barThickness: 24
                    }
                ],
                chartsSettings: chartsSettings.getSettingsWithMax(chartsSettings.strategemFaction,
                    maxRounded > 10 ? maxRounded : 20
                )
            });
        }
    }, [fetchData, filters, itemId]);

    useEffect(() => {
        if (fetchData && itemId && filters.faction) {

            const dataset = fetchData.map((patch) => {
                const stratagem = patch[filters.faction].strategems[itemId];
                return getPercentage(stratagem.loadouts, patch[filters.faction].totalLoadouts);
            }).reverse();

            const itemColor = getItemColor(itemId);
            const patchesCount = dataset.filter(num => typeof num === 'number' && !isNaN(num)).length;

            setShowPatchGraph(patchesCount > 1);
            setPatchGraph({
                labels: patchPeriods.map((item) => item.id).reverse(),
                datasets: [
                    {
                        data: dataset,
                        fill: 'origin',
                        borderColor: itemColor,
                        pointRadius: 5,
                        pointBackgroundColor: getItemColor(itemId),
                        pointBorderColor: getItemColor(itemId),
                        backgroundColor: (context) => getChartGradient(context, itemColor),
                    }
                ],
                chartsSettings: chartsSettings.getSettingsWithMax(chartsSettings.strategemPatch,
                    Math.max(...dataset) + 4
                )
            });
        }
    }, [fetchData, itemId, filters]);


    useEffect(() => {
        if (strategemData) {

            setDiffGraph({
                labels: difficultiesNamesShort,
                datasets: [
                    {
                        data: Object.keys(strategemData.diffs).map(key =>
                            getPercentage(strategemData.diffs[key], data.diffs[key])),
                        backgroundColor: getItemColor(itemId),
                        barThickness: 24
                    }
                ]
            });

            setMissionGraph({
                labels: missionTypes,
                datasets: [
                    {
                        data: Object.keys(strategemData.missions).map(key =>
                            getPercentage(strategemData.missions[key], data.missions[key])),
                        backgroundColor: getItemColor(itemId),
                        barThickness: 24
                    }
                ]
            });

            const companionsArray = Object.keys(strategemData.companions).map(category => {
                return strategemData.companions[category].map(item => {
                    return {
                        ...item,
                        percentageLoadouts: getPercentage(item.total, strategemData.loadouts)
                    };
                }).reduce((acc, item) => {
                    const { name, ...rest } = item;
                    acc[name] = rest;
                    return acc;
                }, {});
            });

            setCompanionGraphs(companionsArray);
        }
    }, [strategemData]);

    return (
        <div className="content-wrapper">
            <div className="row">
                <div className="col-12">
                    <div className="strategem-title-wrapper">
                        <div className="stratagem-title">
                            <div className="stratagem-title-img">
                                <img src={strategems[itemId].svg} alt=""></img>
                            </div>
                            <div className="stratagem-title-text">
                                {strategems[itemId].nameFull}
                            </div>
                        </div>
                        <div className="stratagem-filters-container">
                            <div className="stratagem-filter-container">
                                <DropdownButton
                                    className="dropdown-button"
                                    title={"Faction: " + capitalizeFirstLetter(filters.faction)}>
                                    {factions.map((factionName) => (
                                        <Dropdown.Item
                                            as="button"
                                            onClick={() => { setFilters({ ...filters, faction: factionName.toLocaleLowerCase() }); }}>
                                            {factionName}
                                        </Dropdown.Item>
                                    ))}
                                </DropdownButton>
                            </div>
                            <div className="stratagem-filter-container">
                                <DropdownButton
                                    className="dropdown-button"
                                   
                                    title={"Patch: " + filters.patch.id}>
                                    {patchPeriods.map((patchPeriod, index) => (
                                        <Dropdown.Item
                                            as="button"
                                            disabled={filters.faction === 'illuminate' && index > 0}
                                            onClick={() => { setFilters({ ...filters, patch: patchPeriod }); }}>
                                            {`${patchPeriod.id} : ${patchPeriod.start} - ${patchPeriod.end}`}
                                        </Dropdown.Item>
                                    ))}
                                </DropdownButton>
                            </div>
                        </div>
                    </div>

                    <div className="strategem-divider"></div>
                    <Loader loading={!data}>
                        <div className="row">
                            <div className="col-6">
                                {data &&
                                    <div className="stratagem-rankings-container">
                                        <StratagemRank
                                            text={["in", "All Stratagem"]}
                                            value={getStrategemRank(data, itemId)}
                                            color={"rgb(255,182,0)"}
                                            suffix
                                        />
                                        <StratagemRank
                                            text={["in", strategems[itemId].category]}
                                            value={getStrategemRank(data, itemId, true)}
                                            color={getItemColor(itemId)}
                                            suffix
                                        />
                                        <StratagemRank
                                            text={["percent", "of matches"]}
                                            value={getPercentage(strategemData?.games, data?.totalGames)}
                                            color={"rgb(255,182,0)"}
                                        />
                                        <StratagemRank
                                            text={["percent", "of loadouts"]}
                                            value={getPercentage(strategemData?.loadouts, data?.totalLoadouts)}
                                            color={getItemColor(itemId)}
                                        />
                                    </div>}
                            </div>
                            <div className="col-3">
                                {factionGraph && (
                                    <div className="stratagem-graph-wrapper-small">
                                        <BarGraph
                                            data={factionGraph}
                                            options={factionGraph.chartsSettings}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="col-3">
                                {patchGraph && (
                                    <div className="stratagem-graph-wrapper-patch">
                                        {showPatchGraph ? <LineGraph
                                            data={patchGraph}
                                            options={patchGraph.chartsSettings}
                                        /> : <div>
                                            <div className="chart-empty-text">Data pending</div>
                                        </div>}

                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="stratagem-graphs-title">Companion Picks</div>
                        <div className="strategem-divider"></div>

                        <div className="row">
                            {companionGraphs && itemCategories.map((category, index) => {
                                return <div className="col-3">
                                    <div className="companion-chart-wrapper">
                                        <div className="stratagem-loadouts-title">{category}</div>
                                        <BarChart barData={companionGraphs[index]} filters={filters} options={chartsSettings.strategemCompanions} />
                                    </div>
                                </div>
                            })}
                        </div>

                        <div className="stratagem-graphs-title">Other</div>
                        <div className="strategem-divider"></div>

                        <div className="row">
                            <div className="col-3">
                                {diffGraph &&
                                    <div className="stratagem-other-graph-wrapper">
                                        <div className="stratagem-loadouts-title">Difficulty</div>
                                        <BarGraph
                                            data={diffGraph}
                                            options={chartsSettings.strategemLarge}
                                        />
                                    </div>}
                            </div>
                            <div className="col-3">
                                {missionGraph &&
                                    <div className="stratagem-mission-graph-wrapper">
                                        <div className="stratagem-loadouts-title">Mission Lenght</div>
                                        <BarGraph
                                            data={missionGraph}
                                            options={chartsSettings.strategemLarge}
                                        />
                                    </div>}
                            </div>
                        </div>
                    </Loader>
                </div>

                {/* <Loader loading={!data}>
                            {(data && strategemData) && <div className="stratagem-loadouts-wrapper">
                                {Object.entries(strategemData?.companions)
                                    .map(([categoryName, category], categoryIndex) => (
                                        <div className="stratagem-loadouts-section-wrapper" key={categoryName}>
                                            <div className="stratagem-loadouts-title">
                                                {categoryName}
                                            </div>
                                            <div className="table-loadout-wrapper">
                                                {category.map((item, itemIndex) => (
                                                    <OverlayTrigger
                                                        overlay={(props) => (
                                                            <Tooltip {...props}>
                                                                {strategems[item.name].name}
                                                                Paired in {getPercentage(item.value, strategemData.loadouts)}
                                                                % of games
                                                            </Tooltip>
                                                        )}
                                                        placement="bottom">
                                                        <img
                                                            key={`${categoryIndex}-${itemIndex}`}
                                                            className="item-img-wrapper" alt=""
                                                            onClick={() => navigate(`/armory/${filters.faction}/${item.name}`)}
                                                            src={strategems[item.name].svg}
                                                            width={40}
                                                        />
                                                    </OverlayTrigger>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                            }
                        </Loader> */}


            </div>
        </div>
    );
}

export default StratagemPage;
