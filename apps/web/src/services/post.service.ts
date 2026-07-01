import { api, ApiResponse, PageResponse, unwrap } from "./api";
import { ENABLE_DEMO_MODE } from "../constants/config";
import { demoData } from "./demoData";

export type Post = {
  id: string;
  title: string;
  content: string;
  postType: string;
  status: string;
  rejectionReason?: string;
  createdAt?: string;
  author?: { fullName?: string; email?: string };
  community?: { id: string; name: string };
};

export const postService = {
  create: async (payload: { communityId: string; postType: string; title: string; content: string; mediaUrl?: string }) => {
    try {
      return unwrap((await api.post<ApiResponse<Post>>("/posts", payload)).data);
    } catch (error) {
      if (ENABLE_DEMO_MODE) return demoData.posts.create(payload);
      throw error;
    }
  },
  feed: async (communityId: string, postType?: string) => {
    try {
      return unwrap((await api.get<ApiResponse<PageResponse<Post>>>(`/posts/feed/${communityId}`, { params: { postType } })).data);
    } catch (error) {
      if (ENABLE_DEMO_MODE) return demoData.posts.feed(communityId, postType);
      throw error;
    }
  },
  my: async () => {
    try {
      return unwrap((await api.get<ApiResponse<PageResponse<Post>>>("/posts/my")).data);
    } catch (error) {
      if (ENABLE_DEMO_MODE) return demoData.posts.my();
      throw error;
    }
  },
  pending: async (communityId: string) => {
    try {
      return unwrap((await api.get<ApiResponse<PageResponse<Post>>>(`/posts/pending/${communityId}`)).data);
    } catch (error) {
      if (ENABLE_DEMO_MODE) return demoData.posts.pending(communityId);
      throw error;
    }
  },
  approve: async (id: string) => {
    try {
      return unwrap((await api.patch<ApiResponse<Post>>(`/posts/${id}/approve`)).data);
    } catch (error) {
      if (ENABLE_DEMO_MODE) return demoData.posts.approve(id);
      throw error;
    }
  },
  reject: async (id: string, rejectionReason: string) => {
    try {
      return unwrap((await api.patch<ApiResponse<Post>>(`/posts/${id}/reject`, { rejectionReason })).data);
    } catch (error) {
      if (ENABLE_DEMO_MODE) return demoData.posts.reject(id, rejectionReason);
      throw error;
    }
  }
};
