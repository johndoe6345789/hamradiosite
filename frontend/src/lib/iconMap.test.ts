import ICON_MAP, { getIcon, renderIcon } from './iconMap';
import SchoolIcon from '@mui/icons-material/School';
import GavelIcon from '@mui/icons-material/Gavel';
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices';
import RadioIcon from '@mui/icons-material/Radio';
import CellTowerIcon from '@mui/icons-material/CellTower';
import WavesIcon from '@mui/icons-material/Waves';
import SettingsInputAntennaIcon from '@mui/icons-material/SettingsInputAntenna';
import HeadsetIcon from '@mui/icons-material/Headset';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';

describe('iconMap', () => {
  describe('ICON_MAP', () => {
    it('should contain all expected icon mappings', () => {
      expect(ICON_MAP['Gavel']).toBe(GavelIcon);
      expect(ICON_MAP['ElectricalServices']).toBe(ElectricalServicesIcon);
      expect(ICON_MAP['Radio']).toBe(RadioIcon);
      expect(ICON_MAP['CellTower']).toBe(CellTowerIcon);
      expect(ICON_MAP['Waves']).toBe(WavesIcon);
      expect(ICON_MAP['SettingsInputAntenna']).toBe(SettingsInputAntennaIcon);
      expect(ICON_MAP['Headset']).toBe(HeadsetIcon);
      expect(ICON_MAP['HealthAndSafety']).toBe(HealthAndSafetyIcon);
    });

    it('should have exactly 8 entries', () => {
      expect(Object.keys(ICON_MAP)).toHaveLength(8);
    });
  });

  describe('getIcon', () => {
    it.each([
      ['Gavel', GavelIcon],
      ['ElectricalServices', ElectricalServicesIcon],
      ['Radio', RadioIcon],
      ['CellTower', CellTowerIcon],
      ['Waves', WavesIcon],
      ['SettingsInputAntenna', SettingsInputAntennaIcon],
      ['Headset', HeadsetIcon],
      ['HealthAndSafety', HealthAndSafetyIcon],
    ])('should return %s icon for key "%s"', (name, expected) => {
      expect(getIcon(name)).toBe(expected);
    });

    it('should return SchoolIcon as fallback for unknown name', () => {
      expect(getIcon('UnknownIcon')).toBe(SchoolIcon);
    });

    it('should return SchoolIcon for empty string', () => {
      expect(getIcon('')).toBe(SchoolIcon);
    });
  });

  describe('renderIcon', () => {
    it('should return a React element for a known icon', () => {
      const element = renderIcon('Gavel');
      expect(element).toBeTruthy();
    });

    it('should return a React element for an unknown icon (fallback)', () => {
      const element = renderIcon('UnknownIcon');
      expect(element).toBeTruthy();
    });
  });
});
