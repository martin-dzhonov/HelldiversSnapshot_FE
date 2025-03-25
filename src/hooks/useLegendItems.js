import { useState, useEffect } from "react";
import trendUpIcon from "../assets/icons/trendUp.svg";
import trendDownIcon from "../assets/icons/trendDown.svg";
import rankIcon from "../assets/icons/rank.svg";
import playedIcon from "../assets/icons/people.svg";
import levelIcon from "../assets/icons/level.svg";

const useLegendItems = (setGraphData, filters) => {
    const showPlayerLvl = filters.patch.id < 1;
    const showTrends = filters.page === 'weapons' ? false : 
    filters.faction === 'illuminate' ? filters.patch.id < 1 : filters.patch.name !== 'Classic';

    const getLegendItems = () => [
        { name: "Name", icon: null, check: true },
        showPlayerLvl && { name: "Avg. Player Level", icon: levelIcon, check: true },
        showTrends && { name: "Pick Rate Trend", icon: trendUpIcon, iconAlt: trendDownIcon, check: true },
        showTrends && { name: "Rank Trend", icon: rankIcon, check: false },
        { name: "Times played", icon: playedIcon, check: false }
    ]
    .filter(Boolean) // Removes `null` or `false`
    .map((item) => {
        const img = new Image();
        img.src = item?.icon;
        const altImg = new Image();
        altImg.src = item?.iconAlt;
        return {
            ...item,
            src: item?.icon ? img : null,
            altSrc: item?.iconAlt ? altImg : null
        };
    });

    const [legendItems, setLegendItems] = useState(getLegendItems());

    useEffect(() => {
        setLegendItems(getLegendItems()); 
    }, [filters]);

    const handleLegendCheck = (index) => {
        setLegendItems((prev) =>
            prev.map((item, i) => (i === index ? { ...item, check: !item.check } : item))
        );
    
        setGraphData((prev) => ({
            ...prev, 
            data: {...prev.data} // Force a new reference
        }));
    };

    return { legendItems, handleLegendCheck };
};

export default useLegendItems;