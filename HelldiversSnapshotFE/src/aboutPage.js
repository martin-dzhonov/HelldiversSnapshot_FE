import './App.css';

import { useEffect, useRef, useState } from 'react'
import * as settings from "./settings/chartSettings";
import { baseLabels, baseIconsSvg, baseLabelsFull, missionNames, graphNames, itemTypesIndexes } from './baseAssets';
import { terminidData } from './data/terminid';

import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

import logoAutomaton from "./assets/logos/automatonlogo.png"
import logoTerminid from "./assets/logos/termlogo4.png"
import { useNavigate } from "react-router-dom";


import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import {
    Bar, getElementAtEvent,
} from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function AboutPage() {

    return (
        <div className='content-wrapper'>
            <div className='about-wrapper'>
                <div className='about-text-title'>Grettings Helldivers, and welcome to <span style={{ color: "#e74c3c" }}>Helldive.Live</span> !</div>
                <div className='about-text' style={{ paddingLeft: "20px", paddingTop: "0px" }}>This is a project aimed at bringing live, detailed player loadout data for difficulties 7-9, in the name of Managed Democracy and stuff</div>

                <div className='about-text' style={{ fontSize: "26px", paddingLeft: "20px" }}>How does it work ?</div>

                <div className='about-text'> &#8226; Match data is gathethed through an Autoscript running random quickmatches and screenshotting player loadouts.</div>

                <div className='about-text'>
                    &#8226; Player screenshots are passed to ORS scripts parsing player loadouts, difficulty, mission type from raw screenshot data.
                </div>
                <div className='about-text'>&#8226; The data is then visualized according to faction, strategem category, difficulty, mission types, etc
                </div>
                <div className='about-text' style={{ fontSize: "26px", paddingLeft: "20px" }}>Contact</div>
                <div className='about-text' style={{ paddingLeft: "20px", paddingTop: "10px" }}> For feedback, suggestions and anything else, go to:
                <a className='about-text' href='https://discord.gg/2ZJNZjNF'>
                https://discord.gg/2ZJNZjNF
                </a></div>
               
            </div>
        </div>
    );
}

export default AboutPage;
