import BarChart from "./BarChart";
import * as chartsSettings from "../../settings/chartSettings";

function ItemMiscCharts({ charts, filters }) {
    if (!charts.diff || !charts.mission) return null;

    return (
        <div>
            <div className="strategem-graphs-title">Other</div>
            <div className="strategem-divider"></div>
            <div className="row">
             
                {filters.patch.id > 1 && charts.level && (
                    <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                        <div className="strategem-level-graph-wrapper">
                            <div className="strategem-other-title">Player Level</div>
                            <BarChart data={charts.level} autoHeight={true} options={chartsSettings.level} />
                        </div>
                    </div>
                )}
                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                    <div className="strategem-other-graph-wrapper">
                        <div className="strategem-other-title">Difficulty</div>
                        <BarChart data={charts.diff} autoHeight={true} options={chartsSettings.detailsBase} />
                    </div>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                    <div className="strategem-mission-graph-wrapper">
                        <div className="strategem-other-title">Mission Type</div>
                        <BarChart data={charts.mission} autoHeight={true} options={chartsSettings.detailsBase} />
                    </div>
                </div>

                {filters.patch.id > 9 && charts.modifiers && (
                    <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                        <div className="strategem-modifiers-graph-wrapper">
                            <div className="strategem-other-title">Modifiers</div>
                            <BarChart data={charts.modifiers} autoHeight={true} options={chartsSettings.modifiers} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ItemMiscCharts;
