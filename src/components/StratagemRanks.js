import StratagemRank from "./StratagemRank";
import { getItemColor } from "../utils";
import { itemsDict, patchPeriods, strategemsDict } from "../constants";

function StratagemRanks({ strategemValues, id, filters, updateFilter }) {
    const data = strategemValues.values[patchPeriods.length - 1 - filters.patch.id];;
    return (
        <div className="row">
            <div className="col-12 col-lg-6 col-sm-6">
                <StratagemRank
                    text={["pick ", "rate"]}
                    value={data.loadouts}
                    onClick={() => updateFilter("format", "pick_rate")}
                    color={getItemColor(id)}
                    active={filters.format === "pick_rate"}
                    percent
                />
                <StratagemRank
                    text={["of", "games"]}
                    value={data.games}
                    onClick={() => updateFilter("format", "game_rate")}
                    color={getItemColor(id)}
                    active={filters.format === "game_rate"}
                    percent
                />
            </div>
            <div className="col-12 col-lg-6 col-sm-6">
                <StratagemRank
                    text={["in", itemsDict[id].category]}
                    value={data.rank_category}
                    onClick={() => updateFilter("format", "rank_category")}
                    color={getItemColor(id)}
                    active={filters.format === "rank_category"}
                    suffix
                />
                {filters.page === 'strategem_details' &&
                    <StratagemRank
                        text={["in", "All Stratagem"]}
                        value={data.rank}
                        onClick={() => updateFilter("format", "rank_all")}
                        color={getItemColor(id)}
                        active={filters.format === "rank_all"}
                        suffix
                    />
                }
                {filters.page === 'weapon_details' &&
                    <StratagemRank
                        text={["times", "played"]}
                        value={data.loadouts_total}
                        onClick={() => { }}
                        color={getItemColor(id)}
                    />
                }
            </div>
        </div>
    );
}

export default StratagemRanks;