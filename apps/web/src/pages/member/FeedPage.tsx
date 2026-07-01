import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PostCard } from "../../components/cards/PostCard";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";
import { LoadingState } from "../../components/ui/LoadingState";
import { routes } from "../../constants/routes";
import { getApiError, pageItems } from "../../services/api";
import { Post, postService } from "../../services/post.service";
import { usePrimaryCommunity } from "./hooks";

export function FeedPage() {
  const { community, approved, loading: communityLoading, error: communityError, reload } = usePrimaryCommunity();
  const [posts, setPosts] = useState<Post[]>([]);
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    if (!community) return;
    setLoading(true);
    setError("");
    try {
      setPosts(pageItems(await postService.feed(community.id, type || undefined)));
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, [community, type]);
  if (communityLoading) return <LoadingState />;
  if (communityError) return <ErrorState message={communityError} onRetry={reload} />;
  if (!approved || !community) return <ErrorState message="Community access is not approved yet. Request access before viewing the private feed." onRetry={reload} />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <section>
      <div className="page-head">
        <div><h1>Community Feed</h1><p className="muted">Approved posts only.</p></div>
        <Link to={routes.createPost}><Button type="button">Create Post</Button></Link>
      </div>
      <div className="filters">
        {["", "ANNOUNCEMENT", "GENERAL", "EVENT_UPDATE", "NEWS", "BIRTHDAY_WISHES", "DONATION_SUPPORT_REQUEST"].map((item) => (
          <button key={item || "ALL"} className={`chip ${type === item ? "active" : ""}`} onClick={() => setType(item)}>{item || "All"}</button>
        ))}
      </div>
      {loading ? <LoadingState /> : posts.length ? <div className="grid grid-2">{posts.map((post) => <PostCard key={post.id} post={post} />)}</div> : <EmptyState title="No approved posts" message="Approved posts will appear here." />}
    </section>
  );
}
