import './App.css';
import { baseLabels, baseIconsSvg, baseLabelsFull, graphNames, itemTypesIndexes, baseLabelsFull2 } from './baseAssets';
import { useNavigate } from "react-router-dom";

function ArmoryPage() {

    const groupNames = [graphNames[1], graphNames[2], graphNames[3]];
    const groupIndexes = [itemTypesIndexes[1], itemTypesIndexes[2], itemTypesIndexes[3]];
    const navigate = useNavigate();

    return (
        <div className='content-wrapper'>
            <div className='groups-wrapper'>
                {groupNames.map((groupName, groupIndex) =>
                    <div className='groups-title-wrapper' style={{ order: groupIndex === 1 ? "0" : groupIndex + 1, width: groupIndex == 2 ? '60%' : '750px' }}>
                        <div className='groups-title-text-wrapper'>{groupName}</div>
                        <div className='group-container' >
                            {baseIconsSvg.slice(groupIndexes[groupIndex][0], groupIndexes[groupIndex][1]).map((icon, index) =>
                                <div className='armory-item-wrapper'
                                    onClick={()=> navigate(`/armory/${baseLabels.slice(groupIndexes[groupIndex][0], groupIndexes[groupIndex][1])[index]}`)}>
                                    <div className='armory-img-wrapper'>
                                        <img src={icon} />
                                    </div>
                                    <div className='armory-item-name'>
                                        {baseLabelsFull.slice(groupIndexes[groupIndex][0], groupIndexes[groupIndex][1])[index]}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ArmoryPage;
