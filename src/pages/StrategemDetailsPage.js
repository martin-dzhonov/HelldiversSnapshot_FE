import "../styles/App.css";
import "../styles/StrategemPage.css";
import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import useMobile from "../hooks/useMobile";
import BarChart from "../components/charts/BarChart";
import Loader from "../components/Loader";
import {
    patchPeriods,
    strategemsDict,
    factions,
} from "../constants";
import {
    getCompanionChartData,
    getItemMiscCharts,
    getTrendCharts
} from "../utils";
import ItemFilters from "../components/ItemFilters";
import PatchChart from "../components/charts/PatchChart";
import { useItemDetails } from "../hooks/useItemDetails";
import StratagemRanks from "../components/StratagemRanks";
import CompanionCharts from "../components/CompanionCharts";
import useItemFilter from "../hooks/useItemFilter";
import ItemMiscCharts from "../components/ItemMiscCharts";
import ItemErrorWrapper from "../components/ItemErrorWrapper";

const defaultFilters = {
    page: "strategem_details",
    type: "strategem",
    faction: "terminid",
    format: "pick_rate",
    patch: patchPeriods[patchPeriods.length - 1],
};

function StrategemDetailsPage() {
    let { id } = useParams();
    const { isMobile } = useMobile();

    const [filters, setFilters] = useItemFilter(defaultFilters);
    const { data, isLoading } = useItemDetails({ id, filters });

    const [charts, setCharts] = useState({
        faction: null,
        patch: null,
        companions: null,
        diff: null,
        mission: null,
        level: null,
    });

    const strategemData = useMemo(() => {
        if (!data) return null;
        return data[filters.faction] || null;
      }, [data, filters.faction]);    

    useEffect(() => {
        if (data) {
            const trendCharts = getTrendCharts(data, filters, id);
            console.log(trendCharts)
            setCharts((prev) => ({
                ...prev,
                ...trendCharts,
            }));
        }
    }, [data, filters]);

    useEffect(() => {
        if (strategemData?.total?.loadouts > 0) {
            const miscCharts = getItemMiscCharts(strategemData, id);
            const companions = getCompanionChartData(strategemData);

            setCharts((prev) => ({
                ...prev,
                ...miscCharts,
                companions,
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
                <ItemErrorWrapper showErr={strategemData?.total?.loadouts < 5}>
                    <div>
                        <div className="row">
                            {strategemData && (
                                <div className="col-lg-6 col-sm-12">
                                    <StratagemRanks
                                        strategemValues={strategemData}
                                        id={id}
                                        filters={filters}
                                        updateFilter={updateFilter}
                                    />
                                </div>
                            )}

                            {charts.faction && (
                                <div className="col-lg-3 col-sm-12">
                                    <div className="stratagem-graph-wrapper-faction">
                                        <BarChart
                                            data={charts.faction}
                                            options={charts.faction.options}
                                            onBarClick={element => {
                                                if (element) updateFilter("faction", factions[element.index]);
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

                            {charts.patch && (
                                <div className="col-lg-3 col-sm-12">
                                    <div className="stratagem-graph-wrapper-patch">
                                        <PatchChart
                                            data={charts.patch}
                                            itemID={id}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {charts.companions && (
                            <CompanionCharts charts={charts} filters={filters} />
                        )}

                        {charts.diff && charts.mission && (
                            <ItemMiscCharts charts={charts} filters={filters} />
                        )}
                    </div>
                </ItemErrorWrapper>
            </Loader>
        </div>
    );
}

export default StrategemDetailsPage;