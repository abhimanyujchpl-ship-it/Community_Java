import { ApiResponse, CommunityPost, PostType } from "@/types";
import { api } from "./api";

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
    const response = await api.get<ApiResponse<CommunityPost[]>>(`/posts/feed/${communityId}`);
    return response.data.data;
  },
  mine: async () => {
    const response = await api.get<ApiResponse<CommunityPost[]>>("/posts/my");
    return response.data.data;
  },
  pending: async (communityId: string) => {
    const response = await api.get<ApiResponse<CommunityPost[]>>(`/posts/pending/${communityId}`);
    return response.data.data;
  },
  create: async (payload: CreatePostPayload) => {
    const response = await api.post<ApiResponse<CommunityPost>>("/posts", payload);
    return response.data.data;
  },
  details: async (postId: string) => {
    const response = await api.get<ApiResponse<CommunityPost>>(`/posts/${postId}`);
    return response.data.data;
  },
  update: async (postId: string, payload: UpdatePostPayload) => {
    const response = await api.patch<ApiResponse<CommunityPost>>(`/posts/${postId}`, payload);
    return response.data.data;
  },
  submit: async (postId: string) => {
    const response = await api.patch<ApiResponse<CommunityPost>>(`/posts/${postId}/submit`);
    return response.data.data;
  },
  approve: async (postId: string) => {
    const response = await api.patch<ApiResponse<CommunityPost>>(`/posts/${postId}/approve`);
    return response.data.data;
  },
  reject: async (postId: string, rejectionReason: string) => {
    const response = await api.patch<ApiResponse<CommunityPost>>(`/posts/${postId}/reject`, { rejectionReason });
    return response.data.data;
  },
  delete: async (postId: string) => {
    const response = await api.delete<ApiResponse<void>>(`/posts/${postId}`);
    return response.data.data;
  }
};
