import { useEffect, useState } from "react";
import { PostCard } from "../../components/cards/PostCard";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";
import { LoadingState } from "../../components/ui/LoadingState";
import { Modal } from "../../components/ui/Modal";
import { Textarea } from "../../components/ui/Textarea";
import { getApiError, pageItems } from "../../services/api";
import { communityService } from "../../services/community.service";
import { Post, postService } from "../../services/post.service";

export function PostApprovalsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [rejecting, setRejecting] = useState<Post | null>(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  async function load() {
    setLoading(true);
    try {
      const community = pageItems(await communityService.list())[0];
      setPosts(community ? pageItems(await postService.pending(community.id)) : []);
    } catch (err) { setError(getApiError(err)); } finally { setLoading(false); }
  }
  async function approve(id: string) { await postService.approve(id); await load(); }
  async function reject() { if (!rejecting) return; await postService.reject(rejecting.id, reason); setRejecting(null); setReason(""); await load(); }
  useEffect(() => { void load(); }, []);
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  return <section><div className="page-head"><h1>Post Approvals</h1></div>{posts.length ? <div className="grid grid-2">{posts.map((post) => <PostCard key={post.id} post={post} actions={<><Button type="button" onClick={() => approve(post.id)}>Approve</Button><Button type="button" variant="danger" onClick={() => setRejecting(post)}>Reject</Button></>} />)}</div> : <EmptyState title="No pending posts" message="Posts awaiting approval will appear here." />}{rejecting && <Modal title="Reject post" onClose={() => setRejecting(null)}><div className="form-grid"><Textarea label="Rejection reason" value={reason} onChange={(e) => setReason(e.target.value)} /><Button type="button" variant="danger" onClick={reject}>Reject</Button></div></Modal>}</section>;
}
