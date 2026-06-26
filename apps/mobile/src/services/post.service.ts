import { ApiResponse, CommunityPost, PageResponse, PostType } from "@/types";
import { api, unwrapData, unwrapPageItems, unwrapRequired } from "./api";

export interface CreatePostPayload {
  communityId: string;
  postType: PostType;
  title: string;
  content: string;
  mediaUrl?: string;
}

export type UpdatePostPayload = Partial<Omit<CreatePostPayload, "communityId">>;

export const postService = {
  feed: async (communityId: string) => {
    const response = await api.get<ApiResponse<PageResponse<CommunityPost>>>(`/posts/feed/${communityId}`);
    return unwrapPageItems(response.data);
  },
  mine: async () => {
    const response = await api.get<ApiResponse<PageResponse<CommunityPost>>>("/posts/my");
    return unwrapPageItems(response.data);
  },
  pending: async (communityId: string) => {
    const response = await api.get<ApiResponse<PageResponse<CommunityPost>>>(`/posts/pending/${communityId}`);
    return unwrapPageItems(response.data);
  },
  create: async (payload: CreatePostPayload) => {
    const response = await api.post<ApiResponse<CommunityPost>>("/posts", payload);
    return unwrapRequired(response.data, "Created post response was empty");
  },
  details: async (postId: string) => {
    const response = await api.get<ApiResponse<CommunityPost>>(`/posts/${postId}`);
    return unwrapRequired(response.data, "Post response was empty");
  },
  update: async (postId: string, payload: UpdatePostPayload) => {
    const response = await api.patch<ApiResponse<CommunityPost>>(`/posts/${postId}`, payload);
    return unwrapRequired(response.data, "Updated post response was empty");
  },
  submit: async (postId: string) => {
    const response = await api.patch<ApiResponse<CommunityPost>>(`/posts/${postId}/submit`);
    return unwrapRequired(response.data, "Submitted post response was empty");
  },
  approve: async (postId: string) => {
    const response = await api.patch<ApiResponse<CommunityPost>>(`/posts/${postId}/approve`);
    return unwrapRequired(response.data, "Approved post response was empty");
  },
  reject: async (postId: string, rejectionReason: string) => {
    const response = await api.patch<ApiResponse<CommunityPost>>(`/posts/${postId}/reject`, { rejectionReason });
    return unwrapRequired(response.data, "Rejected post response was empty");
  },
  delete: async (postId: string) => {
    const response = await api.delete<ApiResponse<void>>(`/posts/${postId}`);
    return unwrapData(response.data, undefined);
  }
};
