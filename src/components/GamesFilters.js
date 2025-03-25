import '../styles/App.css';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { itemCategories, weaponCategories, difficultiesNames, patchPeriods, factions } from '../constants';
import { capitalizeFirstLetter } from '../utils';

function GamesFilters({ filters, setFilters }) {
    return (
        <div className="filters-container">
            <div className="filter-container">
                <DropdownButton
                    className="dropdown-button"
                    title={"Faction: " + capitalizeFirstLetter(filters.faction)}>
                    {factions.map((factionName) => (
                        <Dropdown.Item
                            as="button"
                            onClick={() => { setFilters({ ...filters, faction: factionName }); }}>
                            {capitalizeFirstLetter(factionName)}
                        </Dropdown.Item>
                    ))}
                </DropdownButton>
            </div>

            <div className="filter-container">
                <DropdownButton
                    className="dropdown-button"
                    title={'Patch: ' + filters.patch.name}>
                    {patchPeriods.map((patchPeriod, index) => (
                        <Dropdown.Item
                            as="button"
                            onClick={() => { setFilters({ ...filters, patch: patchPeriod }); }}>
                            {`${patchPeriod.name} : ${patchPeriod.start} - ${patchPeriod.end}`}
                        </Dropdown.Item>
                    ))}
                </DropdownButton>
            </div>
            <div className="filter-container">
                <DropdownButton
                    className="dropdown-button"
                    title={
                        filters.difficulty === 0
                            ? "Difficulty: All"
                            : "Difficulty: " + filters.difficulty
                    }>
                    {difficultiesNames.map((diffName, diffIndex) => (
                        <Dropdown.Item
                            as="button"
                            onClick={() => {
                                setFilters({
                                    ...filters,
                                    difficulty: diffName === "All" ? 0 : (6 + diffIndex)
                                });
                            }}>
                            {diffName}
                        </Dropdown.Item>
                    ))}
                </DropdownButton>
            </div>
            <div className="filter-container">
                <DropdownButton
                    className="dropdown-button"
                    title={"Mission Type: " + filters.mission}>
                    <Dropdown.Item
                        as="button"
                        onClick={() => { setFilters({ ...filters, mission: "All" }); }}>
                        All
                    </Dropdown.Item>
                    <Dropdown.Item
                        as="button"
                        onClick={() => { setFilters({ ...filters, mission: "Long" }); }}>
                        Long
                    </Dropdown.Item>
                    <Dropdown.Item
                        as="button"
                        onClick={() => { setFilters({ ...filters, mission: "Short" }); }}>
                        Short
                    </Dropdown.Item>
                </DropdownButton>
            </div>
        </div>
    );
}

export default GamesFilters;
