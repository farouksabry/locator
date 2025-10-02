import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import axiosInstance from "../../api/axiosInstance";
import Post from "../Post/Post";
import styles from "./Profile.module.css";
import Avatar from '@mui/material/Avatar';
import { blue } from '@mui/material/colors';

export default function Profile() {
    const { user } = useContext(AuthContext);
    const [posts, setPosts] = useState(null);
    const [error, setError] = useState("");
    const [pageDetails, setPageDetails] = useState({
        "page_number": 1,
        "pages_count": 1,
    })

    const fetch_posts = async () => {
        try {
            const response = await axiosInstance.get("/api/posts/profile/", {
                withCredentials: true,
                params: {
                    profile: true,
                    page_number: pageDetails.page_number,
                    pages_count: pageDetails.pages_count,
                }
            });

            setPageDetails({
                "page_number": parseInt(response.data.page_number) + 1,
                "pages_count": parseInt(response.data.pages_count),
            });

            if (posts)
                setPosts([...posts, ...response.data.posts]);
            else
                setPosts(response.data.posts);

        } catch (error) {
            if (error.response) {
                setError(error.response.error);
            }
        }
    }

    useEffect(() => {
        fetch_posts();
    }, []);

    return (
        <div className="container mt-5">
            {/* Profile Header */}
            <div className="card shadow-sm mb-4 border-0 text-center p-4 bg-light">
                <div className="d-flex flex-column align-items-center">
                    <Avatar className="mb-3" sx={{ width: 100, height: 100, bgcolor: blue[500], fontSize: 36 }}>
                        {user.first_name[0].toUpperCase()}{user.last_name[0].toUpperCase()}
                    </Avatar>
                    <p className="text-muted small mb-2">@{user.username}</p>
                    <div className="d-flex gap-4">
                        <span className="fw-bold">{posts?.length || 0} {posts?.length > 1 ? "Posts" : "Post"}</span>
                    </div>
                </div>
            </div>

            {/* Error Alert */}
            {error && <div className="alert alert-danger">{error}</div>}

            {/* Posts Section */}
            <div className="d-flex flex-column align-items-center">
                {posts === null ? (
                    <p>Loading posts...</p>
                ) : posts.length === 0 ? (
                    <p>No posts available.</p>
                ) : (
                    <>
                        {posts.map((post) => (
                            <div className="w-75 mb-3" key={post.id}>
                                <Post post={post} />
                            </div>
                        ))}
                        {pageDetails.page_number <= pageDetails.pages_count && (
                            <div className="d-flex justify-content-center w-100 mb-5">
                                <button type="button" className="btn btn-light mt-3 w-25 mb-5" onClick={fetch_posts}>Load more</button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
