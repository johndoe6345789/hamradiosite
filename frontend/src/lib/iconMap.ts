import SchoolIcon from '@mui/icons-material/School';
import GavelIcon from '@mui/icons-material/Gavel';
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices';
import RadioIcon from '@mui/icons-material/Radio';
import CellTowerIcon from '@mui/icons-material/CellTower';
import WavesIcon from '@mui/icons-material/Waves';
import SettingsInputAntennaIcon from '@mui/icons-material/SettingsInputAntenna';
import HeadsetIcon from '@mui/icons-material/Headset';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';

const ICON_MAP: Record<string, React.ElementType> = {
  Gavel: GavelIcon,
  ElectricalServices: ElectricalServicesIcon,
  Radio: RadioIcon,
  CellTower: CellTowerIcon,
  Waves: WavesIcon,
  SettingsInputAntenna: SettingsInputAntennaIcon,
  Headset: HeadsetIcon,
  HealthAndSafety: HealthAndSafetyIcon,
};

export function getIcon(name: string): React.ElementType {
  return ICON_MAP[name] || SchoolIcon;
}

export default ICON_MAP;
