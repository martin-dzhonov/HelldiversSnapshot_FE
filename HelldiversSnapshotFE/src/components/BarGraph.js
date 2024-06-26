import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { FaBars } from "react-icons/fa";
import hdlogo from '../assets/logos/hdlogo.svg';
import { navRoutes } from '../constants';
import useMobile from '../hooks/useMobile';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip as ChartTooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    ChartTooltip,
    Legend
);
const BarGraph = ({ data, options, chartRef, onBarClick, redraw = false,  }) => {
    return (
        <Bar
            ref={chartRef}
            data={data}
            options={options}
            redraw={redraw}
            onClick={onBarClick}
            width="100%"
            style={{ backgroundColor: '#181818'}}
        />

    )
};

export default BarGraph;