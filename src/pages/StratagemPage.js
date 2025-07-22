import "../styles/App.css";
import "../styles/StrategemPage.css";
import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import * as chartsSettings from "../settings/chartSettings";
import useMobile from "../hooks/useMobile";
import BarChart from "../components/charts/BarChart";
import Loader from "../components/Loader";
import {
    patchPeriods,
    strategemsDict,
    missionTypes,
    factions,
    factionColors,
    difficultiesNamesShort,
} from "../constants";
import {
    getItemColor,
    getPercentage,
    capitalizeFirstLetter,
    getCompanionChartData,
    getDatasetValue,
    getPatchesValues,
    getRankMax,
    getChartDataset
} from "../utils";
import ItemFilters from "../components/ItemFilters";
import PatchChart from "../components/charts/PatchChart";
import { useItemDetails } from "../hooks/useItemDetails";
import useFilter from "../hooks/useFilter";
import StratagemRanks from "../components/StratagemRanks";
import CompanionCharts from "../components/CompanionCharts";
import useItemFilter from "../hooks/useItemFilter";

const defaultFilters = {
    page: "strategem_details",
    type: "strategem",
    faction: "terminid",
    format: "pick_rate",
    patch: patchPeriods[patchPeriods.length - 1],
};

function StratagemPage() {
    let { id } = useParams();
    const { isMobile } = useMobile();

    const [filters, setFilters] = useItemFilter(defaultFilters);
    const { data, isLoading } = useItemDetails({ id, filters });

    const [charts, setCharts] = useState({
        faction: null,
        patch: null,
        companion: null,
        diff: null,
        mission: null,
        level: null,
    });

    const strategemData = useMemo(() => {
        if (data) {
            return data[filters.faction];
        }
    }, [data, filters.faction]);

    const strategemValues = useMemo(() => {
        if (strategemData) {
            return strategemData.values[patchPeriods.length - 1 - filters.patch.id];
        }
    }, [strategemData, filters.patch]);

    useEffect(() => {
        if (data) {
            const ranks = strategemData.ranks.strategem;

            const factionsDataset = factions.map((faction) =>
                getDatasetValue(data[faction], filters, ranks, id)
            );

            const factionChart = {
                labels: factions.map((item) => capitalizeFirstLetter(item)),
                datasets: getChartDataset({ data: factionsDataset, color: factionColors }),
                options: chartsSettings.faction({
                    min: 0,
                    max: getRankMax(factionsDataset, filters, ranks, id),
                    type: filters.format,
                }),
            };

            const patchesValues = data[filters.faction].values;
            const patchesDataset = patchesValues.map((item) =>
                getPatchesValues(item, filters, ranks, id)
            ).reverse();

            const patchChart = {
                data: patchesDataset,
                options: chartsSettings.patch({
                    min: -2,
                    max: getRankMax(patchesDataset, filters, ranks, id),
                    type: filters.format,
                }),
            };
            console.log(patchesDataset)
            setCharts((prev) => ({
                ...prev,
                faction: factionChart,
                patch: patchChart,
            }));
        }
    }, [data, filters]);

    useEffect(() => {
        if (strategemData?.total?.loadouts > 0) {
            const diffChart = {
                labels: difficultiesNamesShort,
                datasets: getChartDataset({
                    data: Object.values(strategemData.diffs).map((item) => item.value),
                    color: getItemColor(id),
                }),
            };

            const missionChart = {
                labels: missionTypes,
                datasets: getChartDataset({
                    data: Object.values(strategemData.missions).map((item) => item.value),
                    color: getItemColor(id),
                }),
            };

            const companion = getCompanionChartData(strategemData);

            let levelChart = null;
            if (strategemData.levels) {
                levelChart = {
                    labels: Object.keys(strategemData.levels),
                    datasets: getChartDataset({
                        data: Object.values(strategemData.levels).map((item) =>
                            getPercentage(item, strategemData.total.loadouts)
                        ),
                        color: getItemColor(id),
                    }),
                };
            }

            setCharts((prev) => ({
                ...prev,
                diff: diffChart,
                mission: missionChart,
                companion: companion,
                level: levelChart,
            }));
        }
    }, [strategemData]);

    const updateFilter = (key, value) => {
        if (key === "patch") {
          const patchObj = patchPeriods[value];
          if (patchObj) setFilters({ patch: patchObj });
        } else {
          setFilters({ [key]: value });
        }
      };

    return (
        <div className="content-wrapper">
            <div className="row">
                <div className="col-lg-6 col-md-12 col-sm-12">
                    <div className="stratagem-title">
                        <div className="stratagem-title-img">
                            <img src={strategemsDict[id].image} alt="" />
                        </div>
                        <div className="stratagem-title-text">{strategemsDict[id].nameFull}</div>
                    </div>
                </div>
                <ItemFilters filters={filters} setFilters={setFilters} />
            </div>

            <div className="strategem-divider"></div>

            <Loader loading={isLoading || !strategemData}>
                {strategemData?.total?.loadouts < 5 ? (
                    <div className="empty-chart-text-wrapper">
                        <div className="empty-chart-text">Insufficient Data</div>
                    </div>
                ) : (
                    <div>
                        <div className="row">
                            <div className="col-lg-6 col-sm-12">
                                {strategemData && (
                                    <StratagemRanks
                                        strategemValues={strategemValues}
                                        id={id}
                                        filters={filters}
                                        updateFilter={updateFilter}
                                    />
                                )}
                            </div>

                            <div className="col-lg-3 col-sm-12">
                                {charts.faction && (
                                    <div className="stratagem-graph-wrapper-faction">
                                        <BarChart
                                            data={charts.faction}
                                            options={charts.faction.options}
                                            onBarClick={element => {
                                                if (element) updateFilter("faction", factions[element.index]);
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="col-lg-3 col-sm-12">
                                {charts.patch && (
                                    <div className="stratagem-graph-wrapper-patch">
                                        <PatchChart
                                            data={charts.patch.data}
                                            itemID={id}
                                            options={charts.patch.options}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {charts.companion && <CompanionCharts charts={charts} filters={filters} />}

                        {charts.diff && charts.mission && (
                            <div>
                                <div className="stratagem-graphs-title">Other</div>
                                <div className="strategem-divider"></div>
                                <div className="row">
                                    {filters.patch.id > 1 && charts.level && (
                                        <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                                            <div className="stratagem-level-graph-wrapper">
                                                <div className="stratagem-other-title">Player Level</div>
                                                <BarChart data={charts.level} options={chartsSettings.level} />
                                            </div>
                                        </div>
                                    )}
                                    <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                                        <div className="stratagem-other-graph-wrapper">
                                            <div className="stratagem-other-title">Difficulty</div>
                                            <BarChart data={charts.diff} options={chartsSettings.detailsBase} />
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                                        <div className="stratagem-mission-graph-wrapper">
                                            <div className="stratagem-other-title">Mission Type</div>
                                            <BarChart data={charts.mission} options={chartsSettings.detailsBase} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Loader>
        </div>
    );
}

export default StratagemPage;