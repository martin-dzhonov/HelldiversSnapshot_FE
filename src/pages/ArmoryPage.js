import '../styles/ArmoryPage.css';
import { armorsDict, itemCategories, strategemsDict, weaponCategories, weaponsDict } from '../constants';
import { useNavigate } from "react-router-dom";
import { getItemId } from '../utils';
import { useEffect, useState } from 'react';

function ArmoryPage() {
    const categories = itemCategories.slice(1);
    const navigate = useNavigate();
    const [type, setType] = useState(0);
    const [show, setShow] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => setShow(true), 50);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="content-wrapper">
            <div className='type-buttons-wrapper text-medium'>
                <div
                    className={`${type === 0 ? 'snapshot-type-button-active' : 'snapshot-type-button'} text-medium`}
                    onClick={() => { setType(0); }}>
                    STRATEGEM
                </div>
                <div
                    className={`${type === 1 ? 'snapshot-type-button-active' : 'snapshot-type-button'} text-medium`}
                    onClick={() => { setType(1); }}>
                    WEAPONS
                </div>
                {/* <div
                    className={`${type === 2 ? 'snapshot-type-button-active' : 'snapshot-type-button'} text-medium`}
                    onClick={() => { setType(2); }}>
                    ARMORS
                </div> */}
            </div>
            {type === 0 &&
                <div className="groups-wrapper" >
                    {categories.map((category) => (
                        <div className="groups-title-wrapper">
                            <div className="groups-title-text-wrapper">
                                {category}
                            </div>
                            <div className="group-container">
                                {Object.values(strategemsDict)
                                    .filter((item) => item.category === category).map((item) =>
                                        <div
                                            className="armory-item-wrapper"
                                            onClick={() => navigate(`/strategem/${getItemId(item.name)}`)} >
                                            <div className="item-img-wrapper">
                                                <img src={item.image} alt="" loading="lazy" />
                                            </div>
                                            <div className="armory-item-name">
                                                {item.name}
                                            </div>
                                        </div>
                                    )}
                            </div>
                        </div>
                    ))}
                </div>}
            {type === 1 &&
                <div className="groups-wrapper" >
                    {weaponCategories.map((category) => (
                        <div className="groups-title-wrapper">
                            <div className="groups-title-text-wrapper">
                                {category}
                            </div>
                            <div className="weapons-group-container">
                                {Object.values(weaponsDict)
                                    .filter((item) => item.category === category).map((item) =>
                                        <div
                                            className={`armory-weapons-wrapper armory-weapons-wrapper-${category}`}
                                            onClick={() => navigate(`/weapons/${getItemId(item.name)}`)} >
                                            <div className="armory-weapons-img-wrapper">
                                                <img src={item.image} alt="" loading="lazy" />
                                            </div>
                                            <div className="armory-item-name">
                                                {item.name}
                                            </div>
                                        </div>
                                    )}
                            </div>
                        </div>
                    ))}
                </div>}
                {type === 2 &&
                <div className="groups-wrapper" >
                    <div className="weapons-group-container">
                                {Object.values(armorsDict).map((item) =>
                                        <div
                                            className={`armory-armor-wrapper`}
                                            onClick={() => navigate(`/weapons/${getItemId(item.name)}/terminid`)} >
                                            <div className="armory-weapons-img-wrapper">
                                                <img src={item.image} alt="" loading="lazy" />
                                            </div>
                                            <div className="armory-item-name">
                                                {item.name}
                                            </div>
                                        </div>
                                    )}
                            </div>
                </div>}

        </div>
    );
}

export default ArmoryPage;
