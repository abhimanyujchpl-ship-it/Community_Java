export type UserRole = "MEMBER" | "COMMUNITY_ADMIN" | "SUPER_ADMIN";
export type CommunityStatus = "ACTIVE" | "INACTIVE";
export type AccessRequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "BLOCKED" | "REMOVED";
export type PostType =
  | "ANNOUNCEMENT"
  | "GENERAL"
  | "EVENT_UPDATE"
  | "NEWS"
  | "BIRTHDAY_WISH"
  | "MATRIMONY"
  | "DONATION_REQUEST";
export type PostStatus = "DRAFT" | "PENDING_APPROVAL" | "APPROVED" | "REJECTED" | "DELETED";
export type EventStatus = "UPCOMING" | "COMPLETED" | "CANCELLED";
export type ReminderType = "ONE_TIME" | "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
export type NotificationType =
  | "ACCESS_REQUEST_APPROVED"
  | "ACCESS_REQUEST_REJECTED"
  | "NEW_EVENT"
  | "EVENT_REMINDER"
  | "POST_APPROVED"
  | "POST_REJECTED"
  | "NEW_ANNOUNCEMENT"
  | "BIRTHDAY_REMINDER";

export interface AuthUser {
  id: string;
  name: string;
  phoneNumber: string;
  fullName: string;
  email: string;
  mobile: string;
  city?: string;
  state?: string;
  occupation?: string;
  profilePhotoUrl?: string;
  role: UserRole;
}

export interface CommunitySummary {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  city: string;
  state: string;
  status: CommunityStatus;
  memberCount: number;
}

export interface UserSummary {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  city?: string;
  state?: string;
  occupation?: string;
  profilePhotoUrl?: string;
  role: "SUPER_ADMIN" | "COMMUNITY_ADMIN" | "MEMBER";
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
}

export interface AccessRequest {
  id: string;
  community: CommunitySummary;
  user: UserSummary;
  status: AccessRequestStatus;
  requestMessage?: string;
  rejectionReason?: string;
  reviewedBy?: UserSummary;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityPost {
  id: string;
  community: CommunitySummary;
  author: UserSummary;
  postType: PostType;
  title: string;
  content: string;
  mediaUrl?: string;
  status: PostStatus;
  rejectionReason?: string;
  approvedBy?: UserSummary;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventReminder {
  id: string;
  reminderType: ReminderType;
  reminderDateTime: string;
  message: string;
  isSent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityEvent {
  id: string;
  community: CommunitySummary;
  title: string;
  eventType: string;
  description?: string;
  bannerUrl?: string;
  location: string;
  startDateTime: string;
  endDateTime: string;
  organizerName?: string;
  status: EventStatus;
  createdBy: UserSummary;
  reminders: EventReminder[];
  createdAt: string;
  updatedAt: string;
}

export interface AppNotification {
  id: string;
  communityId?: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  dataJson?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminDashboard {
  totalMembers: number;
  pendingAccessRequests: number;
  pendingPostApprovals: number;
  upcomingEvents: number;
  recentPostsCount: number;
  notificationsCount: number;
  blockedUsers: number;
  community: CommunitySummary;
  pendingRequests: AccessRequest[];
  pendingPosts: CommunityPost[];
  upcomingEventPreview: CommunityEvent[];
  recentPosts: CommunityPost[];
}

export interface MemberDashboard {
  community: CommunitySummary;
  feedPreview: CommunityPost[];
  upcomingEvents: CommunityEvent[];
  calendarReminders: CommunityEvent[];
  announcements: CommunityPost[];
  myPostsStatus: CommunityPost[];
  notificationsCount: number;
  notifications: AppNotification[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PageResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: "Bearer";
  expiresAt: string;
  user: UserSummary;
}
