import '../../styles/App.css';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { itemCategories, weaponCategories, difficultiesNames, patchPeriods, factions } from '../../constants';
import { capitalizeFirstLetter } from '../../utils/utils';
import { useMobile } from '../../hooks/useMobile';


function Filters({ filters, setFilters }) {
    const { isMobile } = useMobile();

    return (
        <div className="filters-container">
            <div className="filter-container">
                <DropdownButton
                    className="dropdown-button"
                    title={`${isMobile ? '' : 'Faction: '}${capitalizeFirstLetter(filters.faction)}`}>
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
                {filters.page === "strategem" &&
                    <DropdownButton
                        className="dropdown-button"
                        title={`${isMobile ? '' : 'Patch: '}${filters.patch.name}`}>
                        {patchPeriods.map((patchPeriod, index) => (
                            <Dropdown.Item
                                as="button"
                                onClick={() => { setFilters({ ...filters, patch: patchPeriod }); }}>
                                {`${patchPeriod.name} : ${patchPeriod.start} - ${patchPeriod.end}`}
                            </Dropdown.Item>
                        )).reverse()}
                    </DropdownButton>}

                {filters.page === "weapons" &&
                    <DropdownButton
                        className="dropdown-button"
                        title={`${isMobile ? '' : 'Patch: '}${filters.patch.name}`}>
                        {patchPeriods.slice(3, patchPeriods.length).map((patchPeriod, index) => (
                            <Dropdown.Item
                                as="button"
                                onClick={() => { setFilters({ ...filters, patch: patchPeriod }); }}>
                                {`${patchPeriod.name} : ${patchPeriod.start} - ${patchPeriod.end}`}
                            </Dropdown.Item>
                        )).reverse()}
                    </DropdownButton>}

                {filters.page === "armor" &&
                    <DropdownButton
                        className="dropdown-button"
                        title={`${isMobile ? '' : 'Patch: '}${filters.patch.name}`}>
                        {patchPeriods.slice(5, patchPeriods.length).map((patchPeriod, index) => (
                            <Dropdown.Item
                                as="button"
                                onClick={() => { setFilters({ ...filters, patch: patchPeriod }); }}>
                                {`${patchPeriod.name} : ${patchPeriod.start} - ${patchPeriod.end}`}
                            </Dropdown.Item>
                        )).reverse()}
                    </DropdownButton>}

            </div>
            {filters.page !== 'armor' &&
                <div className="filter-container">
                    {filters.page === "strategem" &&
                        <DropdownButton
                            className="dropdown-button"
                            title={`${isMobile && filters.category !== 'All' ? '' : 'Category: '}${filters.category}`}>
                            {itemCategories.map((category, index) => (
                                <Dropdown.Item
                                    as="button"
                                    onClick={() => { setFilters({ ...filters, category: category }); }}>
                                    {category}
                                </Dropdown.Item>
                            ))}
                        </DropdownButton>}
                    {filters.page === "weapons" &&
                        <DropdownButton
                            className="dropdown-button"
                            title={`${isMobile ? '' : 'Category: '}${filters.category}`}>
                            {weaponCategories.map((category, index) => (
                                <Dropdown.Item
                                    as="button"
                                    onClick={() => { setFilters({ ...filters, category: category }); }}>
                                    {category}
                                </Dropdown.Item>
                            ))}
                        </DropdownButton>}
                </div>}

            <div className="filter-container">
                <DropdownButton
                    className="dropdown-button"
                    disabled={filters.mission !== 'All'}
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
                    disabled={filters.difficulty !== 0}
                    className="dropdown-button"
                    title={"Mission: " + filters.mission}>
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

export default Filters;
