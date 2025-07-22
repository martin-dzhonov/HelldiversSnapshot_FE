import StratagemRank from "./StratagemRank";
import { getItemColor } from "../utils";
import { strategemsDict } from "../constants";

function StratagemRanks({ strategemValues, id, filters, updateFilter }) {
    return (
        <div className="row">
            <div className="col-12 col-lg-6 col-sm-6">
                <StratagemRank
                    text={["pick ", "rate"]}
                    value={strategemValues.loadouts}
                    onClick={() => updateFilter("format", "pick_rate")}
                    color={getItemColor(id)}
                    active={filters.format === "pick_rate"}
                    percent
                />
                <StratagemRank
                    text={["of", "games"]}
                    value={strategemValues.games}
                    onClick={() => updateFilter("format", "game_rate")}
                    color={getItemColor(id)}
                    active={filters.format === "game_rate"}
                    percent
                />
            </div>
            <div className="col-12 col-lg-6 col-sm-6">
                <StratagemRank
                    text={["in", strategemsDict[id].category]}
                    value={strategemValues.rank_category}
                    onClick={() => updateFilter("format", "rank_category")}
                    color={getItemColor(id)}
                    active={filters.format === "rank_category"}
                    suffix
                />
                <StratagemRank
                    text={["in", "All Stratagem"]}
                    value={strategemValues.rank}
                    onClick={() => updateFilter("format", "rank_all")}
                    color={getItemColor(id)}
                    active={filters.format === "rank_all"}
                    suffix
                />
            </div>
        </div>
    );
}

export default StratagemRanks;