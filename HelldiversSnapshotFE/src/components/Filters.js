import '../styles/App.css';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { itemCategories, difficultiesNames, patchPeriods, factions } from '../constants';
import { capitalizeFirstLetter } from '../utils';

function Filters({ type, filters, setFilters }) {
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

            {type !== 2 &&
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
                </DropdownButton>}

            {type === 1 &&
                <DropdownButton
                    className="dropdown-button"
                    title={`Start: ` + filters.patchStart.id}>
                    {patchPeriods.slice(1, patchPeriods.length).map((patchPeriod, index) => (
                        <Dropdown.Item
                            as="button"
                            disabled={index === patchPeriods.findIndex(item => item.id === filters.patch.id) - 1}
                            onClick={() => { setFilters({ ...filters, patchStart: patchPeriod }); }}>
                            {`${patchPeriod.id} : ${patchPeriod.start} - ${patchPeriod.end}`}
                        </Dropdown.Item>
                    ))}
                </DropdownButton>
            }

            <DropdownButton
                className="dropdown-button"
                title={`${type !== 1 ? 'Patch: ' : 'End: '}` + filters.patch.id}>
                {patchPeriods.map((patchPeriod, index) => (
                    <Dropdown.Item
                        as="button"
                        disabled={type === 1 &&
                            index >= patchPeriods.findIndex(item => item.id === filters.patchStart.id)}
                        onClick={() => { setFilters({ ...filters, patch: patchPeriod }); }}>
                        {`${patchPeriod.id} : ${patchPeriod.start} - ${patchPeriod.end}`}
                    </Dropdown.Item>
                ))}
            </DropdownButton>

            {type !== 1 &&
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
                </DropdownButton>}

            {type !== 1 &&
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
                </DropdownButton>}

        </div>
    );
}

export default Filters;
