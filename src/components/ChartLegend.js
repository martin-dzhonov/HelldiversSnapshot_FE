import '../styles/App.css';
import useMobile from '../hooks/useMobile';
import trendUpIcon from "../assets/icons/trendUp.svg";
import trendDownIcon from "../assets/icons/trendDown.svg";
import rankIcon from "../assets/icons/rank.svg";
import playedIcon from "../assets/icons/people.svg";
import levelIcon from "../assets/icons/level.svg";
import { patchPeriods } from '../constants';
import { useMemo, useState } from 'react';
import { Form } from "react-bootstrap";

function ChartLegend({ items, filterResults, onCheckChange }) {
    const { isMobile } = useMobile();
    return (

        <div className='legend-wrapper'>
            <div className='legend-items-wrapper'>
                {items.map((item, index) =>
                    <div className='legend-item-wrapper'>
                        <Form>
                            <Form.Check.Input
                                type="checkbox"
                                className="round-checkbox"
                                checked={item.check}
                                onChange={() => onCheckChange(index)}
                            />
                        </Form>
                        {item.icon && <img className='legend-icon' src={item.icon} />}
                        <div className='text-small'>{item.name}</div>
                    </div>
                )}
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
