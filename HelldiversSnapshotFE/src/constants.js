const svgModules = require.context('./assets/svgs', false, /\.svg$/);

const apiBaseUrl = "http://localhost:8080"//`https://utm7j5pjvi.us-east-1.awsapprunner.com`;//

const factions = ["terminid", "automaton", "illuminate"];

const factionColors = ["rgb(255,182,0)", "#d55642", "rgb(107,58,186)"]

const itemCategories = ["All", "Eagle/Orbital", "Support", "Defensive"];

const itemCategoryColors = ["#aaa", "#de7b6c", "#49adc9", "#679552"];

const missionTypes = ["Short", "Long"];

const navRoutes = [
    {
        name: "Meta Snapshot",
        route: "snapshot"
    },
    {
        name: "Stratagems",
        route: "armory"
    },
    {
        name: "The Project",
        route: "about"
    }
];

const patchPeriods = [
    { id: 0, name: "Omens of Tyranny", start: "12/12/2024", end: "Present" },
    { id: 1, name: "Escalation of Freedom", start: "08/06/2024", end: "12/12/2024" },
    { id: 2, name: "Classic", start: "04/01/2024", end: "08/06/2024" },
];

const difficultiesNames = [
    "All",
    "7 - Suicide Mission",
    "8 - Impossible",
    "9 - Helldive",
    "10 - Super Helldive"
];

const difficultiesNamesShort = [
    "Suicide Mission",
    "Impossible",
    "Helldive",
    "Super Helldive"
];

const missionNames = [
    [
        "LAUNCH ICBM",
        "ENABLE E-710 EXTRACTION",
        "RETRIEVE VALUABLE DATA",
        "SPREAD DEMOCRACY",
        "PURGE HATCHERIES",
        "NUKE NURSERY",
        "EMERGENCY EVACUATION",
        "CONDUCT GEOLOGICAL SURVEY",
        "DEPLOY DARK FLUID",
        "DESTROY COMMAND BUNKERS",
        "SABOTAGE AIR BASE",
        "FREE COLONY",
        "EVACUATE COLONISTS",
        "RETRIEVE RECON CRAFT INTEL",
        "NEUTRALIZE ORBITAL DEFENSES",
        "ENABLE OIL EXTRACTION"
    ],
    [
        "ERADICATE TERMINID SWARM",
        "ERADICATE AUTOMATON FORCES",
        "BLITZ: SEARCH AND DESTROY",
        "BLITZ: DESTROY ILLUMINATE WARP SHIPS",
        "EVACUATE HIGH-VALUE ASSETS",
        "DEFEND EVACUATION SITE",
        "RETRIEVE ESSENTIAL PERSONNEL"
    ],
];


const missionModifiers = [
    "Complex Strategem Plotting",
    "AA Defences",
    "Orbital Fluctuations",
    "Gunship Patrols",
    "Atmospheric Spores",
    "Roving Shriekers",
    "Atmospheric Interference"
];

const createStrategem = (baseName, fullName, category) => ({
    svg: svgModules(`./${baseName}.svg`),
    name: baseName,
    nameFull: fullName,
    category,
});

const strategems = {
    backpack_ballistic: createStrategem("Ballistic Shield Backpack", "SH-20 Ballistic Shield Backpack", "Support"),
    backpack_jump: createStrategem("Jump Pack", "LIFT-850 Jump Pack", "Support"),
    backpack_shield: createStrategem("Shield Generator Pack", "SH-20 Shield Generator Pack", "Support"),
    backpack_shield_directional: createStrategem("Directional Shield", "SH-51 Directional Shield", "Support"),
    backpack_supply: createStrategem("Supply Pack", "B-1 Supply Pack", "Support"),
    barrage_120: createStrategem("Orbital 120MM HE Barrage", "Orbital 120MM HE Barrage", "Eagle/Orbital"),
    barrage_380: createStrategem("Orbital 380MM HE Barrage", "Orbital 380MM HE Barrage", "Eagle/Orbital"),
    barrage_gatling: createStrategem("Orbital Gatling Barrage", "Orbital Gatling Barrage", "Eagle/Orbital"),
    barrage_napalm: createStrategem("Orbital Napalm Barrage", "Orbital Napalm Barrage", "Eagle/Orbital"),
    barrage_walking: createStrategem("Orbital Walking Barrage", "Orbital Walking Barrage", "Eagle/Orbital"),
    eagle_110mm: createStrategem("Eagle 110MM Rocket Pods", "Eagle 110MM Rocket Pods", "Eagle/Orbital"),
    eagle_500kg: createStrategem("Eagle 500KG Bomb", "Eagle 500KG Bomb", "Eagle/Orbital"),
    eagle_airstrike: createStrategem("Eagle Airstrike", "Eagle Airstrike", "Eagle/Orbital"),
    eagle_cluster: createStrategem("Eagle Cluster Bomb", "Eagle Cluster Bomb", "Eagle/Orbital"),
    eagle_napalm: createStrategem("Eagle Napalm Airstrike", "Eagle Napalm Airstrike", "Eagle/Orbital"),
    eagle_smoke: createStrategem("Eagle Smoke Strike", "Eagle Smoke Strike", "Eagle/Orbital"),
    eagle_strafe: createStrategem("Eagle Strafing Run", "Eagle Strafing Run", "Eagle/Orbital"),
    encampment_hmg: createStrategem("HMG Emplacement", "E/MG-101 HMG Emplacement", "Defensive"),
    encampment_at: createStrategem("Anti-Tank Emplacement", "E/AT-12 Anti-Tank Emplacement", "Defensive"),
    exo_emancipator: createStrategem("Emancipator Exosuit", "EXO-49 Emancipator Exosuit", "Support"),
    exo_patriot: createStrategem("Patriot Exosuit", "EXO-45 Patriot Exosuit", "Support"),
    frv: createStrategem("Fast Recon Vehicle", "M-102 Fast Recon Vehicle", "Support"),
    guard_breath: createStrategem("Guard Dog Breath", "AX/TX-13 Guard Dog Breath", "Support"),
    guard_dog: createStrategem("Guard Dog", "AD-334 Guard Dog", "Support"),
    guard_rover: createStrategem("Guard Dog Rover", "AX/LAS-5 Guard Dog Rover", "Support"),
    mines_at: createStrategem("Anti-Tank Mines", "MD-17 Anti-Tank Mines", "Defensive"),
    mines_incendiary: createStrategem("Incendiary Mines", "MD-I4 Incendiary Mines", "Defensive"),
    mines_infantry: createStrategem("Anti-Personnel Minefield", "MD-6 Anti-Personnel Minefield", "Defensive"),
    orbital_airburst: createStrategem("Orbital Airburst Strike", "Orbital Airburst Strike", "Eagle/Orbital"),
    orbital_ems: createStrategem("Orbital EMS Strike", "Orbital EMS Strike", "Eagle/Orbital"),
    orbital_gas: createStrategem("Orbital Gas Strike", "Orbital Gas Strike", "Eagle/Orbital"),
    orbital_laser: createStrategem("Orbital Laser", "Orbital Laser", "Eagle/Orbital"),
    orbital_precision: createStrategem("Orbital Precision Strike", "Orbital Precision Strike", "Eagle/Orbital"),
    orbital_railcannon: createStrategem("Orbital Railcannon Strike", "Orbital Railcannon Strike", "Eagle/Orbital"),
    orbital_smoke: createStrategem("Orbital Smoke Strike", "Orbital Smoke Strike", "Eagle/Orbital"),
    sentry_arc: createStrategem("Tesla Tower", "A/ARC-3 Tesla Tower", "Defensive"),
    sentry_autocannon: createStrategem("Autocannon Sentry", "A/AC-8 Autocannon Sentry", "Defensive"),
    sentry_ems: createStrategem("EMS Mortar Sentry", "A/M-23 EMS Mortar Sentry", "Defensive"),
    sentry_flame: createStrategem("Flame Sentry", "A/FLAM-40 Flame Sentry", "Defensive"),
    sentry_gatling: createStrategem("Gatling Sentry", "A/G-16 Gatling Sentry", "Defensive"),
    sentry_mg: createStrategem("Machine Gun Sentry", "A/MG-43 Machine Gun Sentry", "Defensive"),
    sentry_mortar: createStrategem("Mortar Sentry", "A/M-12 Mortar Sentry", "Defensive"),
    sentry_rocket: createStrategem("Rocket Sentry", "A/MLS-4X Rocket Sentry", "Defensive"),
    shield_relay: createStrategem("Shield Generator Relay", "FX-12 Shield Generator Relay", "Defensive"),
    sup_airburst_launcher: createStrategem("Airburst Rocket Launcher", "RL-77 Airburst Rocket Launcher", "Support"),
    sup_amr: createStrategem("Anti-Materiel Rifle", "APW-1 Anti-Materiel Rifle", "Support"),
    sup_arc_thrower: createStrategem("Arc Thrower", "ARC-3 Arc Thrower", "Support"),
    sup_autocannon: createStrategem("Autocannon", "AC-8 Autocannon", "Support"),
    sup_commando: createStrategem("Commando", "MLS-4X Commando", "Support"),
    sup_eat: createStrategem("Expendable Anti-Tank", "EAT-17 Expendable Anti-Tank", "Support"),
    sup_flamethrower: createStrategem("Flamethrower", "FLAM-40 Flamethrower", "Support"),
    sup_grenade_launcher: createStrategem("Grenade Launcher", "GL-21 Grenade Launcher", "Support"),
    sup_hmg: createStrategem("Heavy Machine Gun", "MG-206 Heavy Machine Gun", "Support"),
    sup_laser_cannon: createStrategem("Laser Cannon", "LAS-98 Laser Cannon", "Support"),
    sup_mg: createStrategem("Machine Gun", "MG-43 Machine Gun", "Support"),
    sup_quasar_cannon: createStrategem("Quasar Cannon", "LAS-99 Quasar Cannon", "Support"),
    sup_railgun: createStrategem("Railgun", "RS-422 Railgun", "Support"),
    sup_recoilless_rifle: createStrategem("Recoilless Rifle", "GR-8 Recoilless Rifle", "Support"),
    sup_spear: createStrategem("Spear", "FAF-14 Spear", "Support"),
    sup_stalwart: createStrategem("Stalwart", "M-105 Stalwart", "Support"),
    sup_sterilizer: createStrategem("Sterilizer", "TX-41 Sterilizer", "Support"),
    sup_wasp: createStrategem("Wasp", "StA-X3 W.A.S.P. Launcher", "Support"),
};

export {
    strategems,
    apiBaseUrl,
    navRoutes,
    missionNames,
    itemCategories,
    itemCategoryColors,
    difficultiesNames,
    difficultiesNamesShort,
    patchPeriods,
    factions,
    factionColors,
    missionTypes
};
