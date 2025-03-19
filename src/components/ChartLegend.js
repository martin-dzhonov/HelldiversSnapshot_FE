import '../styles/App.css';
import useMobile from '../hooks/useMobile';
import trendUpIcon from "../assets/icons/trendUp.svg";
import trendDownIcon from "../assets/icons/trendDown.svg";
import rankIcon from "../assets/icons/rank.svg";
import playedIcon from "../assets/icons/people.svg";
import { patchPeriods } from '../constants';
import { useMemo } from 'react';

function ChartLegend({ patchId }) {
    const { isMobile } = useMobile();
    const patchName = useMemo(() => {
        const patch = patchPeriods.find((item) => item.id === patchId);
        return patch ? patch?.name : null;
    }, [patchId]);

    return (
        <div className='legend-wrapper'>
            <div className='legend-item-wrapper'>
                <img cl src={playedIcon} />
                <div className='text-small'>Times played</div>
            </div>
            {patchName && <div className='legend-item-wrapper'>
                <img src={rankIcon} />
                <img src={trendUpIcon} />
                <div className='text-small'>Rank / Pick Rate since</div>
                <div className='text-small legend-patch-name'>"{patchName}"</div>
            </div>}

            <div>
            </div>
        </div>
    );
}

export default ChartLegend;
