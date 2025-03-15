import '../styles/App.css';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { patchPeriods, factions } from '../constants';
import { capitalizeFirstLetter } from '../utils';
import useMobile from '../hooks/useMobile';

function ItemFilters({ filters, setFilters }) {
    const { isMobile } = useMobile();

    return (
        <div className="d-flex flex-column col-lg-6 col-md-12 col-sm-12">
            <div className="row mt-auto ">
                <div className="col-6 col-lg-6 col-md-3 col-sm-6 ">
                    <div className="stratagem-filter-container">
                        <DropdownButton
                            className="dropdown-button"
                            title={"Faction: " + capitalizeFirstLetter(filters.faction)}>
                            {factions.map((factionName) => (
                                <Dropdown.Item
                                    as="button"
                                    onClick={() => { setFilters({ 
                                        ...filters, 
                                        faction: factionName, 
                                        ...(factionName === 'illuminate' && filters.patch.id > 1 && { patch: patchPeriods[0] }), }); }}>
                                    {capitalizeFirstLetter(factionName)}
                                </Dropdown.Item>
                            ))}
                        </DropdownButton>
                    </div>
                </div>
                <div className="col-6 col-lg-6 col-md-3 col-sm-6">
                    <div className="stratagem-filter-container">
                        <DropdownButton
                            className="dropdown-button"
                            title={`${!isMobile ? "Patch: " : ''} ${filters.patch.name}`} >
                            {patchPeriods.map((patchPeriod, index) => (
                                <Dropdown.Item
                                    as="button"
                                    disabled={(filters.faction === 'illuminate' && index > 1) || filters.type === "weapons"}
                                    onClick={() => { setFilters({ ...filters, patch: patchPeriod }); }}>
                                    {`${patchPeriod.name} : ${patchPeriod.start} - ${patchPeriod.end}`}
                                </Dropdown.Item>
                            ))}
                        </DropdownButton>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ItemFilters;
