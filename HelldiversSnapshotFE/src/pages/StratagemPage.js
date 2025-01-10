import "../styles/App.css";
import "../styles/StrategemPage.css";
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
    missionTypes,
    factions,
    factionColors,
    difficultiesNames
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

    const [dataLoading, setDataLoading] = useState(true);
    const [fetchData, setFetchData] = useState();
    const [filters, setFilters] = useState({
        faction: factionId,
        patch: { ...patchPeriods[0] }
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
            const patchData = fetchData[patchId];

            const dataset = Object.entries(patchData)
                .map(([key, value]) => getPercentage(value.strategems[itemId].loadouts, patchData[key].totalLoadouts));

            setFactionGraph({
                labels: Object.keys(patchData),
                datasets: [
                    {
                        data: dataset,
                        backgroundColor: factionColors,
                        barThickness: 24
                    }
                ]
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

            setPatchGraph({
                labels: patchPeriods.map((item) => item.id).reverse(),
                datasets: [
                    {
                        data: dataset,
                        fill: 'origin',
                        borderColor: itemColor,
                        pointRadius: 4,
                        pointBackgroundColor: getItemColor(itemId),
                        pointBorderColor: getItemColor(itemId),
                        backgroundColor: (context) => getChartGradient(context, itemColor),
                    }
                ]
            });
        }
    }, [fetchData, itemId, filters]);


    useEffect(() => {
        if (strategemData) {

            const labels = !isMobile ?
                difficultiesNames.slice(1) :
                difficultiesNames.slice(1).map((item) => item.match(/\d+/g));

            setDiffGraph({
                labels: labels,
                datasets: [
                    {
                        data: Object.keys(data.diffs).map(key => getPercentage(strategemData.diffs[key], data.diffs[key])),
                        backgroundColor: getItemColor(itemId),
                        barThickness: 24
                    }
                ]
            });

            setMissionGraph({
                labels: missionTypes,
                datasets: [
                    {
                        data: Object.keys(data.missions).map(key => getPercentage(strategemData.missions[key], data.missions[key])),
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
            <Loader loading={!data}>
                <div className="stratagem-section-container">
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
                                value={getPercentage(
                                    strategemData?.games,
                                    data?.totalGames)}
                                color={"rgb(255,182,0)"}
                            />
                            <StratagemRank
                                text={["percent", "of loadouts"]}
                                value={getPercentage(
                                    strategemData?.loadouts,
                                    data?.totalLoadouts)}
                                color={getItemColor(itemId)}
                            />
                        </div>}
                    <div className="stratagem-trends-container">
                        <div className="stratagem-trends-wrapper">
                            {factionGraph && (
                                <div className="stratagem-graph-wrapper-small">
                                    <BarGraph
                                        data={factionGraph}
                                        options={{
                                            ...settings.strategemSmall
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="stratagem-trends-wrapper">
                            {patchGraph && (
                                <div className="stratagem-graph-wrapper-small">
                                    <LineGraph
                                        data={patchGraph}
                                        options={{
                                            ...settings.strategemPatch
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Loader>

            <div className="stratagem-graphs-title"></div>
            <div className="stratagem-divier"></div>
            <div className="stratagem-graphs-wrapper">
                <Loader loading={dataLoading}>
                    {diffGraph &&
                        <div className="stratagem-graph-wrapper">
                            <div className="stratagem-graph-title">Difficulty</div>
                            <BarGraph
                                data={diffGraph}
                                options={{
                                    ...settings.strategemLarge,
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
                                    ...settings.strategemLarge,
                                    indexAxis: isMobile ? "y" : "x"
                                }}
                            />
                        </div>
                    }
                </Loader>
            </div>

            <div className="stratagem-graphs-title">Companion Picks</div>
            <div className="stratagem-divier"></div>
            <Loader loading={!data}>
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
            </Loader>
        </div>
    );
}

export default StratagemPage;
