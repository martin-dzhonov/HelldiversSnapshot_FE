import eagle_airstrike_svg from './assets/svgs/Eagle Airstrike.svg'
import eagle_500kg_svg from './assets/svgs/Eagle 500KG Bomb.svg'
import eagle_strafe_svg from './assets/svgs/Eagle Strafing Run.svg'
import eagle_cluster_svg from './assets/svgs/Eagle Cluster Bomb.svg'
import eagle_napalm_svg from './assets/svgs/Eagle Napalm Airstrike.svg'
import eagle_110_svg from './assets/svgs/Eagle 110MM Rocket Pods.svg'
import barrage_380_svg from './assets/svgs/Orbital 380MM HE Barrage.svg'
import barrage_120_svg from './assets/svgs/Orbital 120MM HE Barrage.svg'
import walking_barrage_svg from './assets/svgs/Orbital Walking Barrage.svg'
import gatling_barrage_svg from './assets/svgs/Orbital Gatling Barrage.svg'
import orbital_laser_svg from './assets/svgs/Orbital Laser.svg'
import orbital_railcannon_svg from './assets/svgs/Orbital Railcannon Strike.svg'
import orbital_airburst_svg from './assets/svgs/Orbital Airburst Strike.svg'
import orbital_precision_svg from './assets/svgs/Orbital Precision Strike.svg'
import orbital_gas_svg from './assets/svgs/Orbital Gas Strike.svg'
import orbital_ems_svg from './assets/svgs/Orbital EMS Strike.svg'
import stalwart_svg from './assets/svgs/Stalwart.svg'
import mg_svg from './assets/svgs/Machine Gun.svg'
import hmg_svg from './assets/svgs/Heavy Machine Gun.svg'
import amr_svg from './assets/svgs/Anti-Materiel Rifle.svg'
import laser_cannon_svg from './assets/svgs/Laser Cannon.svg'
import railgun_svg from './assets/svgs/Railgun.svg'
import autocannon_svg from './assets/svgs/Autocannon.svg'
import grenade_launcher_svg from './assets/svgs/Grenade Launcher.svg'
import eat_svg from './assets/svgs/Expendable Anti-Tank.svg'
import quasar_cannon_svg from './assets/svgs/Quasar Cannon.svg'
import recoilless_rifle_svg from './assets/svgs/Recoilless Rifle.svg'
import spear_svg from './assets/svgs/Spear.svg'
import flamethrower_svg from './assets/svgs/Flamethrower.svg'
import arc_thrower_svg from './assets/svgs/Arc Thrower.svg'
import airburst_launcher_svg from './assets/svgs/Airburst Rocket Launcher.svg'
import guard_dog_rover_svg from './assets/svgs/Guard Dog Rover.svg'
import guard_dog_svg from './assets/svgs/Guard Dog.svg'
import ballistic_shield_svg from './assets/svgs/Ballistic Shield Backpack.svg'
import shield_backpack_svg from './assets/svgs/Shield Generator Pack.svg'
import supply_backpack_svg from './assets/svgs/Supply Pack.svg'
import jump_pack_svg from './assets/svgs/Jump Pack.svg'
import patriot_svg from './assets/svgs/Patriot Exosuit.svg'
import hmg_encampment_svg from './assets/svgs/HMG Emplacement.svg'
import gatling_sentry_svg from './assets/svgs/Gatling Sentry.svg'
import autocannon_sentry_svg from './assets/svgs/Autocannon Sentry.svg'
import rocket_sentry_svg from './assets/svgs/Rocket Sentry.svg'
import mortar_sentry_svg from './assets/svgs/Mortar Sentry.svg'
import ems_sentry_svg from './assets/svgs/EMS Mortar Sentry.svg'
import arc_sentry_svg from './assets/svgs/Tesla Tower.svg'
import shield_relay_svg from './assets/svgs/Shield Generator Relay.svg'
import mines_infantry_svg from './assets/svgs/Anti-Personnel Minefield.svg'
import mines_incendiary_svg from './assets/svgs/Incendiary Mines.svg'

const baseIconsSvg = [
  eagle_airstrike_svg,
  eagle_500kg_svg,
  eagle_strafe_svg,
  eagle_cluster_svg,
  eagle_napalm_svg,
  eagle_110_svg,
  barrage_380_svg,
  barrage_120_svg,
  walking_barrage_svg,
  gatling_barrage_svg,
  orbital_laser_svg,
  orbital_railcannon_svg,
  orbital_airburst_svg,
  orbital_precision_svg,
  orbital_gas_svg,
  orbital_ems_svg,
  stalwart_svg,
  mg_svg,
  hmg_svg,
  amr_svg,
  laser_cannon_svg,
  railgun_svg,
  autocannon_svg,
  grenade_launcher_svg,
  eat_svg,
  quasar_cannon_svg,
  recoilless_rifle_svg,
  spear_svg,
  flamethrower_svg,
  arc_thrower_svg,
  airburst_launcher_svg,
  guard_dog_rover_svg,
  guard_dog_svg,
  ballistic_shield_svg,
  shield_backpack_svg,
  supply_backpack_svg,
  jump_pack_svg,
  patriot_svg,
  hmg_encampment_svg,
  gatling_sentry_svg,
  autocannon_sentry_svg,
  rocket_sentry_svg,
  mortar_sentry_svg,
  ems_sentry_svg,
  arc_sentry_svg,
  shield_relay_svg,
  mines_infantry_svg,
  mines_incendiary_svg,
];

const baseLabels = [
  'eagle_airstrike',
  'eagle_500kg',
  'eagle_strafe',
  'eagle_cluster',
  'eagle_napalm',
  'eagle_110',
  'barrage_380',
  'barrage_120',
  'walking_barrage',
  'gatling_barrage',
  'orbital_laser',
  'orbital_railcannon',
  'orbital_airburst',
  'orbital_precision',
  'orbital_gas',
  'orbital_ems',
  'stalwart',
  'mg',
  'hmg',
  'amr',
  'laser_cannon',
  'railgun',
  'autocannon',
  'grenade_launcher',
  'eat',
  'quasar_cannon',
  'recoilless_rifle',
  'spear',
  'flamethrower',
  'arc_thrower',
  'airburst_launcher',
  'guard_dog_rover',
  'guard_dog',
  'ballistic_shield',
  'shield_backpack',
  'supply_backpack',
  'jump_pack',
  'patriot',
  'hmg_encampment',
  'gatling_sentry',
  'autocannon_sentry',
  'rocket_sentry',
  'mortar_sentry',
  'ems_sentry',
  'arc_sentry',
  'shield_relay',
  'mines_infantry',
  'mines_incendiary'
];

const baseLabelsFull = [
  'Eagle Airstrike',
  'Eagle 500KG Bomb',
  'Eagle Strafing Run',
  'Eagle Cluster Bomb',
  'Eagle Napalm Airstrike',
  'Eagle 110MM Rocket Pods',
  'Orbital 380MM HE Barrage',
  'Orbital 120MM HE Barrage',
  'Orbital Walking Barrage',
  'Orbital Gatling Barrage',
  'Orbital Laser',
  'Orbital Railcannon Strike',
  'Orbital Airburst Strike',
  'Orbital Precision Strike',
  'Orbital Gas Strike',
  'Orbital EMS Strike',
  'Stalwart',
  'Machine Gun',
  'Heavy Machine Gun',
  'Anti-Materiel Rifle',
  'Laser Cannon',
  'Railgun',
  'Autocannon',
  'Grenade Launcher',
  'Expendable Anti-Tank',
  'Quasar Cannon',
  'Recoilless Rifle',
  'Spear',
  'Flamethrower',
  'Arc Thrower',
  'Airburst Rocket Launcher',
  'Guard Dog Rover',
  'Guard Dog',
  'Ballistic Shield Backpack',
  'Shield Generator Pack',
  'Supply Pack',
  'Jump Pack',
  'Patriot Exosuit',
  'HMG Emplacement',
  'Gatling Sentry',
  'Autocannon Sentry',
  'Rocket Sentry',
  'Mortar Sentry',
  'EMS Mortar Sentry',
  'Tesla Tower',
  'Shield Generator Relay',
  'Anti-Personnel Minefield',
  'Incendiary Mines',]

const metaDictTerminidTest = {"hmg_encampment":13,"eat":4,"guard_dog_rover":2,"orbital_railcannon":3,"spear":6,"arc_sentry":4,"orbital_airburst":7,"gatling_sentry":10,"eagle_cluster":6,"recoilless_rifle":3,"eagle_airstrike":4,"railgun":1,"eagle_napalm":4,"barrage_380":5,"eagle_110":2,"grenade_launcher":1,"supply_backpack":1,"arc_thrower":2,"airburst_launcher":1,"eagle_500kg":8,"jump_pack":2,"quasar_cannon":3,"laser_cannon":3,"orbital_gas":1,"barrage_120":1,"gatling_barrage":1,"hmg":1,"walking_barrage":1,"mortar_sentry":1,"flamethrower":1,"autocannon_sentry":1,"mines_incendiary":1,"orbital_ems":1,"rocket_sentry":2,"eagle_strafe":1}
const metaDictAutomatonTest = {"recoilless_rifle":2,"eagle_cluster":18,"gatling_barrage":16,"mortar_sentry":12,"guard_dog_rover":5,"eagle_110":10,"laser_cannon":3,"walking_barrage":3,"barrage_380":12,"railgun":9,"shield_backpack":6,"autocannon_sentry":5,"spear":5,"orbital_airburst":2,"eagle_airstrike":10,"hmg":8,"orbital_precision":1,"supply_backpack":3,"hmg_encampment":3,"orbital_gas":1,"grenade_launcher":2,"mg":2,"arc_sentry":1,"amr":2,"eat":1,"autocannon":1,"ballistic_shield":1,"guard_dog":1,"orbital_railcannon":1};

const metaDictAutomaton = {
  "barrage_120": 41,
  "eagle_500kg": 138,
  "eagle_airstrike": 279,
  "autocannon": 139,
  "orbital_laser": 208,
  "orbital_railcannon": 111,
  "eat": 43,
  "recoilless_rifle": 28,
  "eagle_cluster": 48,
  "gatling_barrage": 23,
  "mortar_sentry": 65,
  "orbital_precision": 56,
  "amr": 65,
  "shield_backpack": 113,
  "guard_dog_rover": 20,
  "eagle_110": 30,
  "ballistic_shield": 21,
  "airburst_launcher": 10,
  "autocannon_sentry": 62,
  "railgun": 29,
  "rocket_sentry": 20,
  "arc_sentry": 2,
  "gatling_sentry": 13,
  "laser_cannon": 34,
  "walking_barrage": 21,
  "barrage_380": 70,
  "quasar_cannon": 107,
  "supply_backpack": 30,
  "jump_pack": 17,
  "orbital_ems": 6,
  "mg": 11,
  "ems_sentry": 33,
  "hmg_encampment": 5,
  "hmg": 21,
  "orbital_gas": 12,
  "spear": 21,
  "orbital_airburst": 8,
  "grenade_launcher": 13,
  "shield_relay": 10,
  "eagle_napalm": 10,
  "eagle_strafe": 2,
  "arc_thrower": 5,
  "guard_dog": 10,
  "stalwart": 6,
  "mines_incendiary": 2,
  "patriot": 3,
  "flamethrower": 1,
  "mines_infantry": 1
};

const metaDictTerminid = {
  "hmg_encampment": 22,
  "eat": 74,
  "guard_dog_rover": 156,
  "orbital_railcannon": 212,
  "eagle_cluster": 85,
  "orbital_laser": 181,
  "patriot": 24,
  "eagle_napalm": 70,
  "orbital_airburst": 41,
  "recoilless_rifle": 38,
  "shield_backpack": 102,
  "arc_thrower": 14,
  "rocket_sentry": 18,
  "spear": 27,
  "arc_sentry": 12,
  "grenade_launcher": 34,
  "autocannon_sentry": 95,
  "flamethrower": 55,
  "jump_pack": 35,
  "guard_dog": 4,
  "gatling_sentry": 123,
  "quasar_cannon": 180,
  "eagle_500kg": 203,
  "eagle_airstrike": 206,
  "mg": 14,
  "mortar_sentry": 34,
  "autocannon": 57,
  "mines_incendiary": 5,
  "orbital_gas": 37,
  "eagle_110": 17,
  "orbital_precision": 28,
  "barrage_380": 37,
  "stalwart": 26,
  "ems_sentry": 24,
  "railgun": 7,
  "supply_backpack": 19,
  "ballistic_shield": 13,
  "shield_relay": 2,
  "airburst_launcher": 16,
  "laser_cannon": 14,
  "gatling_barrage": 18,
  "barrage_120": 22,
  "walking_barrage": 10,
  "mines_infantry": 2,
  "amr": 6,
  "hmg": 4,
  "eagle_strafe": 4,
  "orbital_ems": 3
};

export { baseIconsSvg, baseLabels, baseLabelsFull, metaDictAutomaton, metaDictTerminid,  metaDictAutomatonTest, metaDictTerminidTest };
