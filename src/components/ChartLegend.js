import '../styles/App.css';
import '../styles/ChartLegend.css';
import { Form } from "react-bootstrap";

function ChartLegend({ items, filterResults, onCheckChange }) {
    return (
        <div className='legend-wrapper'>
            <div className='legend-items-wrapper'>
                {items.map((item, index) =>
                    <div className='legend-item-wrapper'>
                        <div className='legend-content'>
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
                    </div>
                )}
                {items.length < 4 &&
                    <div className='legend-item-wrapper'>
                    <div className='legend-content'>
                
                    <div className='text-small'></div>
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
