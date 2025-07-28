import StrategemChart from "./charts/StrategemChart";
import { itemCategories } from "../constants";

function CompanionCharts({ charts, filters }) {
    const type = "strategem";
    return (
        <>
            <div className="strategem-graphs-title">Companion Picks</div>
            <div className="strategem-divider"></div>
            <div className="row">
                {itemCategories.map((category, index) => (  
                    <div className="col-lg-3 col-md-3 col-sm-6 col-12" key={index}>
                        <div className="companion-chart-wrapper">
                            <div className="strategem-loadouts-title">{category}</div>
                            <StrategemChart
                                barData={charts.companions[index].data}
                                filters={{...filters, page: type}}
                                options={charts.companions[index].options}
                                legendItems={[]}
                                limit={null}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default CompanionCharts;