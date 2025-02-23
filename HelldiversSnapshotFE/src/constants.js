
const isDev = false; 

const apiBaseUrl = 'http://localhost:8080'//`https://utm7j5pjvi.us-east-1.awsapprunner.com`

const factions = ["terminid", "automaton", "illuminate"];

const factionColors = ["rgb(255,182,0)", "#d55642", "rgb(107,58,186)"]

const itemCategories = ["All", "Eagle/Orbital", "Support", "Defensive"];

const itemCategoryColors = ["#aaa", "#de7b6c", "#49adc9", "#679552"];

const weaponCategories = ["Primary", "Secondary", "Throwable"];

const weaponCategoryColors = ["#49adc9", "#679552", "#de7b6c"];

const strategemCount = [
    
    {"Eagle/Orbital": 19, "Support": 30, "Defensive": 14},
    {"Eagle/Orbital": 19, "Support": 29, "Defensive": 14},
    {"Eagle/Orbital": 19, "Support": 26, "Defensive": 12},
    {"Eagle/Orbital": 18, "Support": 24, "Defensive": 11}
]

const missionTypes = ["Short", "Long"];

const navRoutes = [
    {
        name: "Strategem",
        route: "strategem"
    },
    {
        name: "Weapons",
        route: "weapons"
    },
    {
        name: "Armory",
        route: "armory"
    },
    {
        name: "The Project",
        route: "about"
    }
];

const patchPeriods = [
    { id: 0, name: "Servants of Freedom", start: "02/08/2025", end: "Present" },
    { id: 1, name: "Omens of Tyranny", start: "12/12/2024", end: "02/08/2025" },
    { id: 2, name: "Escalation of Freedom", start: "08/06/2024", end: "12/12/2024" },
    { id: 3, name: "Classic", start: "04/01/2024", end: "08/06/2024" },
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
        "ENABLE OIL EXTRACTION",
        "COLLECT METEOROLOGICAL DATA",
        "COLLECT GLOOM SPORE READINGS",
        "EXTRACT RESEARCH PROBE DATA",
        "COLLECT GLOOM-INFUSED OIL",
        "CHART TERMINID TUNNELS"
    ],
    [
        "ERADICATE TERMINID SWARM",
        "ERADICATE AUTOMATON FORCES",
        "BLITZ: SEARCH AND DESTROY",
        "BLITZ: DESTROY ILLUMINATE WARP SHIPS",
        "EVACUATE HIGH-VALUE ASSETS",
        "DEFEND EVACUATION SITE",
        "RETRIEVE ESSENTIAL PERSONNEL",
        "BLITZ: SECURE RESEARCH SITE"
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

const imageModules = require.context('./assets/svgs', false, /\.(svg|png|webp)$/);

const createStrategem = (baseName, fullName, category, ext = "svg") => ({
    image: imageModules(`./${baseName}.${ext}`),
    name: baseName,
    nameFull: fullName,
    category,
});

const strategemsDict = {
    backpack_ballistic: createStrategem("Ballistic Shield Backpack", "SH-20 Ballistic Shield Backpack", "Support"),
    backpack_jump: createStrategem("Jump Pack", "LIFT-850 Jump Pack", "Support"),
    backpack_shield: createStrategem("Shield Generator Pack", "SH-20 Shield Generator Pack", "Support"),
    backpack_shield_directional: createStrategem("Directional Shield", "SH-51 Directional Shield", "Support"),
    backpack_supply: createStrategem("Supply Pack", "B-1 Supply Pack", "Support"),
    backpack_hellbomb: createStrategem("Portable Hellbomb", "B-100 Portable Hellbomb", "Support"),
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

const weaponsDict = {
    liberator: createStrategem("Liberator", "AR-23 Liberator", "Primary", 'webp'),
    liberator_pen: createStrategem("Liberator Penetrator", "AR-23P Liberator Penetrator", "Primary", 'webp'),
    liberator_conc: createStrategem("Liberator Concussive", "AR-23C Liberator Concussive", "Primary", 'webp'),
    liberator_car: createStrategem("Liberator Carabine", "AR-23A Liberator Carabine", "Primary", 'webp'),
    sta_52: createStrategem("StA-52", "StA-52 Assault Rifle", "Primary", 'webp'),
    tenderizer: createStrategem("Tenderizer", "AR-61 Tenderizer", "Primary", 'webp'),
    adjucator: createStrategem("Adjucator", "BR-14 Adjucator", "Primary", 'webp'),
    constitution: createStrategem("Constitution", "R-2124 Constitution", "Primary", 'webp'),
    diligence: createStrategem("Diligence", "R-63 Diligence", "Primary", 'webp'),
    diligence_cs: createStrategem("Diligence Counter Sniper", "R-63CS Diligence Counter Sniper", "Primary", 'webp'),
    accelerator: createStrategem("Accelerator Rifle", "PLAS-39 Accelerator Rifle", "Primary", 'webp'),
    knight: createStrategem("Knight", "MP-98 Knight", "Primary", 'webp'),
    sta_11: createStrategem("StA-11", "StA-11 SMG", "Primary", 'webp'),
    reprimand: createStrategem("Reprimand", "SMG-32 Reprimand", "Primary", 'webp'),
    defender: createStrategem("Defender", "SMG-37 Defender", "Primary", 'webp'),
    pummeler: createStrategem("Pummeler", "SMG-72 Pummeler", "Primary", 'webp'),
    punisher: createStrategem("Punisher", "MP-98 Punisher", "Primary", 'webp'),
    slugger: createStrategem("Slugger", "SG-8S Slugger", "Primary", 'webp'),
    halt: createStrategem("Halt", "SG-20 Halt", "Primary", 'webp'),
    cookout: createStrategem("Cookout", "SG-451 Cookout", "Primary", 'webp'),
    breaker: createStrategem("Breaker", "SG-225 Breaker", "Primary", 'webp'),
    spray_n_pray: createStrategem("Breaker Spray&Pray", "SG-225SP Breaker Spray & Pray", "Primary", 'webp'),
    breaker_inc: createStrategem("Breaker Incendiary", "SG-225IE Breaker Incendiary", "Primary", 'webp'),
    crossbow: createStrategem("Exploding Crossbow", "CB-9 Exploding Crossbow", "Primary", 'webp'),
    eruptor: createStrategem("Eruptor", "R-36 Eruptor", "Primary", 'webp'),
    punisher_plas: createStrategem("Punisher Plasma", "SG-8P Punisher Plasma", "Primary", 'webp'),
    blitzer: createStrategem("Blitzer", "ARC-12 Blitzer", "Primary", 'webp'),
    scythe: createStrategem("Scythe", "LAS-5 Scythe", "Primary", 'webp'),
    sickle: createStrategem("Sickle", "LAS-16 Sickle", "Primary", 'webp'),
    sickle_d: createStrategem("Double Edge Sickle", "LAS-17 Double-Edge Sickle", "Primary", 'webp'),
    scorcher: createStrategem("Scorcher", "PLAS-1 Scorcher", "Primary", 'webp'),
    purifier: createStrategem("Purifier", "PLAS-101 Purifier", "Primary", 'webp'),
    torcher: createStrategem("Torcher", "FLAM-66 Torcher", "Primary", 'webp'),
    dominator: createStrategem("Dominator", "JAR-5 Dominator", "Primary", 'webp'),
    peacemaker: createStrategem("Peacemaker", "P-2 Peacemaker", "Secondary", 'webp'),
    redeemer: createStrategem("Redeemer", "P-19 Redeemer", "Secondary", 'webp'),
    verdict: createStrategem("Verdict", "P-113 Verdict", "Secondary", 'webp'),
    senator: createStrategem("Senator", "P-4 Senator", "Secondary", 'webp'),
    shock_lance: createStrategem("Stun Lance", "CQC-19 Stun Lance", "Secondary", 'webp'),
    shock_batton: createStrategem("Stun Batton", "CQC-30 Stun Baton", "Secondary", 'webp'),
    axe: createStrategem("Combat Hatchet", "CQC-5 Combat Hatchet", "Secondary", 'webp'),
    stim_pistol: createStrategem("Stim Pistol", "P-11 Stim Pistol", "Secondary", 'webp'),
    bushwacker: createStrategem("Bushwacker", "SG-22 Bushwhacker", "Secondary", 'webp'),
    crisper: createStrategem("Crisper", "P-72 Crisper", "Secondary", 'webp'),
    grenade_pistol: createStrategem("Grenade Pistol", "GP-31 Grenade Pistol", "Secondary", 'webp'),
    laser_pistol: createStrategem("Dagger", "LAS-7 Dagger", "Secondary", 'webp'),
    ultimatum: createStrategem("Ultimatum", "GP-31 Ultimatum", "Secondary", 'webp'),
    loyalist: createStrategem("Loyalist", "PLAS-15 Loyalist", "Secondary", 'webp'),
    grenade_frag: createStrategem("Frag", "G-6 Frag", "Throwable", 'webp'),
    grenade_he: createStrategem("High Explosive", "G-12 High Explosive", "Throwable", 'webp'),
    grenade_inc: createStrategem("Incendiary", "G-10 Incendiary", "Throwable", 'webp'),
    grenade_impact: createStrategem("Impact", "G-16 Impact", "Throwable", 'webp'),
    grenade_inc_impact: createStrategem("Incendiary Impact", "G-13 Incendiary Impact", "Throwable", 'webp'),
    grenade_stun: createStrategem("Stun", "G-23 Stun", "Throwable", 'webp'),
    grenade_gas: createStrategem("Gas", "G-4 Gas", "Throwable", 'webp'),
    grenade_drone: createStrategem("Seeker", "G-50 Seeker", "Throwable", 'webp'),
    grenade_smoke: createStrategem("Smoke", "G-3 Smoke", "Throwable", 'webp'),
    grenade_termite: createStrategem("Thermite", "G-123 Thermite", "Throwable", 'webp'),
    throwing_knife: createStrategem("Throwing Knife", "K-2 Throwing Knife", "Throwable", 'webp'),
};

export { 
    isDev,
    strategemsDict,
    weaponsDict,
    apiBaseUrl,
    navRoutes,
    missionNames,
    itemCategories,
    weaponCategories,
    itemCategoryColors,
    difficultiesNames,
    difficultiesNamesShort,
    patchPeriods,
    factions,
    factionColors,
    missionTypes,
    weaponCategoryColors,
    strategemCount
};
