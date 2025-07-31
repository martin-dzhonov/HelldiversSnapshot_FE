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
                            <BarChart data={charts.level} options={chartsSettings.level} />
                        </div>
                    </div>
                )}
                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                    <div className="strategem-other-graph-wrapper">
                        <div className="strategem-other-title">Difficulty</div>
                        <BarChart data={charts.diff} options={chartsSettings.detailsBase} />
                    </div>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                    <div className="strategem-mission-graph-wrapper">
                        <div className="strategem-other-title">Mission Type</div>
                        <BarChart data={charts.mission} options={chartsSettings.detailsBase} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ItemMiscCharts;
