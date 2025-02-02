import '../styles/App.css';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { itemCategories, difficultiesNames, patchPeriods, factions } from '../constants';
import { capitalizeFirstLetter } from '../utils';

function Filters({ type, filters, setFilters }) {
    return (
        <div className="filters-container">
            <div className="filter-container">
                <DropdownButton
                    className="dropdown-button"
                    title={"Faction: " + capitalizeFirstLetter(filters.faction)}>
                    {factions.map((factionName) => (
                        <Dropdown.Item
                            as="button"
                            disabled={type === 1 && factionName === 'illuminate'}
                            onClick={() => { setFilters({ ...filters, faction: factionName }); }}>
                            {capitalizeFirstLetter(factionName)}
                        </Dropdown.Item>
                    ))}
                </DropdownButton>
            </div>

            {type !== 2 &&
                <div className="filter-container">
                    <DropdownButton
                        className="dropdown-button"
                        title={"Stratagems: " + filters.category}>
                        {itemCategories.map((category, index) => (
                            <Dropdown.Item
                                as="button"
                                onClick={() => { setFilters({ ...filters, category: category }); }}>
                                {category}
                            </Dropdown.Item>
                        ))}
                    </DropdownButton>
                </div>}

            {type === 1 &&
                <div className="filter-container">
                    <DropdownButton
                        className="dropdown-button"
                        title={`Start: ` + filters.patchStart.name}>
                        {patchPeriods.slice(1, patchPeriods.length).map((patchPeriod, index) => (
                            <Dropdown.Item
                                as="button"
                                disabled={index + 1 === filters.patch.id}
                                onClick={() => { setFilters({ ...filters, patchStart: patchPeriod }); }}>
                                {`${patchPeriod.name} : ${patchPeriod.start} - ${patchPeriod.end}`}
                            </Dropdown.Item>
                        ))}
                    </DropdownButton>
                </div>}

            <div className="filter-container">
                <DropdownButton
                    className="dropdown-button"
                    title={`${type !== 1 ? 'Patch: ' : 'End: '}` + filters.patch.name}>
                    {patchPeriods.map((patchPeriod, index) => (
                        <Dropdown.Item
                            as="button"
                            disabled={filters.faction === 'illuminate' || (type === 1 && index >= filters.patchStart.id)}
                            onClick={() => { setFilters({ ...filters, patch: patchPeriod }); }}>
                            {`${patchPeriod.name} : ${patchPeriod.start} - ${patchPeriod.end}`}
                        </Dropdown.Item>
                    ))}
                </DropdownButton>
            </div>

            {type !== 1 &&
                <div className="filter-container">
                    <DropdownButton
                        className="dropdown-button"
                        disabled={type === 2}
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
                </div>}

            {type !== 1 &&
                <div className="filter-container">
                    <DropdownButton
                        disabled={type === 2}
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
                </div>}

        </div>
    );
}

export default Filters;
