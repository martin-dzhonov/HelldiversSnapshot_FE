import '../App.css';
import './ArmoryPage.css';
import { baseLabels, baseIconsSvg, itemNames, itemCategories, itemCategoryIndexes } from '../constants';
import { useNavigate } from "react-router-dom";

function ArmoryPage() {
    const groupIndexes = itemCategoryIndexes.slice(1);
    const navigate = useNavigate();

    return (
        <div className="content-wrapper">
            <div className="groups-wrapper">
                {itemCategories.slice(1).map((groupName, groupIndex) => (
                    <div
                        className="groups-title-wrapper"
                        style={{
                            order: groupIndex === 1 ? "0" : groupIndex + 1,
                            width: groupIndex == 2 ? "60%" : "750px"
                        }}
                    >
                        <div className="groups-title-text-wrapper">
                            {groupName}
                        </div>
                        <div className="group-container">
                            {baseIconsSvg
                                .slice(
                                    groupIndexes[groupIndex][0],
                                    groupIndexes[groupIndex][1]
                                )
                                .map((icon, index) => (
                                    <div
                                        className="armory-item-wrapper"
                                        onClick={() =>
                                            navigate(
                                                `/armory/terminid/${
                                                    baseLabels.slice(
                                                        groupIndexes[
                                                            groupIndex
                                                        ][0],
                                                        groupIndexes[
                                                            groupIndex
                                                        ][1]
                                                    )[index] ===
                                                    "ballistic_shield"
                                                        ? ""
                                                        : baseLabels.slice(
                                                              groupIndexes[
                                                                  groupIndex
                                                              ][0],
                                                              groupIndexes[
                                                                  groupIndex
                                                              ][1]
                                                          )[index]
                                                }`
                                            )
                                        }
                                    >
                                        <div className="armory-img-wrapper">
                                            <img src={icon} />
                                        </div>
                                        <div className="armory-item-name">
                                            {
                                                itemNames.slice(
                                                    groupIndexes[groupIndex][0],
                                                    groupIndexes[groupIndex][1]
                                                )[index]
                                            }
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ArmoryPage;
