import '../../styles/App.css';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { patchPeriods, factions } from '../../constants';
import { capitalizeFirstLetter } from '../../utils/utils';
import useMobile from '../../hooks/useMobile';

function ItemFilters({ filters, setFilters }) {
    const { isMobile } = useMobile();

    return (
        <div className="col-12 col-lg-6 col-md-12 col-sm-12 d-flex flex-column justify-content-end">
            <div className="row py-1">
                <div className="col-6 col-lg-6 col-md-6 col-sm-6 ">
                    <div className="strategem-filter-container">
                        <DropdownButton
                            className="dropdown-button"
                            title={`${isMobile ? '' : 'Faction: '}${capitalizeFirstLetter(filters.faction)}`}>
                            {factions.map((faction) => (
                                <Dropdown.Item
                                    as="button"
                                    onClick={() => {
                                        setFilters({
                                            ...filters,
                                            faction,
                                            ...(faction === 'illuminate' && filters.patch.id > 1 &&
                                                { patch: patchPeriods[patchPeriods.length - 1] }),
                                        });
                                    }}>
                                    {capitalizeFirstLetter(faction)}
                                </Dropdown.Item>
                            ))}
                        </DropdownButton>
                    </div>
                </div>
                <div className="col-6 col-lg-6 col-md-6 col-sm-6">
                    <div className="strategem-filter-container">
                        {filters.type === "weapons" ?
                            <DropdownButton
                                className="dropdown-button"
                                title={`${isMobile ? '' : 'Patch: '}${filters.patch.name}`}>
                                {patchPeriods.slice(3, patchPeriods.length).reverse().map((patchPeriod, index) => (
                                    <Dropdown.Item
                                        as="button"
                                        onClick={() => { setFilters({ ...filters, patch: patchPeriod }); }}>
                                        {`${patchPeriod.name} : ${patchPeriod.start} - ${patchPeriod.end}`}
                                    </Dropdown.Item>
                                ))}
                            </DropdownButton> :
                            <DropdownButton
                                className="dropdown-button"
                                title={`${!isMobile ? "Patch: " : ''} ${filters.patch.name}`} >
                                {patchPeriods.slice().reverse().map((patchPeriod, index) => (
                                    <Dropdown.Item
                                        as="button"
                                        disabled={(filters.faction === 'illuminate' && index > 4) || filters.type === "weapons"}
                                        onClick={() => { setFilters({ ...filters, patch: patchPeriod }); }}>
                                        {`${patchPeriod.name} : ${patchPeriod.start} - ${patchPeriod.end}`}
                                    </Dropdown.Item>
                                ))}
                            </DropdownButton>}

                    </div>
                </div>
            </div>
        </div>
    );
}

export default ItemFilters;
