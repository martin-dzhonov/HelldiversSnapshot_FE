import '../styles/GalleryPage.css';
import {
    itemCategories,
    strategemsDict,
    weaponCategories,
    weaponsDict
} from '../constants';
import { useNavigate } from 'react-router-dom';
import { getItemId } from '../utils/utils';
import { useState } from 'react';

function ItemGroup({ title, items, itemClassName, imgWrapperClass, onClick }) {
    return (
        <div className="groups-title-wrapper">
            <div className="groups-title-text-wrapper">{title}</div>
            <div className={itemClassName.includes("armor") ? "weapons-group-container" : "group-container"}>
                {items.map((item) => (
                    <div key={item.name} className={itemClassName} onClick={() => onClick(item)}>
                        <div className={imgWrapperClass}>
                            <img src={item.image} alt="" loading="lazy" />
                        </div>
                        <div className="armory-item-name">{item.name}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function GalleryPage() {
    const navigate = useNavigate();
    const [type, setType] = useState(0);
    const strategemCategories = itemCategories.slice(1);
    const galleryCategories = ["STRATEGEM", "WEAPONS"]

    return (
        <div className="content-wrapper">
            <div className="type-buttons-wrapper text-medium">
                {galleryCategories.map((label, index) => (
                    <div
                        key={label}
                        className={`${type === index ? 'snapshot-type-button-active' : 'snapshot-type-button'} text-medium`}
                        onClick={() => setType(index)}>
                        {label}
                    </div>
                ))}
            </div>

            {type === 0 && (
                <div className="groups-wrapper">
                    {strategemCategories.map((category) => {
                        const filtered = Object.values(strategemsDict).filter((item) => item.category === category);
                        return (
                            <ItemGroup
                                key={category}
                                title={category}
                                items={filtered}
                                itemClassName="armory-item-wrapper"
                                imgWrapperClass="item-img-wrapper"
                                onClick={(item) => navigate(`/strategem/${getItemId(item.name)}`)}
                            />
                        );
                    })}
                </div>
            )}

            {type === 1 && (
                <div className="groups-wrapper">
                    {weaponCategories.map((category) => {
                        const filtered = Object.values(weaponsDict).filter((item) => item.category === category);
                        return (
                            <ItemGroup
                                key={category}
                                title={category}
                                items={filtered}
                                itemClassName={`armory-weapons-wrapper armory-weapons-wrapper-${category}`}
                                imgWrapperClass="armory-weapons-img-wrapper"
                                onClick={(item) => navigate(`/weapons/${getItemId(item.name)}`)}
                            />
                        );
                    })}
                </div>
            )}

        </div>
    );
}

export default GalleryPage;

// {type === 2 && (
//     <div className="groups-wrapper">
//         <ItemGroup
//             title="Armor"
//             items={Object.values(armorsDict)}
//             itemClassName="armory-armor-wrapper"
//             imgWrapperClass="armory-weapons-img-wrapper"
//             onClick={(item) => navigate(`/weapons/${getItemId(item.name)}/terminid`)}
//         />
//     </div>
// )}