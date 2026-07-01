import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { ErrorState } from "../../components/ui/ErrorState";
import { Input } from "../../components/ui/Input";
import { LoadingState } from "../../components/ui/LoadingState";
import { Select } from "../../components/ui/Select";
import { Textarea } from "../../components/ui/Textarea";
import { routes } from "../../constants/routes";
import { getApiError } from "../../services/api";
import { postService } from "../../services/post.service";
import { usePrimaryCommunity } from "./hooks";

export function CreatePostPage() {
  const navigate = useNavigate();
  const { community, approved, loading, error, reload } = usePrimaryCommunity();
  const [form, setForm] = useState({ postType: "GENERAL", title: "", content: "", mediaUrl: "" });
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!community) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      await postService.create({ communityId: community.id, ...form, mediaUrl: form.mediaUrl || undefined });
      navigate(routes.myPosts);
    } catch (err) {
      setSubmitError(getApiError(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!approved || !community) return <ErrorState message="Community access is not approved yet. Request access before creating posts." onRetry={reload} />;
  return (
    <Card>
      <h1>Create Post</h1>
      <p className="muted">Your post will be visible after admin approval.</p>
      <form className="form-grid" onSubmit={submit}>
        <Select label="Post Category" value={form.postType} onChange={(e) => setForm({ ...form, postType: e.target.value })} options={["ANNOUNCEMENT", "GENERAL", "EVENT_UPDATE", "NEWS", "BIRTHDAY_WISHES", "DONATION_SUPPORT_REQUEST"].map((value) => ({ label: value.replace(/_/g, " "), value }))} />
        <Input label="Post Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <Textarea label="Content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
        <Input label="Optional media URL" value={form.mediaUrl} placeholder="https://example.com/photo.jpg" onChange={(e) => setForm({ ...form, mediaUrl: e.target.value })} />
        {submitError && <ErrorState message={submitError} />}
        <Button type="submit" disabled={submitting}>{submitting ? "Submitting..." : "Submit for Approval"}</Button>
      </form>
    </Card>
  );
}
