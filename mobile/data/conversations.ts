export type MessageType = {
  id: number;
  text: string;
  fromUser: boolean; // true if message is from current user, false if from other user
  timestamp: Date;
  time: string;
};

export type ConversationType = {
  id: number;
  user: {
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
  };
  lastMessage: string;
  time: string;
  timestamp: Date;
  messages: MessageType[];
};

export const CONVERSATIONS: ConversationType[] = [
  {
    id: 1,
    user: {
      name: "Sarah Chen",
      username: "sarahchen",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
      verified: true,
    },
    lastMessage: "Absolutely! I'll send you the tutorial link in a minute.",
    time: "2h",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    messages: [
      {
        id: 1,
        text: "Hey! Have you tried the new Next.js 14 features yet?",
        fromUser: false,
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        time: "4h",
      },
      {
        id: 2,
        text: "Not yet! Are they really that good? I've been hearing a lot about them.",
        fromUser: true,
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        time: "4h",
      },
      {
        id: 3,
        text: "Absolutely! I'll send you the tutorial link in a minute.",
        fromUser: false,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        time: "2h",
      },
    ],
  },
  {
    id: 2,
    user: {
      name: "Marcus Williams",
      username: "marcusw",
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
      verified: false,
    },
    lastMessage: "Perfect! I'll bring the presentation slides on a USB drive too.",
    time: "2d",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    messages: [
      {
        id: 1,
        text: "Hey, are we still on for the startup pitch session on Friday?",
        fromUser: false,
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        time: "3d",
      },
      {
        id: 2,
        text: "Definitely! I've been preparing all week. This is going to be epic!",
        fromUser: true,
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        time: "3d",
      },
      {
        id: 3,
        text: "Perfect! I'll bring the presentation slides on a USB drive too.",
        fromUser: false,
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        time: "2d",
      },
    ],
  },
  {
    id: 3,
    user: {
      name: "Emma Rodriguez",
      username: "emmarodz",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
      verified: true,
    },
    lastMessage: "Thanks! Your feedback really helped shape the final version.",
    time: "3d",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    messages: [
      {
        id: 1,
        text: "Quick question - did you finish reviewing the UI designs I sent?",
        fromUser: false,
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        time: "4d",
      },
      {
        id: 2,
        text: "Yes! They look amazing. I left some comments on Figma. Love the color scheme!",
        fromUser: true,
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        time: "4d",
      },
      {
        id: 3,
        text: "Thanks! Your feedback really helped shape the final version.",
        fromUser: false,
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        time: "3d",
      },
    ],
  },
  {
    id: 4,
    user: {
      name: "TechStart Inc",
      username: "techstartinc",
      avatar:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face",
      verified: true,
    },
    lastMessage: "Let's aim for Tuesday afternoon. I'll send a calendar invite.",
    time: "1w",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    messages: [
      {
        id: 1,
        text: "The beta version of your platform is ready for testing. Want to check it out?",
        fromUser: false,
        timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        time: "1w",
      },
      {
        id: 2,
        text: "That's great news! This is ahead of schedule. When can we do a walkthrough?",
        fromUser: true,
        timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        time: "1w",
      },
      {
        id: 3,
        text: "Let's aim for Tuesday afternoon. I'll send a calendar invite.",
        fromUser: false,
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        time: "1w",
      },
    ],
  },
];