import { useEffect, useState } from "react";
import { PostCard } from "../../components/cards/PostCard";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";
import { LoadingState } from "../../components/ui/LoadingState";
import { getApiError, pageItems } from "../../services/api";
import { Post, postService } from "../../services/post.service";

export function MyPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  async function load() {
    setLoading(true);
    try { setPosts(pageItems(await postService.my())); } catch (err) { setError(getApiError(err)); } finally { setLoading(false); }
  }
  useEffect(() => { void load(); }, []);
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  return <section><div className="page-head"><h1>My Posts</h1></div>{posts.length ? <div className="grid grid-2">{posts.map((post) => <PostCard key={post.id} post={post} />)}</div> : <EmptyState title="No posts yet" message="Create your first post for approval." />}</section>;
}
