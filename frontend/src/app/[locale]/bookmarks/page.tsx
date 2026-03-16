'use client';

import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import GavelIcon from '@mui/icons-material/Gavel';
import SchoolIcon from '@mui/icons-material/School';
import RadioIcon from '@mui/icons-material/Radio';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ForumIcon from '@mui/icons-material/Forum';
import BuildIcon from '@mui/icons-material/Build';
import ArticleIcon from '@mui/icons-material/Article';
import SettingsInputAntennaIcon from '@mui/icons-material/SettingsInputAntenna';

const GLOSSARY: Record<string, string> = {
  'Ofcom': 'Office of Communications — the UK government body that regulates radio spectrum',
  'RSGB': 'Radio Society of Great Britain — the national membership body for amateur radio operators',
  'SDR': 'Software Defined Radio — a radio where signal processing is done by software instead of hardware',
  'RTL-SDR': 'A cheap USB TV tuner repurposed as a software defined radio receiver (around £25)',
  'HF': 'High Frequency — radio waves between 3-30 MHz, used for long-distance communication',
  'DX': 'Long-distance radio communication, or a distant station you contact',
  'DX Cluster': 'A network where operators share real-time reports of distant stations they can hear',
  'SOTA': 'Summits on the Air — an award scheme for operating portable radio from hilltops and mountains',
  'POTA': 'Parks on the Air — an award scheme for operating portable radio from parks and green spaces',
  'QRZ': 'A Q-code meaning "Who is calling me?" — also the name of the main callsign lookup website',
  'Callsign': 'A unique identifier (e.g. M7ABC) assigned to every licensed radio operator',
  'Band Plan': 'A chart showing which frequencies are allocated for different types of radio activity',
  'Propagation': 'How radio waves travel from transmitter to receiver — affected by the atmosphere and solar activity',
  'Repeater': 'A relay station that receives a signal and retransmits it at higher power to extend range',
  'Transceiver': 'A device that can both transmit and receive radio signals — a combined radio',
  'Dongle': 'A small USB device — in this context, a USB stick that receives radio signals for your computer',
  'ARRL': 'American Radio Relay League — the US national association for amateur radio',
  'EMC': 'Electromagnetic Compatibility — ensuring radio equipment doesn\'t interfere with other electronics',
  'Raspberry Pi': 'A small, affordable single-board computer popular for DIY radio projects',
};

function GlossaryText({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    let earliestIndex = remaining.length;
    let earliestTerm = '';

    for (const term of Object.keys(GLOSSARY)) {
      const idx = remaining.indexOf(term);
      if (idx !== -1 && idx < earliestIndex) {
        earliestIndex = idx;
        earliestTerm = term;
      }
    }

    if (!earliestTerm) {
      parts.push(remaining);
      break;
    }

    if (earliestIndex > 0) {
      parts.push(remaining.slice(0, earliestIndex));
    }

    parts.push(
      <Tooltip key={key++} title={GLOSSARY[earliestTerm]} arrow enterTouchDelay={0}>
        <span style={{ textDecoration: 'underline dotted', textUnderlineOffset: '3px', cursor: 'help' }}>
          {earliestTerm}
        </span>
      </Tooltip>
    );

    remaining = remaining.slice(earliestIndex + earliestTerm.length);
  }

  return <>{parts}</>;
}

interface BookmarkLink {
  title: string;
  url: string;
  description: string;
  tag?: string;
}

interface BookmarkSection {
  titleKey: string;
  icon: React.ReactNode;
  links: BookmarkLink[];
}

const SECTIONS: BookmarkSection[] = [
  {
    titleKey: 'officialTitle',
    icon: <GavelIcon />,
    links: [
      { title: 'Ofcom', url: 'https://www.ofcom.org.uk/manage-your-licence/radiocommunication-licences/amateur-radio', description: 'UK regulator — licence applications, band plans, and regulations' },
      { title: 'RSGB', url: 'https://rsgb.org', description: 'Radio Society of Great Britain — the national society for amateur radio' },
      { title: 'RSGB Exam Booking', url: 'https://rsgb.org/main/clubs-and-education/exams/', description: 'Book your Foundation, Intermediate, or Full exam' },
      { title: 'Ofcom Licence Conditions Booklet', url: 'https://www.ofcom.org.uk/siteassets/resources/documents/spectrum/amateur-radio/licence-terms-conditions-and-limitations/amateur-radio-licence-terms-conditions-and-limitations.pdf', description: 'The official amateur radio licence terms and conditions', tag: 'PDF' },
      { title: 'UK Band Plan', url: 'https://rsgb.org/main/operating/band-plans/', description: 'Official RSGB band plans for all UK amateur bands' },
    ],
  },
  {
    titleKey: 'examTitle',
    icon: <SchoolIcon />,
    links: [
      { title: 'RSGB Exam Syllabus', url: 'https://rsgb.org/main/clubs-and-education/for-students/', description: 'Official Foundation, Intermediate, and Full licence syllabuses' },
      { title: 'RSGB Club Finder', url: 'https://rsgb.org/main/clubs-and-education/find-a-club/', description: 'Find a local radio club for training and exam sessions' },
      { title: 'Essex Ham Foundation Course', url: 'https://www.essexham.co.uk/train/', description: 'Free online Foundation licence training course', tag: 'Free' },
      { title: 'Ham Tests Online', url: 'https://hamtests.co.uk', description: 'Practice questions for UK amateur radio exams' },
      { title: 'Foundation Licence Now!', url: 'https://rsgb.org/main/clubs-and-education/online-training/', description: 'RSGB online training and distance learning resources' },
    ],
  },
  {
    titleKey: 'sdrTitle',
    icon: <RadioIcon />,
    links: [
      { title: 'WebSDR', url: 'http://www.websdr.org', description: 'Listen to amateur radio signals worldwide through web-based SDR receivers', tag: 'Free' },
      { title: 'KiwiSDR', url: 'http://kiwisdr.com/public/', description: 'Network of publicly accessible SDR receivers around the world', tag: 'Free' },
      { title: 'SDR# (SDRSharp)', url: 'https://airspy.com/download/', description: 'Popular free SDR software for Windows — works with RTL-SDR dongles', tag: 'Free' },
      { title: 'RTL-SDR Blog', url: 'https://www.rtl-sdr.com', description: 'Guides, tutorials, and news about RTL-SDR and software defined radio' },
      { title: 'Gqrx SDR', url: 'https://gqrx.dk', description: 'Open-source SDR receiver for Linux and macOS', tag: 'Free' },
      { title: 'OpenWebRX', url: 'https://www.openwebrx.de', description: 'Multi-user SDR receiver you can run on a Raspberry Pi', tag: 'Open Source' },
    ],
  },
  {
    titleKey: 'equipmentTitle',
    icon: <ShoppingCartIcon />,
    links: [
      { title: 'ML&S (Martin Lynch & Sons)', url: 'https://www.hamradio.co.uk', description: 'Major UK amateur radio dealer — transceivers, antennas, accessories', tag: 'UK' },
      { title: 'Radioworld', url: 'https://www.radioworld.co.uk', description: 'UK-based ham radio shop with a wide range of equipment', tag: 'UK' },
      { title: 'Nevada Radio', url: 'https://www.nevadaradio.co.uk', description: 'UK dealer for Yaesu, Icom, Kenwood, and more', tag: 'UK' },
      { title: 'Moonraker', url: 'https://www.moonraker.eu', description: 'Antennas, accessories, and radio equipment', tag: 'UK' },
      { title: 'RTL-SDR Blog Store', url: 'https://www.rtl-sdr.com/buy-rtl-sdr-dvb-t-dongles/', description: 'Affordable SDR dongles — great way to start listening', tag: 'Budget' },
      { title: 'DX Engineering', url: 'https://www.dxengineering.com', description: 'Large US-based amateur radio supplier — ships internationally', tag: 'US' },
      { title: 'Ham Radio Outlet (HRO)', url: 'https://www.hamradio.com', description: 'US amateur radio superstore', tag: 'US' },
    ],
  },
  {
    titleKey: 'communityTitle',
    icon: <ForumIcon />,
    links: [
      { title: 'r/amateurradio', url: 'https://www.reddit.com/r/amateurradio/', description: 'Active Reddit community for amateur radio discussion' },
      { title: 'r/HamRadio', url: 'https://www.reddit.com/r/HamRadio/', description: 'Another Reddit ham radio community, beginner-friendly' },
      { title: 'QRZ.com', url: 'https://www.qrz.com', description: 'Callsign database, forums, and logbook — the ham radio social network' },
      { title: 'eHam.net', url: 'https://www.eham.net', description: 'Equipment reviews, forums, and articles' },
      { title: 'RSGB Forum', url: 'https://rsgb.org/main/blog/front-page/', description: 'Official RSGB news and community updates' },
      { title: 'Ham Radio Stack Exchange', url: 'https://ham.stackexchange.com', description: 'Q&A site for amateur radio questions' },
    ],
  },
  {
    titleKey: 'toolsTitle',
    icon: <BuildIcon />,
    links: [
      { title: 'QRZ Callsign Lookup', url: 'https://www.qrz.com/lookup', description: 'Look up any amateur radio callsign worldwide' },
      { title: 'Repeater Map UK', url: 'https://ukrepeater.net', description: 'Find amateur radio repeaters across the UK' },
      { title: 'DX Cluster', url: 'https://dxcluster.ha8tks.hu/map/', description: 'Real-time map of DX spots — see who is working whom worldwide' },
      { title: 'Solar-Terrestrial Data', url: 'https://www.hamqsl.com/solar.html', description: 'Solar conditions and propagation forecast for HF bands' },
      { title: 'VOACAP Propagation', url: 'https://www.voacap.com', description: 'HF propagation prediction tool — plan your DX contacts' },
      { title: 'Antenna Encyclopaedia', url: 'https://www.antenna-theory.com', description: 'Learn about antenna types, theory, and design' },
    ],
  },
  {
    titleKey: 'newsTitle',
    icon: <ArticleIcon />,
    links: [
      { title: 'RSGB RadCom', url: 'https://rsgb.org/main/publications-archives/radcom/', description: 'The RSGB monthly magazine — included with membership' },
      { title: 'Practical Wireless', url: 'https://www.radioenthusiast.co.uk', description: 'UK amateur radio magazine with projects and reviews' },
      { title: 'Southgate Amateur Radio News', url: 'https://www.southgatearc.org', description: 'Daily amateur radio news from around the world', tag: 'Free' },
      { title: 'ICQ Podcast', url: 'https://www.icqpodcast.com', description: 'Weekly amateur radio podcast covering news and interviews', tag: 'Podcast' },
      { title: 'Ham Radio 2.0', url: 'https://www.youtube.com/@HamRadio2dot0', description: 'Popular YouTube channel for ham radio beginners and enthusiasts', tag: 'YouTube' },
    ],
  },
  {
    titleKey: 'antennasTitle',
    icon: <SettingsInputAntennaIcon />,
    links: [
      { title: 'G3TXQ Antenna Pages', url: 'https://www.karinya.net/g3txq/', description: 'Practical antenna designs and comparisons for HF' },
      { title: 'SOTAbeams', url: 'https://www.sotabeams.co.uk', description: 'Portable antennas and kits — great for Summits on the Air (SOTA)', tag: 'UK' },
      { title: 'ARRL Antenna Projects', url: 'https://www.arrl.org/building-simple-antennas', description: 'Simple antenna building guides for beginners' },
      { title: 'Summits on the Air (SOTA)', url: 'https://www.sota.org.uk', description: 'Activate hilltops and mountains with portable radio — a popular outdoor activity' },
      { title: 'Parks on the Air (POTA)', url: 'https://parksontheair.com', description: 'Operate from parks and green spaces — relaxed portable operating' },
    ],
  },
];

function BookmarkItem({ link }: { link: BookmarkLink }) {
  return (
    <ListItem sx={{ alignItems: 'flex-start', px: 0 }}>
      <ListItemIcon sx={{ mt: 0.5, minWidth: 36 }}>
        <OpenInNewIcon fontSize="small" color="primary" />
      </ListItemIcon>
      <ListItemText
        primary={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Link href={link.url} target="_blank" rel="noopener noreferrer" fontWeight={600}>{link.title}</Link>
            {link.tag && <Chip label={link.tag} size="small" variant="outlined" sx={{ fontSize: '0.7rem', height: 20 }} />}
          </Box>
        }
        secondary={<GlossaryText text={link.description} />}
        secondaryTypographyProps={{ component: 'div' }}
      />
    </ListItem>
  );
}

function BookmarkCategory({ section, t }: { section: BookmarkSection; t: (key: string) => string }) {
  return (
    <Card variant="outlined" sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <Box sx={{ color: 'primary.main' }}>{section.icon}</Box>
          <Typography variant="h6" fontWeight={600}><GlossaryText text={t(section.titleKey)} /></Typography>
        </Box>
        <List disablePadding>
          {section.links.map((link) => (
            <BookmarkItem key={link.url} link={link} />
          ))}
        </List>
      </CardContent>
    </Card>
  );
}

export default function BookmarksPage() {
  const t = useTranslations('bookmarks');

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h3" component="h1" fontWeight={700} gutterBottom>{t('title')}</Typography>
      <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>{t('subtitle')}</Typography>
      <Divider sx={{ mb: 4 }} />
      {SECTIONS.map((section) => (
        <BookmarkCategory key={section.titleKey} section={section} t={t} />
      ))}
    </Container>
  );
}
