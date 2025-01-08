import "../styles/App.css";
import { useEffect, useState, useMemo } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { useParams, useNavigate } from "react-router-dom";
import * as settings from "../settings/chartSettings";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import StratagemRank from "../components/StratagemRank";
import useMobile from "../hooks/useMobile";
import BarGraph from "../components/BarGraph";
import Loader from "../components/Loader";
import {
    apiBaseUrl,
    patchPeriods,
    strategems,
    factions
} from "../constants";
import {
    getItemColor,
    getPercentage,
    capitalizeFirstLetter,
    getStrategemRank
} from "../utils";

function StratagemPage() {
    const navigate = useNavigate();
    const { isMobile } = useMobile();
    let { itemId } = useParams();
    let { factionId } = useParams();

    const [dataLoading, setDataLoading] = useState(true);
    const [fetchData, setFetchData] = useState();
    const [filters, setFilters] = useState({
        faction: factionId,
        patch: {...patchPeriods[0]}
    });

    const [diffGraph, setDiffGraph] = useState(null);
    const [missionGraph, setMissionGraph] = useState(null);
    const [factionGraph, setFactionGraph] = useState(null);
    const [patchGraph, setPatchGraph] = useState(null);

    useEffect(() => {
        setDataLoading(true);
        const fetchStratagem = fetch(apiBaseUrl + `/strategem`)
            .then((response) => response.json());

        fetchStratagem.then((res) => {
            setFetchData(res);
            setDataLoading(false);
        });
    }, []);

    const data = useMemo(() => {
        if (fetchData && filters) {
            const patchId = patchPeriods.findIndex(item => item.id === filters.patch.id);
            const filtered = fetchData[patchId][filters.faction];
            return filtered;
        }
    }, [fetchData, filters]);

    const strategemData = useMemo(() => {
        if (data) {
            return data.strategems[itemId];
        }
    }, [data, itemId]);

    useEffect(() => {
        if (fetchData) {
            const patchId = patchPeriods.findIndex(item => item.id === filters.patch.id);
            const filteredByPatch = fetchData[patchId];

            const factionsDataset = Object.entries(filteredByPatch)
                .map(([key, value]) => { return getPercentage(value.strategems[itemId].loadouts, filteredByPatch[key].totalLoadouts, 1) });

            setFactionGraph({
                labels: Object.keys(filteredByPatch),
                datasets: [
                    {
                        data: factionsDataset,
                        backgroundColor: ["rgb(255,182,0)", "#de7b6c", "rgb(107,58,186)"],
                        barThickness: 24
                    }
                ]
            });
        }
    }, [fetchData, filters]);

    useEffect(() => {
        if (fetchData && itemId && filters.faction) {

            const dataset = fetchData.map((patch) => {
                const stratagem = patch[filters.faction].strategems[itemId];
                return getPercentage(stratagem.loadouts, patch[filters.faction].totalLoadouts, 1);
            })

            setPatchGraph({
                labels: patchPeriods.map((item) => item.id),
                datasets: [
                    {
                        data: dataset,
                        backgroundColor: getItemColor(itemId),
                        barThickness: 24
                    }
                ]
            });
        }
    }, [fetchData, itemId, filters]);


    useEffect(() => {
        if (strategemData) {
            setDiffGraph({
                labels: !isMobile
                    ? ["7 - Suicide Mission", "8 - Impossible", "9 - Helldive", "10 - Super Helldive"]
                    : ["7", "8", "9", "10"],
                datasets: [
                    {
                        data: Object.values(strategemData.diffs).map((item) => getPercentage(item, strategemData.loadouts, 1)),
                        backgroundColor: getItemColor(itemId),
                        barThickness: 24
                    }
                ]
            });

            setMissionGraph({
                labels: ["Short", "Long"],
                datasets: [
                    {
                        data: Object.values(strategemData.missions).map((item) => getPercentage(item, strategemData.loadouts, 1)),
                        backgroundColor: getItemColor(itemId),
                        barThickness: 24
                    }
                ]
            });
        }
    }, [strategemData]);

    return (
        <div className="content-wrapper">
            <div className="item-details-title-wrapper">
                <div className="stratagem-details-title">
                    <div className="item-details-img-wrapper">
                        <img src={strategems[itemId].svg} alt=""></img>
                    </div>
                    <div className="item-details-title-text">
                        {strategems[itemId].nameFull}
                    </div>
                </div>
                <div className="stratagem-details-filters-container">
                    <div className="stratagem-details-filter-container">
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
                    <div className="stratagem-details-filter-container">
                        <DropdownButton
                            className="dropdown-button"
                            title={"Patch: " + filters.patch.id}>
                            {patchPeriods.map((patchPeriod, index) => (
                                <Dropdown.Item
                                    as="button"
                                    onClick={() => { setFilters({ ...filters, patch: patchPeriod }); }}>
                                    {`${patchPeriod.id} : ${patchPeriod.start} - ${patchPeriod.end}`}
                                </Dropdown.Item>
                            ))}
                        </DropdownButton>
                    </div>
                </div>
            </div>

            <div className="stratagem-divier"></div>
            {data && <Loader loading={dataLoading}>
                <div className="stratagem-section-container">
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
                            value={getPercentage(
                                strategemData?.games,
                                data?.totalGames,
                                1)}
                            color={"rgb(255,182,0)"}
                        />
                        <StratagemRank
                            text={["percent", "of loadouts"]}
                            value={getPercentage(
                                strategemData?.loadouts,
                                data?.totalLoadouts,
                                1)}
                            color={getItemColor(itemId)}
                        />
                    </div>
                    <div className="stratagem-trends-container">
                        <div className="stratagem-trends-wrapper">
                            {factionGraph && (
                                <div className="stratagem-graph-wrapper-small">
                                    <BarGraph
                                        data={factionGraph}
                                        options={{
                                            ...settings.stregemSmallOption
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="stratagem-trends-wrapper">
                            {patchGraph && (
                                <div className="stratagem-graph-wrapper-small">
                                    <BarGraph
                                        data={patchGraph}
                                        options={{
                                            ...settings.stregemSmallOption
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Loader>}
            <div className="stratagem-graphs-title">Companion Picks</div>
            <div className="stratagem-divier"></div>

            {(data && strategemData) && <div className="stratagem-loadouts-wrapper">
                {Object.entries(strategemData?.companions).map(([categoryName, category], categoryIndex) => (
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
                                            Paired in {getPercentage(item.value, strategemData.loadouts, 1)}% of games
                                        </Tooltip>
                                    )}
                                    placement="bottom">
                                    <img
                                        key={`${categoryIndex}-${itemIndex}`}
                                        className="armory-img-wrapper" alt=""
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

            <div className="stratagem-graphs-title">Charts</div>
            <div className="stratagem-divier"></div>

            <div className="stratagem-graphs-wrapper">
                <Loader loading={dataLoading}>
                    {diffGraph &&
                        <div className="stratagem-graph-wrapper">
                            <div className="stratagem-graph-title">Difficulty</div>
                            <BarGraph
                                data={diffGraph}
                                options={{
                                    ...settings.optionsStratagem,
                                    indexAxis: isMobile ? "y" : "x"
                                }}
                            />
                        </div>
                    }
                </Loader>
                <Loader loading={dataLoading}>
                    {missionGraph &&
                        <div className="stratagem-graph-wrapper">
                            <div className="stratagem-graph-title">
                                Mission Length
                            </div>
                            <BarGraph
                                data={missionGraph}
                                options={{
                                    ...settings.optionsStratagem,
                                    indexAxis: isMobile ? "y" : "x"
                                }}
                            />
                        </div>
                    }
                </Loader>
            </div>
            {/* <div className="stratagem-divier"></div>
            {dataLoading ? (
                <div className="spinner-faction-container">
                    <div className="lds-dual-ring"></div>
                </div>
            ) : (
                <div className="stratagem-section-container">
                    <div className="stratagem-rankings-container">
                        <StratagemRank
                            text={["in", "All Stratagem"]}
                            value={itemsRankings?.rankTotal}
                            color={"rgb(255,182,0)"}
                            suffix
                        />
                        <StratagemRank
                            text={["in", getItemCategory(itemId)]}
                            value={itemsRankings?.rankCategory}
                            color={getItemColor(itemId)}
                            suffix
                        />
                        <StratagemRank
                            text={["percent", "of matches"]}
                            value={getPercentage(
                                data?.stratagem?.length,
                                data?.faction?.length,
                                1
                            )}
                            color={"rgb(255,182,0)"}
                        />
                        <StratagemRank
                            text={["percent", "of loadouts"]}
                            value={itemsRankings?.percentageLoadouts}
                            color={getItemColor(itemId)}
                        />
                    </div>
                    <div className="stratagem-trends-container">
                        <div className="stratagem-trends-wrapper">
                            {graphData2 && (
                                <div className="stratagem-graph-wrapper-small">
                                    <BarGraph
                                        data={graphData2}
                                        options={{
                                            ...settings.stregemSmallOption
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="stratagem-trends-wrapper">
                            {graphData3 && (
                                <div className="stratagem-graph-wrapper-small">
                                    <BarGraph
                                        data={graphData3}
                                        options={{
                                            ...settings.stregemSmallOption
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            <div className="stratagem-graphs-title">Companion Picks</div>
            <div className="stratagem-divier"></div>
            {dataLoading && (
                <div className="spinner-faction-container">
                    <div className="lds-dual-ring"></div>
                </div>
            )}
            {data?.stratagem && !dataLoading && (
                <div className="stratagem-loadouts-wrapper">
                    {itemCategories.map((category) => (
                        <div className="stratagem-loadouts-section-wrapper">
                            <div className="stratagem-loadouts-title">
                                {category}
                            </div>
                            <div class="table-loadout-wrapper">
                                {Object.entries(
                                    getRankedDict(
                                        data?.stratagem,
                                        category,
                                        itemId
                                    )
                                )
                                    .slice(
                                        category === getItemCategory(itemId)
                                            ? 1
                                            : 0,
                                        category === getItemCategory(itemId)
                                            ? 5
                                            : 4
                                    )
                                    .map((item) => (
                                        <OverlayTrigger
                                            overlay={(props) => (
                                                <Tooltip {...props}>
                                                    In{" "}
                                                    {item[1].percentageLoadouts}
                                                    %
                                                    {item[1]
                                                        .percentageLoadouts ===
                                                        100
                                                        ? "(duh)"
                                                        : ""}{" "}
                                                    of stratagem loadouts
                                                </Tooltip>
                                            )}
                                            placement="bottom"
                                        >
                                            <img
                                                className="armory-img-wrapper"
                                                alt=""
                                                onClick={() =>
                                                    navigate(
                                                        `/armory/${factionName}/${item[0]}`
                                                    )
                                                }
                                                src={
                                                    baseIconsSvg[
                                                    baseLabels.indexOf(
                                                        item[0]
                                                    )
                                                    ]
                                                }
                                                width={40}
                                            />
                                        </OverlayTrigger>
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <div className="stratagem-graphs-title">Charts</div>
            <div className="stratagem-divier"></div>
            <div className="stratagem-graphs-wrapper">
                <Loader loading={dataLoading}>
                    {graphData &&
                        <div className="stratagem-graph-wrapper">
                            <div className="stratagem-graph-title">Difficulty</div>
                            <BarGraph
                                data={graphData}
                                options={{
                                    ...settings.optionsStratagem,
                                    indexAxis: isMobile ? "y" : "x"
                                }}
                            />
                        </div>
                    }
                </Loader>
                <Loader loading={dataLoading}>
                    {graphData1 &&
                        <div className="stratagem-graph-wrapper">
                            <div className="stratagem-graph-title">
                                Mission Length
                            </div>
                            <BarGraph
                                data={graphData1}
                                options={{
                                    ...settings.optionsStratagem,
                                    indexAxis: isMobile ? "y" : "x"
                                }}
                            />
                        </div>
                    }
                </Loader>
            </div>
            <div className="stratagem-graphs-wrapper">
                <Loader loading={dataLoading}>
                    {graphData1 &&
                        <div className="stratagem-graph-wrapper" style={{width: "86.5%"}}>
                            <div className="stratagem-graph-title">
                                Mission Modifiers
                            </div>
                            <BarGraph
                                data={graphData1}
                                options={{
                                    ...settings.optionsStratagem,
                                    indexAxis: isMobile ? "y" : "x"
                                }}
                            />
                        </div>
                    }
                </Loader>
            </div> */}
        </div>
    );
}

export default StratagemPage;
