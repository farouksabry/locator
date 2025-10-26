import dayjs from 'dayjs';
import { MdOutlineModeComment } from "react-icons/md";
import { useContext, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { AuthContext } from '../../context/AuthContext';
import { getCsrfToken } from '../../utils/csrf';
import { Link } from 'react-router';

export default function Post({ post }) {
    const { user } = useContext(AuthContext);
    const [comment, setComment] = useState("");
    const [showComment, setShowComment] = useState(false);
    const [postToView, setPostToView] = useState(post)

    // Post comment
    const handleChange = (e) => {
        setComment(e.target.value);
    };

    const submitComment = async (e, postId) => {
        e.preventDefault();
        const csrf = await getCsrfToken();

        try {
            const response = await axiosInstance.post("/api/comment/",
                {
                    comment: comment,
                    user: user.id,
                    post: postId,
                },
                {
                    withCredentials: true,
                    headers: {
                        'X-CSRFToken': csrf,
                    }
                }
            );

            setPostToView(response.data)
            setComment("");
            setShowComment(false);
        } catch {
            console.error("Error adding comment.")
        }
    };

    return (
        <div key={postToView.id} className="card mb-4 shadow-sm border-0">
            <div className="card-body">
                <h5 className='mb-3'><Link className='link-text' to={`/profile/${postToView.user.slug}/`}>{postToView.user.first_name} {postToView.user.last_name}</Link></h5>
                <p className="card-text fs-6">{postToView.post}</p>
                <div className="text-muted small mb-2">
                    Posted on {dayjs(postToView.created_at).format('ddd, MMM D, YYYY h:mm A')}
                </div>
                <button
                    className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-2"
                    onClick={() => setShowComment(!showComment)}
                >
                    <MdOutlineModeComment size={18} />
                    {showComment ? "Hide Comments" : "View / Add Comments"}
                </button>
                {showComment && (
                    <div className="mt-3">
                        {/* Comment Form */}
                        <form className="mb-3" onSubmit={(e) => submitComment(e, postToView.id)}>
                            <div className="input-group mb-2">
                                <textarea className="form-control" rows="2" value={comment} onChange={handleChange} placeholder="Write a comment..." />
                            </div>
                            <div className="d-flex gap-2">
                                <button type="submit" className="btn btn-outline-secondary btn-sm">
                                    Comment
                                </button>
                                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowComment(false)}>
                                    Cancel
                                </button>
                            </div>
                        </form>

                        {/* Comment List */}
                        {postToView.comments.length > 0 ? (
                            postToView.comments.map((c) => (
                                <div key={c.id} className="card border-0 bg-light mb-2">
                                    <div className="card-body py-2">
                                        <p className="mb-1">{c.comment}</p>
                                        <div className="text-muted small">
                                            By <Link to={`/profile/${c.user.slug}/`}>{c.user.first_name} {c.user.last_name}</Link> on{" "}
                                            {dayjs(c.created_at).format('ddd, MMM D, YYYY h:mm A')}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-muted small">No comments yet.</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
