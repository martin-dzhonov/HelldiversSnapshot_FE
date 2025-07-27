import "../styles/App.css";
import "../styles/WeaponDetailsPage.css";

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
    weaponsDict,
} from "../constants";
import {
    getCompanionChartData,
    getItemMiscCharts,
    getTrendCharts
} from "../utils";
import ItemFilters from "../components/ItemFilters";
import PatchChart from "../components/charts/PatchChart";
import { useItemDetails } from "../hooks/useItemDetails";
import StrategemRanks from "../components/StrategemRanks";
import CompanionCharts from "../components/CompanionCharts";
import useItemFilter from "../hooks/useItemFilter";
import ItemMiscCharts from "../components/ItemMiscCharts";
import ItemErrorWrapper from "../components/ItemErrorWrapper";

const defaultFilters = {
    page: "weapon_details",
    type: "weapons",
    faction: "terminid",
    format: "pick_rate",
    patch: patchPeriods[patchPeriods.length - 1],
};

function WeaponDetailsPage() {
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

            setCharts((prev) => ({
                ...prev,
                ...trendCharts,
            }));
        }
    }, [data, filters]);

    useEffect(() => {
        if (strategemData?.total?.loadouts > 0) {
            const miscCharts = getItemMiscCharts(strategemData, id, isMobile);
            const companions = getCompanionChartData(strategemData);

            setCharts((prev) => ({
                ...prev,
                ...miscCharts,
                companions,
            }));
        }
    }, [strategemData, isMobile]);

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
                <div className="col-12 col-lg-6 col-md-12 col-sm-12">
                    <div className="weapon-title">
                        {id &&
                            <div className={`${weaponsDict[id].category === "Throwable" ?
                                'weapon-title-img-small' : 'weapon-title-img'}`}>
                                <img src={weaponsDict[id].image} alt=""></img>
                            </div>}

                        <div className="weapon-title-text">
                            {weaponsDict[id].nameFull}
                        </div>
                    </div>
                </div>
                {isMobile &&  <div className="strategem-divider"></div>}

                <ItemFilters filters={filters} setFilters={setFilters} />
            </div>

            <div className="strategem-divider"></div>

            <Loader loading={isLoading || !strategemData}>
                <ItemErrorWrapper showErr={strategemData?.total?.loadouts < 5}>
                    <div>
                        <div className="row">
                            {strategemData && (
                                <div className="col-lg-6 col-sm-12">
                                    <StrategemRanks
                                        strategemValues={strategemData}
                                        id={id}
                                        filters={filters}
                                        updateFilter={updateFilter}
                                    />
                                </div>
                            )}

                            {charts.faction && (
                                <div className="col-lg-3 col-sm-12">
                                    <div className="strategem-graph-wrapper-faction">
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
                                    <div className="strategem-graph-wrapper-patch">
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

export default WeaponDetailsPage;