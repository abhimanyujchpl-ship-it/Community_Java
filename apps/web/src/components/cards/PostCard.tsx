import { ReactNode } from "react";
import { Post } from "../../services/post.service";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";
import "./cards.css";

export function PostCard({ post, actions }: { post: Post; actions?: ReactNode }) {
  const tone = post.status === "APPROVED" ? "success" : post.status === "REJECTED" ? "danger" : "warning";
  return (
    <Card className="post-card">
      <div className="post-head">
        <div className="avatar">{post.author?.fullName?.slice(0, 1) || "M"}</div>
        <div>
          <strong>{post.author?.fullName || "Community member"}</strong>
          <p>{post.createdAt ? new Date(post.createdAt).toLocaleString() : "Just now"}</p>
        </div>
        <Badge tone={tone}>{post.status}</Badge>
      </div>
      <Badge>{post.postType}</Badge>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      {post.rejectionReason && <p className="rejection">Reason: {post.rejectionReason}</p>}
      <div className="post-actions">
        <span>Like</span>
        <span>Comment</span>
      </div>
      {actions && <div className="actions">{actions}</div>}
    </Card>
  );
}
