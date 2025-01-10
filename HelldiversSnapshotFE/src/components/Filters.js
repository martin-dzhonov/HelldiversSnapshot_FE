import '../styles/App.css';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { itemCategories, difficultiesNames, patchPeriods, factions } from '../constants';
import { capitalizeFirstLetter } from '../utils';

function Filters({ filters, setFilters }) {
    return (
        <div className="filters-container">
            <DropdownButton
                className="dropdown-button"
                title={"Faction: " + capitalizeFirstLetter(filters.faction)}>
                {factions.map((factionName) => (
                    <Dropdown.Item
                        as="button"
                        onClick={() => { setFilters({ ...filters, faction: factionName.toLocaleLowerCase() }); }}>
                        {factionName}
                    </Dropdown.Item>
                ))}
            </DropdownButton>

            <DropdownButton
                className="dropdown-button"
                title={"Stratagems: " + filters.type}>
                {itemCategories.map((category, index) => (
                    <Dropdown.Item
                        as="button"
                        onClick={() => { setFilters({ ...filters, type: category }); }}>
                        {category}
                    </Dropdown.Item>
                ))}
            </DropdownButton>

            <DropdownButton
                className="dropdown-button"
                title={"Patch: " + filters.patch.id}>
                {patchPeriods.map((patchPeriod, index) => (
                    <Dropdown.Item
                        as="button"
                        onClick={() => { setFilters({ ...filters, patch: patchPeriod }); }}>
                        {`${patchPeriod.id} : ${patchPeriod.start} - ${patchPeriod.end}`}
                    </Dropdown.Item>
                ))}
            </DropdownButton>

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
                    Long (40min)
                </Dropdown.Item>
                <Dropdown.Item
                    as="button"
                    onClick={() => { setFilters({ ...filters, mission: "Short" }); }}>
                    Short
                </Dropdown.Item>
            </DropdownButton>
        </div>
    );
}

export default Filters;
