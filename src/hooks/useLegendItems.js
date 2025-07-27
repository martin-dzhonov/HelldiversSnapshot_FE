import { useState, useEffect } from "react";
import trendUpIcon from "../assets/icons/trendUp.svg";
import trendDownIcon from "../assets/icons/trendDown.svg";
import rankIcon from "../assets/icons/rank.svg";
import playedIcon from "../assets/icons/people.svg";
import levelIcon from "../assets/icons/level.svg";
import useMobile from "./useMobile";
import { getPatchId } from "../utils";

const useLegendItems = (setGraphData, filters) => {
    const { isMobile } = useMobile()
    const showPlayerLvl = filters.patch.id > getPatchId("Omens of Tyranny");

    const trendsStart = filters.page === 'armor' ? 'Masters Of Ceremony' :
        filters.page === 'weapons' ? "Servants of Freedom" :
            filters.faction === 'illuminate' ? "Omens of Tyranny" : "Classic";

    const showTrends = filters.patch.id > getPatchId(trendsStart);

    const getLegendItems = () => [
        !isMobile && { name: "Name", icon: null, check: true },
        showPlayerLvl && { name: "Avg. Level", icon: levelIcon, check: true },
        showTrends && { name: "Pick Rate Trend", icon: trendUpIcon, iconAlt: trendDownIcon, check: true },
        showTrends && { name: "Rank Trend", icon: rankIcon, check: false, category: filters.category },
        { name: "Times played", icon: playedIcon, check: false }
    ]
        .filter(Boolean) // Removes null or false
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
    }, [filters, isMobile]);

    const handleLegendCheck = (index) => {
        setLegendItems((prev) =>
            prev.map((item, i) => (i === index ? { ...item, check: !item.check } : item))
        );

        setGraphData((prev) => ({
            ...prev,
            data: { ...prev.data }
        }));
    };

    return { legendItems, handleLegendCheck };
};

export default useLegendItems;