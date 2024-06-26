import '../App.css';
import ScreenshotToggle from './ScreenshotToggle';
import Table from 'react-bootstrap/Table';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { apiBaseUrl, baseLabels, baseIconsSvg, itemNames, itemCategories, itemCategoryIndexes, difficultiesNames, patchPeriods } from '../constants';
import { getItemsByCategory, getItemName, getItemColor, getMissionsByLength, getRankedDict, isDateBetween, filterByPatch } from '../utils';

function Filters({ factionName, setFactionName, filters, setFilters }) {
    return (
        <div className='filters-container'>
            <DropdownButton
                className='dropdown-button'
                title={"Faction: " + factionName}>
                <Dropdown.Item as="button"
                    onClick={() => { setFactionName("Terminid") }}>
                    Terminid
                </Dropdown.Item>
                <Dropdown.Item as="button"
                    onClick={() => { setFactionName("Automaton") }}>
                    Automaton
                </Dropdown.Item>
            </DropdownButton>

            <DropdownButton
                className='dropdown-button'
                title={"Strategems: " + filters.type}>
                {itemCategories.map((category, index) =>
                    <Dropdown.Item as="button"
                        onClick={() => { setFilters({ ...filters, type: category }) }}>
                        {category}
                    </Dropdown.Item>
                )}
            </DropdownButton>

            <DropdownButton
                className='dropdown-button'
                title={"Patch: " + filters.period.id}>
                {patchPeriods.map((patchPeriod, index) =>
                    <Dropdown.Item as="button"
                        onClick={() => { setFilters({ ...filters, period: patchPeriod }) }}>
                        {`${patchPeriod.id === "All" ? "" : "Patch"} ${patchPeriod.id} : ${patchPeriod.start} - ${patchPeriod.end}`}
                    </Dropdown.Item>
                )}
            </DropdownButton>

            <DropdownButton
                className='dropdown-button'
                title={filters.difficulty === 0 ? "Difficulty: All" : "Difficulty: " + filters.difficulty}>
                {difficultiesNames.map((difficultyName) =>
                    <Dropdown.Item as="button"
                        onClick={() => { setFilters({ ...filters, difficulty: difficultyName === "All" ? 0 : Number(difficultyName[0]) }) }}>
                        {difficultyName}
                    </Dropdown.Item>
                )}
            </DropdownButton>

            <DropdownButton
                className='dropdown-button'
                title={"Mission Type: " + filters.missionType}>
                <Dropdown.Item as="button"
                    onClick={() => { setFilters({ ...filters, missionType: "All", }) }}>
                    All
                </Dropdown.Item>
                <Dropdown.Item as="button"
                    onClick={() => { setFilters({ ...filters, missionType: "Long", }) }}>
                    Long (40min)
                </Dropdown.Item>
                <Dropdown.Item as="button"
                    onClick={() => { setFilters({ ...filters, missionType: "Short", }) }}>
                    Short
                </Dropdown.Item>
            </DropdownButton>

        </div>
    );
}

export default Filters;
