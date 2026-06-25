import { Image, Pressable, Text, View } from "react-native";
import { StatusBadge } from "@/components/common/StatusBadge";
import { UserAvatar } from "@/components/common/UserAvatar";
import { CommunityPost } from "@/types";
import { postStatusTone, postTypeLabel } from "@/utils/postStatus";

interface PostCardProps {
  post: CommunityPost;
  onPress?: () => void;
  showStatus?: boolean;
}

export function PostCard({ post, onPress, showStatus = true }: PostCardProps) {
  return (
    <Pressable className="rounded-xl border border-border bg-white p-4" onPress={onPress}>
      <View className="flex-row gap-3">
        <UserAvatar name={post.author.fullName} />
        <View className="flex-1">
          <View className="flex-row items-start justify-between gap-3">
            <View className="flex-1">
              <Text className="text-base font-bold text-textDark">{post.author.fullName}</Text>
              <Text className="mt-0.5 text-xs text-textGrey">{new Date(post.createdAt).toLocaleString()}</Text>
            </View>
            {showStatus ? <StatusBadge label={post.status} tone={postStatusTone(post.status)} /> : null}
          </View>
          <View className="mt-3 self-start">
            <StatusBadge label={postTypeLabel(post.postType)} tone="neutral" />
          </View>
          <Text className="mt-3 text-lg font-bold text-textDark">{post.title}</Text>
          <Text className="mt-2 text-sm leading-5 text-textDark">{post.content}</Text>
          {post.mediaUrl ? <Image source={{ uri: post.mediaUrl }} className="mt-3 h-48 rounded-xl bg-lightBackground" /> : null}
          {post.rejectionReason ? <Text className="mt-3 text-sm font-medium text-danger">{post.rejectionReason}</Text> : null}
        </View>
      </View>
    </Pressable>
  );
}
