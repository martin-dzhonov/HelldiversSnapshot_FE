import "../styles/App.css";
import { strategems } from "../constants";
import ScreenshotToggle from "./ScreenshotToggle";
import Table from "react-bootstrap/Table";

function GamesTable({ data }) {
    return (
        <Table striped bordered hover size="sm" variant="dark">
            <thead>
                <tr>
                    <th>id</th>
                    <th>Date</th>
                    <th>Loadouts</th>
                    <th>Planet</th>
                    <th>Mission</th>
                    <th>Modifiers</th>
                    <th>Diff</th>
                </tr>
            </thead>
            <tbody>
                {data && data.map((game, index) =>
                    <tr>
                        <td className='text-small'>{game.id}</td>
                        <td className='text-small' >{new Date(game.createdAt).toLocaleString()}</td>
                        <td className='text-small'>
                            <div class='table-loadout-row-wrapper'>
                                {game.players.map((loadout) =>
                                    <div class='table-loadout-wrapper'>
                                        {loadout.map((item) =>
                                            <img className='item-img-wrapper' src={strategems[item].svg} width={40} alt=""></img>)}
                                    </div>)}
                            </div>
                            <ScreenshotToggle id={game.id} alt="" />
                        </td>
                        <th>{game.planet}</th>
                        <td className='text-small'>{game.mission}</td>
                        <td className='text-small'>{game.modifiers}</td>
                        <td className='text-small'>{game.difficulty}</td>
                    </tr>
                )}
            </tbody>
        </Table>
    );
}

export default GamesTable;
