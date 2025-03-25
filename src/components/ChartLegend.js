import '../styles/App.css';
import useMobile from '../hooks/useMobile';
import trendUpIcon from "../assets/icons/trendUp.svg";
import trendDownIcon from "../assets/icons/trendDown.svg";
import rankIcon from "../assets/icons/rank.svg";
import playedIcon from "../assets/icons/people.svg";
import levelIcon from "../assets/icons/level.svg";
import { patchPeriods } from '../constants';
import { useMemo } from 'react';

function ChartLegend({ patchId, showTrends = true, filterResults }) {
    const { isMobile } = useMobile();
    const patchName = useMemo(() => {
        const patch = patchPeriods.find((item) => item.id === patchId);
        return patch ? patch?.name : null;
    }, [patchId]);
    console.log(patchId);
    return (

        <div className='legend-wrapper'>
            <div className='legend-items-wrapper'>
                <div className='legend-item-wrapper'>
                    <img className='legend-icon' src={playedIcon} />
                    <div className='text-small'>Times played</div>
                </div>
                {patchId < 2 &&
                <div className='legend-item-wrapper'>
                    <img className='legend-icon' src={levelIcon} />
                    <div className='text-small'>Avg. Player Level</div>
                </div>
                }
                {patchName && showTrends &&
                    <div className='legend-item-wrapper'>
                        <div className='legend-patch-name-wrapper'>
                            <div className='text-small'>
                                <img className='legend-icon' src={rankIcon} />
                                &nbsp;
                                <img className='legend-icon' src={trendUpIcon} />
                                &nbsp; Rank / Pick Rate since</div>
                            <div className='text-small legend-patch-name'>"{patchName}"</div>
                        </div>
                    </div>
                }
            </div>

            {filterResults &&
                <div className='legend-filter-wrapper'>
                    <div className='filters-result-text'>
                        Matches: {filterResults.games}
                        &nbsp;&nbsp;&nbsp;
                        Loadouts: {filterResults.loadouts}
                    </div>
                </div>}
        </div>
    );
}

export default ChartLegend;
