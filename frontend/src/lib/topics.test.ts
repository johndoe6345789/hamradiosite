import { TOPICS } from './topics';

describe('TOPICS', () => {
  it('is an array of 8 topics', () => {
    expect(TOPICS).toHaveLength(8);
  });

  it('contains objects with slug and title properties', () => {
    TOPICS.forEach((topic) => {
      expect(topic).toHaveProperty('slug');
      expect(topic).toHaveProperty('title');
      expect(typeof topic.slug).toBe('string');
      expect(typeof topic.title).toBe('string');
    });
  });

  it('has the correct slugs in order', () => {
    const slugs = TOPICS.map((t) => t.slug);
    expect(slugs).toEqual([
      'licensing-conditions',
      'technical-basics',
      'transmitters-receivers',
      'feeders-antennas',
      'propagation',
      'emc',
      'operating-practices',
      'safety',
    ]);
  });

  it('has the correct titles in order', () => {
    const titles = TOPICS.map((t) => t.title);
    expect(titles).toEqual([
      'Licensing Conditions',
      'Technical Basics',
      'Transmitters & Receivers',
      'Feeders & Antennas',
      'Propagation',
      'EMC',
      'Operating Practices',
      'Safety',
    ]);
  });
});
