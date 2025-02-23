import "../styles/App.css";
import "../styles/WeaponPage.css";
import "../styles/StrategemPage.css";

import { useEffect, useState, useMemo } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
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
    missionTypes,
    factions,
    factionColors,
    itemCategories,
    difficultiesNamesShort,
    weaponsDict,

} from "../constants";
import {
    getPercentage,
    capitalizeFirstLetter,
    getMaxRounded,
    getWeaponRank,
    getWeaponColor
} from "../utils";

function WeaponPage2() {
    let { itemID, factionID } = useParams();
    const { isMobile } = useMobile();

    const [fetchData, setFetchData] = useState();
    const [diffGraph, setDiffGraph] = useState(null);
    const [missionGraph, setMissionGraph] = useState(null);
    const [factionGraph, setFactionGraph] = useState(null);
    const [companionGraphs, setCompanionGraphs] = useState(null);

    const [filters, setFilters] = useState({
        faction: factionID,
        patch: { ...patchPeriods[0] }
    });

    const [show, setShow] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => setShow(true), 75);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const fetchStratagem = fetch(apiBaseUrl + `/strategem`)
            .then((response) => response.json());

        fetchStratagem.then((res) => {
            setFetchData(res);
        });
    }, []);

    const data = useMemo(() => {
        if (fetchData && filters) {
            const filtered = fetchData[filters.faction][filters.patch.id];
            return filtered;
        }
    }, [fetchData, filters]);

    const weaponData = useMemo(() => {
        if (data) {
            return data.weapons[itemID];
        }
    }, [data, itemID]);

    useEffect(() => {
        if (weaponData) {
            setDiffGraph({
                labels: difficultiesNamesShort,
                datasets: [
                    {
                        data: Object.keys(weaponData.diffs).map(key =>
                            getPercentage(weaponData.diffs[key], data.diffs[key])),
                        backgroundColor: getWeaponColor(itemID),
                        barThickness: 24
                    }
                ]
            });

            setMissionGraph({
                labels: missionTypes,
                datasets: [
                    {
                        data: Object.keys(weaponData.missions).map(key =>
                            getPercentage(weaponData.missions[key], data.missions[key])),
                        backgroundColor: getWeaponColor(itemID),
                        barThickness: 24
                    }
                ]
            });

            const companionsArray = Object.keys(weaponData.companions).map(category => {
                return weaponData.companions[category].map(item => {
                    return {
                        ...item,
                        value: getPercentage(item.total, weaponData.loadouts)
                    };
                }).reduce((acc, item) => {
                    const { name, ...rest } = item;
                    acc[name] = rest;
                    return acc;
                }, {});
            });

            setCompanionGraphs(companionsArray);
        }
    }, [weaponData]);

    useEffect(() => {
        if (fetchData) {
            const dataset = factions.map((factionName) => {
                const patchData = fetchData[factionName][filters.patch.id];
                return patchData?.weapons[itemID] ?
                    getPercentage(patchData.weapons[itemID].loadouts, patchData.totalLoadouts) : 0;
            })

            setFactionGraph({
                labels: factions.map((item) => capitalizeFirstLetter(item)),
                datasets: [
                    {
                        data: dataset,
                        backgroundColor: factionColors,
                        barThickness: 24
                    }
                ],
                chartsSettings: chartsSettings.getSettingsWithMax(
                    chartsSettings.strategemFaction,
                    getMaxRounded(dataset)
                )
            });
        }
    }, [fetchData, filters, itemID]);

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
                            <div className={`${weaponsDict[itemID].category === "Throwable" ? 'weapon-title-img-small' : 'weapon-title-img'}`}>
                                <img src={weaponsDict[itemID].image} alt=""></img>
                            </div>}

                        <div className="weapon-title-text">
                            {weaponsDict[itemID].nameFull}
                        </div>
                    </div>
                </div>
                <div className="d-flex flex-column col-lg-6 col-md-12 col-sm-12">
                    <div className="row mt-auto ">
                        <div className="col-6 col-lg-6 col-md-3 col-sm-6 ">
                            <div className="stratagem-filter-container">
                                <DropdownButton
                                    className="dropdown-button"
                                    title={"Faction: " + capitalizeFirstLetter(filters.faction)}>
                                    {factions.map((factionName) => (
                                        <Dropdown.Item
                                            as="button"
                                            onClick={() => { setFilters({ ...filters, faction: factionName }); }}>
                                            {capitalizeFirstLetter(factionName)}
                                        </Dropdown.Item>
                                    ))}
                                </DropdownButton>
                            </div>
                        </div>
                        <div className="col-6 col-lg-6 col-md-3 col-sm-6">
                            <div className="stratagem-filter-container">
                                <DropdownButton
                                    className="dropdown-button"
                                    title={`${!isMobile ? "Patch: " : ''} ${filters.patch.name}`} >
                                    {patchPeriods.map((patchPeriod, index) => (
                                        <Dropdown.Item
                                            as="button"
                                            disabled={index > 0}
                                            onClick={() => { setFilters({ ...filters, patch: patchPeriod }); }}>
                                            {`${patchPeriod.name} : ${patchPeriod.start} - ${patchPeriod.end}`}
                                        </Dropdown.Item>
                                    ))}
                                </DropdownButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="strategem-divider"></div>
            <Loader loading={!weaponData}>
                <div className="row">
                    <div className="col-lg-6 col-sm-12">
                        {weaponData &&
                            <div className="row">
                                <div className="row">

                                    <div className="col-12 col-lg-6 col-sm-12">
                                        <StratagemRank
                                            text={["pick ", "rate"]}
                                            value={getPercentage(weaponData?.loadouts, data?.totalLoadouts)}
                                            color={getWeaponColor(itemID)}
                                            percent />
                                    </div>
                                    <div className="col-12 col-lg-6 col-sm-12">
                                        <StratagemRank
                                            text={["in", weaponsDict[itemID].category]}
                                            value={getWeaponRank(data, itemID, true)}
                                            color={getWeaponColor(itemID)}
                                            suffix />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12 col-lg-6 col-sm-12">
                                        <StratagemRank
                                            text={["of", "games"]}
                                            value={getPercentage(weaponData?.games, data?.totalGames)}
                                            color={getWeaponColor(itemID)}
                                            percent />
                                    </div>
                                    <div className="col-12 col-lg-6 col-sm-12">
                                        <StratagemRank
                                            text={["times", "played"]}
                                            value={weaponData?.loadouts}
                                            color={getWeaponColor(itemID)}
                                             />
                                    </div>
                                </div>


                            </div>}
                    </div>
                    <div className="col-lg-3 col-sm-12">
                        {factionGraph && (
                            <div className="stratagem-graph-wrapper-faction">
                                <BarChart
                                    data={factionGraph}
                                    options={factionGraph.chartsSettings}
                                    onBarClick={onFactionClick}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="stratagem-graphs-title">Companion Picks</div>
                <div className="strategem-divider"></div>

                <div className="row">
                    {!companionGraphs &&
                        <div className="strategem-section-placeholder" />}
                    {companionGraphs && itemCategories.map((category, index) => {
                        return <div className="col-lg-3 col-md-3 col-sm-6 col-12">
                            <div className="companion-chart-wrapper">
                                <div className="stratagem-loadouts-title">{category}</div>
                                <StrategemChart
                                    barData={companionGraphs[index]}
                                    filters={filters}
                                    options={chartsSettings.strategemCompanions} />
                            </div>
                        </div>
                    })}
                </div>

                <div className="stratagem-graphs-title">Other</div>
                <div className="strategem-divider"></div>

                <div className="row">
                    <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                        {diffGraph &&
                            <div className="stratagem-other-graph-wrapper">
                                <div className="stratagem-other-title">Difficulty</div>
                                <BarChart
                                    data={diffGraph}
                                    options={chartsSettings.strategemOther}
                                />
                            </div>}
                    </div>
                    <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                        {missionGraph &&
                            <div className="stratagem-mission-graph-wrapper">
                                <div className="stratagem-other-title">Mission Length</div>
                                <BarChart
                                    data={missionGraph}
                                    options={chartsSettings.strategemOther}
                                />
                            </div>}
                    </div>
                </div>

                {/* <div className="stratagem-graphs-title">Companion Picks</div>
                <div className="strategem-divider"></div>

                <div className="row">
                    {!companionGraphs &&
                    <div className="strategem-section-placeholder"/>}
                    {companionGraphs && itemCategories.map((category, index) => {
                        return <div className="col-lg-3 col-md-3 col-sm-6 col-12">
                            <div className="companion-chart-wrapper">
                                <div className="stratagem-loadouts-title">{category}</div>
                                <StrategemChart
                                    barData={companionGraphs[index]}
                                    filters={filters}
                                    options={chartsSettings.strategemCompanions} />
                            </div>
                        </div>
                    })}
                </div>

                <div className="stratagem-graphs-title">Other</div>
                <div className="strategem-divider"></div>

                <div className="row">
                    <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                        {diffGraph &&
                            <div className="stratagem-other-graph-wrapper">
                                <div className="stratagem-other-title">Difficulty</div>
                                <BarChart
                                    data={diffGraph}
                                    options={chartsSettings.strategemOther}
                                />
                            </div>}
                    </div>
                    <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                        {missionGraph &&
                            <div className="stratagem-mission-graph-wrapper">
                                <div className="stratagem-other-title">Mission Length</div>
                                <BarChart
                                    data={missionGraph}
                                    options={chartsSettings.strategemOther}
                                />
                            </div>}
                    </div>
                </div> */}
            </Loader>
        </div>
    );
}

export default WeaponPage2;
