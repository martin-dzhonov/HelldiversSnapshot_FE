import '../styles/App.css';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { itemCategories,weaponCategories, difficultiesNames, patchPeriods, factions } from '../constants';
import { capitalizeFirstLetter } from '../utils';

function Filters({ tab, filters, setFilters, type }) {
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

            {tab !== 2 &&
                <div className="filter-container">
                    {type === 0 && <DropdownButton
                        className="dropdown-button"
                        title={"Category: " + filters.category}>
                        {itemCategories.map((category, index) => (
                            <Dropdown.Item
                                as="button"
                                onClick={() => { setFilters({ ...filters, category: category }); }}>
                                {category}
                            </Dropdown.Item>
                        ))}
                    </DropdownButton>}
                    {type === 1 && <DropdownButton
                        className="dropdown-button"
                        title={"Category: " + filters.category}>
                        {weaponCategories.map((category, index) => (
                            <Dropdown.Item
                                as="button"
                                onClick={() => { setFilters({ ...filters, category: category }); }}>
                                {category}
                            </Dropdown.Item>
                        ))}
                    </DropdownButton>}
                    
                </div>}

            {tab === 1 &&
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
                    title={`${tab !== 1 ? 'Patch: ' : 'End: '}` + filters.patch.name}>
                    {patchPeriods.map((patchPeriod, index) => (
                        <Dropdown.Item
                            as="button"
                            disabled={tab === 1 && index >= filters.patchStart.id}
                            onClick={() => { setFilters({ ...filters, patch: patchPeriod }); }}>
                            {`${patchPeriod.name} : ${patchPeriod.start} - ${patchPeriod.end}`}
                        </Dropdown.Item>
                    ))}
                </DropdownButton>
            </div>

            {tab !== 1 &&
                <div className="filter-container">
                    <DropdownButton
                        className="dropdown-button"
                        disabled={tab === 2 || filters.mission !== 'All'}
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

            {tab !== 1 &&
                <div className="filter-container">
                    <DropdownButton
                        disabled={tab === 2 || filters.difficulty !== 0}
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
