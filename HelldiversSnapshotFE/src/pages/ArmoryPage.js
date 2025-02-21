import '../styles/ArmoryPage.css';
import { itemCategories, weaponCategories, weaponsDict } from '../constants';
import { useNavigate } from "react-router-dom";
import { getItemsByCategory, getItemId } from '../utils';
import { useState } from 'react';

function ArmoryPage() {
    const categories = itemCategories.slice(1);
    const navigate = useNavigate();
    const [type, setType] = useState(0);

    return (
        <div className="content-wrapper">
            <div className='type-buttons-wrapper text-medium'>
                <div className={`${type === 0 ? 'snapshot-type-button-active' : 'snapshot-type-button'} text-medium`}
                    onClick={() => {
                        setType(0);
                    }}>
                    STRATEGEM
                </div>
                <div className={`${type === 1 ? 'snapshot-type-button-active' : 'snapshot-type-button'} text-medium`}
                    onClick={() => {
                        setType(1);
                    }}>
                    WEAPONS
                </div>
            </div>
            {type === 0 &&
                <div className="groups-wrapper" >
                    {categories.map((category) => (
                        <div className="groups-title-wrapper">
                            <div className="groups-title-text-wrapper">
                                {category}
                            </div>
                            <div className="group-container">
                                {getItemsByCategory(category).map((item) =>
                                    <div className="armory-item-wrapper"
                                        onClick={() => navigate(`/armory/terminid/${getItemId(item.name)}`)} >
                                        <div className="item-img-wrapper">
                                            <img src={item.image} alt="" />
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
                                {Object.values(weaponsDict).filter((item)=>item.category === category).map((item) =>
                                    <div className={`armory-weapons-wrapper armory-weapons-wrapper-${category}`}
                                        onClick={() => navigate(`/armory/terminid/${getItemId(item.name)}`)} >
                                        <div className="armory-weapons-img-wrapper">
                                            <img src={item.image} alt="" />
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
        </div>
    );
}

export default ArmoryPage;
