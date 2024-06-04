import './App.css';
import { baseLabels, baseIconsSvg } from './constants';

import ScreenshotToggle from './screenshotToggle';
import Table from 'react-bootstrap/Table';

function GamesTable({data}) {

    return (
        <Table striped bordered hover size="sm" variant="dark">
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Time</th>
                    <th>Loadouts</th>
                    <th>Difficulty</th>
                    <th>Mission</th>
                </tr>
            </thead>
            <tbody>
                {data && data.map((game, index) =>
                    <tr>
                        <td className='filter-results-text' >{index}</td>
                        <td className='filter-results-text' >{game.created}</td>
                        <td className='filter-results-text'>
                            <div class='table-loadout-row-wrapper'>
                                {game.players.map((loadout) =>
                                    <div class='table-loadout-wrapper'>
                                        {loadout.map((item) => {
                                            return baseLabels.indexOf(item) !== -1 ?
                                                <img className='armory-img-wrapper' src={baseIconsSvg[ baseLabels.indexOf(item)]} width={40}></img>
                                                : <div className='armory-img-wrapper'></div>;
                                        })}
                                    </div>)}
                            </div>
                            <td>
                                <ScreenshotToggle id={game.id} />
                            </td>
                        </td>
                        <td className='filter-results-text'>{game.difficulty}</td>
                        <td className='filter-results-text'>{game.type}</td>
                    </tr>
                )}
            </tbody>
        </Table>
    );
}

export default GamesTable;
