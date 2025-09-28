import { allTopics } from "./topics";

export const taglines = [
  ['From Data to ', 'Insight'],
  ['From Insight to ', 'Model'],
  ['From Model to ', 'Signal'],
  ['From Signal to ', 'Trade'],
  ['From Trade to ', 'Alpha'],
  ['From Alpha to ', 'Mastery'],
];

export const quantJourney = allTopics.filter(topic => topic.category === 'main');
