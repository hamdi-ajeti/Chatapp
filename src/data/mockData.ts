import type { User, Server, Channel, Message } from '../types';

export const USERS: User[] = [
  { id: 'u1', username: 'you', displayName: 'You', avatar: '🧑‍💻', status: 'online', color: '#7c6af7' },
  { id: 'u2', username: 'nova', displayName: 'Nova', avatar: '🦊', status: 'online', color: '#f77c6a' },
  { id: 'u3', username: 'cassian', displayName: 'Cassian', avatar: '🐺', status: 'idle', color: '#6af7c8' },
  { id: 'u4', username: 'lyra', displayName: 'Lyra', avatar: '🐱', status: 'dnd', color: '#f7c86a' },
  { id: 'u5', username: 'echo', displayName: 'Echo', avatar: '🦋', status: 'offline', color: '#c86af7' },
];

const makeMsg = (id: string, authorId: string, content: string, minutesAgo: number): Message => ({
  id,
  authorId,
  content,
  timestamp: new Date(Date.now() - minutesAgo * 60 * 1000),
  reactions: [],
});

const generalMessages: Message[] = [
  makeMsg('m1', 'u2', 'hey everyone! finally set up the new server 🎉', 120),
  makeMsg('m2', 'u3', 'looks great! love the channel structure', 115),
  makeMsg('m3', 'u4', 'agreed. also can we talk about the weekend meetup?', 110),
  makeMsg('m4', 'u2', 'yes! thinking Saturday around 3pm? we could grab coffee or something', 108),
  makeMsg('m5', 'u1', 'Saturday works for me 👍', 105),
  makeMsg('m6', 'u3', 'same here, what area are you thinking?', 100),
  makeMsg('m7', 'u4', 'downtown maybe? there\'s that new place that opened last month', 98),
  makeMsg('m8', 'u2', 'oh the one near the park? heard it\'s really good', 95),
  makeMsg('m9', 'u1', 'let\'s do it. I\'ll put it in the calendar', 90),
];

const techMessages: Message[] = [
  makeMsg('t1', 'u3', 'anyone tried the new Zustand v5 yet?', 200),
  makeMsg('t2', 'u1', 'yeah! the new `useShallow` hook is super handy for preventing rerenders', 195),
  makeMsg('t3', 'u4', 'I\'ve been using Jotai lately, thoughts?', 190),
  makeMsg('t4', 'u2', 'zustand is simpler imo, less boilerplate', 185),
  makeMsg('t5', 'u3', 'agreed. slice pattern in zustand is really clean for bigger apps', 180),
  makeMsg('t6', 'u1', 'the devtools middleware is also 🔥 makes debugging so much easier', 175),
  makeMsg('t7', 'u5', 'just joined — are we talking state management? my hot take: Context API is underrated', 40),
  makeMsg('t8', 'u2', 'context is fine for static data but rerenders will haunt you 👻', 35),
  makeMsg('t9', 'u3', 'echo speaks the truth lol, welcome btw!', 30),
];

const randomMessages: Message[] = [
  makeMsg('r1', 'u4', 'what\'s everyone listening to lately?', 300),
  makeMsg('r2', 'u5', 'been on a huge synthwave kick recently', 295),
  makeMsg('r3', 'u2', 'oh nice, any recommendations?', 290),
  makeMsg('r4', 'u5', 'Carpenter Brut and Perturbator are 🎸', 285),
  makeMsg('r5', 'u1', 'I\'ve been listening to a lot of lo-fi while coding', 280),
  makeMsg('r6', 'u3', 'classic. lo-fi + coffee = productivity unlocked', 275),
];

const dmMessages: Message[] = [
  makeMsg('d1', 'u2', 'hey! did you check the PR I sent?', 60),
  makeMsg('d2', 'u1', 'just saw it, looks solid! left a few comments', 55),
  makeMsg('d3', 'u2', 'awesome, I\'ll address them now', 50),
  makeMsg('d4', 'u1', 'no rush, it\'s mostly small style things', 48),
  makeMsg('d5', 'u2', 'btw are you coming to the meetup Saturday?', 45),
  makeMsg('d6', 'u1', 'yeah! just put it in my calendar', 44),
];

export const SERVERS: Server[] = [
  {
    id: 's1',
    name: 'The Crew',
    icon: '🚀',
    memberIds: ['u1', 'u2', 'u3', 'u4', 'u5'],
    channels: [
      {
        id: 'c1', name: 'general', type: 'text',
        description: 'General chit-chat and announcements',
        memberIds: ['u1', 'u2', 'u3', 'u4', 'u5'],
        messages: generalMessages, unread: 0,
      },
      {
        id: 'c2', name: 'tech-talk', type: 'text',
        description: 'Dev stuff, libraries, hot takes',
        memberIds: ['u1', 'u2', 'u3', 'u4', 'u5'],
        messages: techMessages, unread: 2,
      },
      {
        id: 'c3', name: 'random', type: 'text',
        description: 'Anything goes 🎲',
        memberIds: ['u1', 'u2', 'u3', 'u4', 'u5'],
        messages: randomMessages, unread: 0,
      },
    ],
  },
];

export const DM_CHANNELS: Channel[] = [
  {
    id: 'dm-nova', name: 'Nova', type: 'dm',
    memberIds: ['u1', 'u2'],
    messages: dmMessages, unread: 1,
  },
  {
    id: 'dm-cassian', name: 'Cassian', type: 'dm',
    memberIds: ['u1', 'u3'],
    messages: [makeMsg('dc1', 'u3', 'yo what\'s the plan for Saturday?', 70)],
    unread: 1,
  },
  {
    id: 'dm-lyra', name: 'Lyra', type: 'dm',
    memberIds: ['u1', 'u4'],
    messages: [makeMsg('dl1', 'u4', 'have you seen the new tailwind release?', 500)],
    unread: 0,
  },
];
