import '../styles/ArmoryPage.css';
import { itemCategories } from '../constants';
import { useNavigate } from "react-router-dom";
import { getItemsByCategory, getItemId } from '../utils';

function ArmoryPage() {
    const categories = itemCategories.slice(1);
    const navigate = useNavigate();

    return (
        <div className="content-wrapper">
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
            </div>
        </div>
    );
}

export default ArmoryPage;
