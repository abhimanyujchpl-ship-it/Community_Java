import type { AccessRequest } from "./accessRequest.service";
import type { Community } from "./community.service";
import type { DashboardData } from "./dashboard.service";
import type { EventItem } from "./event.service";
import type { NotificationItem } from "./notification.service";
import type { Post } from "./post.service";
import type { AuthUser, Role } from "../store/auth.store";

const STORE_KEY = "communityConnect.demoData";
const now = new Date();
const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

export const demoUsers: Record<"admin" | "member" | "superadmin", AuthUser & { password: string }> = {
  admin: {
    id: "demo-admin",
    fullName: "Sample Community Admin",
    email: "admin@communityconnect.local",
    mobile: "9000000002",
    role: "COMMUNITY_ADMIN",
    password: "Pass@123"
  },
  member: {
    id: "demo-member",
    fullName: "Sample Member",
    email: "member@communityconnect.local",
    mobile: "9000000001",
    role: "MEMBER",
    password: "Pass@123"
  },
  superadmin: {
    id: "demo-superadmin",
    fullName: "Sample Super Admin",
    email: "superadmin@communityconnect.local",
    mobile: "9000000003",
    role: "SUPER_ADMIN",
    password: "Pass@123"
  }
};

type DemoState = {
  communities: Community[];
  accessRequests: AccessRequest[];
  posts: Post[];
  events: EventItem[];
  notifications: NotificationItem[];
  members: Array<{ id: string; fullName: string; email: string; mobile: string; role: Role; status: string }>;
};

function seed(): DemoState {
  return {
    communities: [
      {
        id: "demo-community",
        name: "Green Meadows Community",
        description: "A friendly local community for events, notices, support requests, and neighborhood updates.",
        logoUrl: "",
        city: "Bengaluru",
        state: "Karnataka",
        memberCount: 248,
        status: "ACTIVE"
      },
      {
        id: "demo-community-2",
        name: "Sunrise Residents Forum",
        description: "Resident-led updates, events, announcements, and community collaboration.",
        city: "Hyderabad",
        state: "Telangana",
        memberCount: 164,
        status: "ACTIVE"
      }
    ],
    accessRequests: [
      {
        id: "demo-request-1",
        status: "PENDING",
        requestMessage: "I recently moved in and would like access to the community updates.",
        createdAt: now.toISOString(),
        user: { fullName: "Priya Sharma", email: "priya@example.com", mobile: "9000001010" },
        community: { id: "demo-community", name: "Green Meadows Community" }
      }
    ],
    posts: [
      {
        id: "demo-post-approved-1",
        title: "Weekend cleanliness drive",
        content: "Join us near the clubhouse this Saturday morning for a quick community cleanup and tea afterward.",
        postType: "ANNOUNCEMENT",
        status: "APPROVED",
        createdAt: now.toISOString(),
        author: { fullName: "Sample Community Admin", email: "admin@communityconnect.local" },
        community: { id: "demo-community", name: "Green Meadows Community" }
      },
      {
        id: "demo-post-pending-1",
        title: "Book donation table",
        content: "Can we set up a table for donating used school books this Sunday?",
        postType: "DONATION_SUPPORT_REQUEST",
        status: "PENDING_APPROVAL",
        createdAt: now.toISOString(),
        author: { fullName: "Sample Member", email: "member@communityconnect.local" },
        community: { id: "demo-community", name: "Green Meadows Community" }
      }
    ],
    events: [
      {
        id: "demo-event-1",
        title: "Community Town Hall",
        eventType: "MEETING",
        description: "Monthly town hall for updates, budgets, and resident questions.",
        location: "Clubhouse Hall",
        organizerName: "Sample Community Admin",
        startDateTime: tomorrow.toISOString(),
        endDateTime: new Date(tomorrow.getTime() + 90 * 60 * 1000).toISOString(),
        status: "UPCOMING"
      },
      {
        id: "demo-event-2",
        title: "Festival Planning Meet",
        eventType: "CULTURAL",
        description: "Plan volunteer groups, decoration, and food stalls.",
        location: "Garden Area",
        organizerName: "Events Committee",
        startDateTime: nextWeek.toISOString(),
        endDateTime: new Date(nextWeek.getTime() + 2 * 60 * 60 * 1000).toISOString(),
        status: "UPCOMING"
      }
    ],
    notifications: [
      {
        id: "demo-notification-1",
        title: "New event scheduled",
        message: "Community Town Hall has been added to your calendar.",
        type: "NEW_EVENT",
        isRead: false,
        createdAt: now.toISOString()
      },
      {
        id: "demo-notification-2",
        title: "Post approved",
        message: "Weekend cleanliness drive is now visible in the feed.",
        type: "POST_APPROVED",
        isRead: true,
        createdAt: now.toISOString()
      }
    ],
    members: [
      { id: "demo-member", fullName: "Sample Member", email: "member@communityconnect.local", mobile: "9000000001", role: "MEMBER", status: "ACTIVE" },
      { id: "demo-admin", fullName: "Sample Community Admin", email: "admin@communityconnect.local", mobile: "9000000002", role: "COMMUNITY_ADMIN", status: "ACTIVE" }
    ]
  };
}

function readState(): DemoState {
  const raw = localStorage.getItem(STORE_KEY);
  if (!raw) {
    const initial = seed();
    writeState(initial);
    return initial;
  }
  try {
    return JSON.parse(raw) as DemoState;
  } catch {
    const initial = seed();
    writeState(initial);
    return initial;
  }
}

function writeState(state: DemoState) {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

function page<T>(items: T[]) {
  return { items, totalItems: items.length, totalElements: items.length, totalPages: 1, page: 0, size: items.length };
}

function id(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function findDemoUser(emailOrMobile: string, password: string) {
  const login = emailOrMobile.trim().toLowerCase();
  return Object.values(demoUsers).find((user) => (user.email.toLowerCase() === login || user.mobile === login) && user.password === password);
}

export const demoData = {
  communities: () => page(readState().communities),
  accessRequests: {
    my: () => page(readState().accessRequests),
    byCommunity: (communityId: string, status?: string) => {
      const items = readState().accessRequests.filter((item) => item.community?.id === communityId && (!status || item.status === status));
      return page(items);
    },
    create: (payload: { communityId: string; requestMessage?: string }) => {
      const state = readState();
      const community = state.communities.find((item) => item.id === payload.communityId) || state.communities[0];
      const request: AccessRequest = {
        id: id("demo-request"),
        status: "PENDING",
        requestMessage: payload.requestMessage,
        createdAt: new Date().toISOString(),
        user: { fullName: demoUsers.member.fullName, email: demoUsers.member.email, mobile: demoUsers.member.mobile },
        community: { id: community.id, name: community.name }
      };
      state.accessRequests = [request, ...state.accessRequests.filter((item) => item.community?.id !== community.id || item.user?.email !== demoUsers.member.email)];
      writeState(state);
      return request;
    },
    approve: (requestId: string) => {
      const state = readState();
      state.accessRequests = state.accessRequests.map((item) => item.id === requestId ? { ...item, status: "APPROVED" } : item);
      writeState(state);
      return state.accessRequests.find((item) => item.id === requestId)!;
    },
    reject: (requestId: string, rejectionReason: string) => {
      const state = readState();
      state.accessRequests = state.accessRequests.map((item) => item.id === requestId ? { ...item, status: "REJECTED", rejectionReason } : item);
      writeState(state);
      return state.accessRequests.find((item) => item.id === requestId)!;
    }
  },
  posts: {
    feed: (communityId: string, postType?: string) => page(readState().posts.filter((post) => post.community?.id === communityId && post.status === "APPROVED" && (!postType || post.postType === postType))),
    my: () => page(readState().posts.filter((post) => post.author?.email === demoUsers.member.email)),
    pending: (communityId: string) => page(readState().posts.filter((post) => post.community?.id === communityId && post.status === "PENDING_APPROVAL")),
    create: (payload: { communityId: string; postType: string; title: string; content: string; mediaUrl?: string }) => {
      const state = readState();
      const community = state.communities.find((item) => item.id === payload.communityId) || state.communities[0];
      const post: Post = {
        id: id("demo-post"),
        title: payload.title,
        content: payload.content,
        postType: payload.postType,
        status: "PENDING_APPROVAL",
        createdAt: new Date().toISOString(),
        author: { fullName: demoUsers.member.fullName, email: demoUsers.member.email },
        community: { id: community.id, name: community.name }
      };
      state.posts = [post, ...state.posts];
      writeState(state);
      return post;
    },
    approve: (postId: string) => {
      const state = readState();
      state.posts = state.posts.map((post) => post.id === postId ? { ...post, status: "APPROVED" } : post);
      writeState(state);
      return state.posts.find((post) => post.id === postId)!;
    },
    reject: (postId: string, rejectionReason: string) => {
      const state = readState();
      state.posts = state.posts.map((post) => post.id === postId ? { ...post, status: "REJECTED", rejectionReason } : post);
      writeState(state);
      return state.posts.find((post) => post.id === postId)!;
    }
  },
  events: {
    byCommunity: (_communityId: string, status?: string) => page(readState().events.filter((event) => !status || event.status === status)),
    upcoming: (_communityId: string) => page(readState().events.filter((event) => event.status === "UPCOMING")),
    create: (payload: Omit<EventItem, "id" | "status"> & { communityId: string }) => {
      const state = readState();
      const event: EventItem = { ...payload, id: id("demo-event"), status: "UPCOMING" };
      state.events = [event, ...state.events];
      state.notifications = [{ id: id("demo-notification"), title: "New event scheduled", message: `${event.title} was added.`, type: "NEW_EVENT", isRead: false, createdAt: new Date().toISOString() }, ...state.notifications];
      writeState(state);
      return event;
    },
    updateStatus: (eventId: string, status: string) => {
      const state = readState();
      state.events = state.events.map((event) => event.id === eventId ? { ...event, status } : event);
      writeState(state);
      return state.events.find((event) => event.id === eventId)!;
    }
  },
  notifications: {
    list: () => page(readState().notifications),
    unreadCount: () => readState().notifications.filter((item) => !(item.isRead || item.read)).length,
    markRead: (notificationId: string) => {
      const state = readState();
      state.notifications = state.notifications.map((item) => item.id === notificationId ? { ...item, isRead: true, read: true } : item);
      writeState(state);
      return state.notifications.find((item) => item.id === notificationId)!;
    },
    markAllRead: () => {
      const state = readState();
      state.notifications = state.notifications.map((item) => ({ ...item, isRead: true, read: true }));
      writeState(state);
      return {};
    }
  },
  dashboard: {
    admin: (): DashboardData => {
      const state = readState();
      return {
        totalMembers: state.members.length,
        pendingAccessRequests: state.accessRequests.filter((item) => item.status === "PENDING").length,
        pendingPostApprovals: state.posts.filter((item) => item.status === "PENDING_APPROVAL").length,
        upcomingEvents: state.events.filter((item) => item.status === "UPCOMING").length,
        notificationsCount: state.notifications.filter((item) => !(item.isRead || item.read)).length,
        blockedUsers: 0,
        pendingRequests: state.accessRequests.filter((item) => item.status === "PENDING"),
        recentPosts: state.posts.filter((item) => item.status === "APPROVED").slice(0, 3)
      };
    },
    member: (): DashboardData => {
      const state = readState();
      return {
        upcomingEventsCount: state.events.filter((item) => item.status === "UPCOMING").length,
        notificationsCount: state.notifications.filter((item) => !(item.isRead || item.read)).length,
        feedPreview: state.posts.filter((item) => item.status === "APPROVED").slice(0, 3),
        announcements: state.posts.filter((item) => item.status === "APPROVED" && item.postType === "ANNOUNCEMENT")
      };
    }
  },
  members: () => readState().members
};
