import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { LocationsContext } from "../../context/LocationsContext";
import axiosInstance from "../../api/axiosInstance";
import Post from "../Post/Post";
import { getCsrfToken } from "../../utils/csrf";
import banner from "@/assets/images/banner.png"
import styles from "./Home.module.css"

export default function Home() {
    const [error, setError] = useState("")
    const { countries, regions } = useContext(LocationsContext);
    const { user } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [postsCountry, setPostsCountry] = useState(null);
    const [postsRegion, setPostsRegion] = useState(null);

    // State to check whether location is being changed in order to toggle the div
    const [changingLocation, setChangingLocation] = useState(false);

    // State to hold the new location when user changes the location
    const [newLocationData, setNewLocationData] = useState({
        'newCountry': null,
        'newRegions': null,
        'regionSelected': null,
    });

    // State to hold current page number and pages count to be used in pagination
    const [pageDetails, setPageDetails] = useState({
        pageNumber: 1,
        pagesCount: 1,
    });

    // State to handle new post parameters
    const [newPostBody, setNewPostBody] = useState("")

    // Handle New post when changing
    const handleNewPost = (e) => {
        setNewPostBody(e.target.value);
    };

    // Creating a new post
    const newPost = async (e) => {
        e.preventDefault();

        // Check if new post is empty
        if (newPostBody === "") {
            setError("New post cannot be empty.");
            return;
        }

        const csrf = getCsrfToken();
        try {
            await axiosInstance.post("/api/posts/", {
                post: newPostBody,
                user: user.id,
                country: postsCountry.id,
                region: postsRegion.id ? postsRegion.id : null,
            }, {
                withCredentials: true,
                headers: {
                    'X-CSRFToken': csrf,
                }
            });

            setNewPostBody("");

            // Fetch posts after adding posts
            fetch_posts(postsCountry.id, postsRegion ? postsRegion.id : null, null);
        } catch (error) {
            setError(error.response.data.error);
        }
    };

    // Api to fetch posts
    const fetch_posts = async (country, region, existingPosts) => {
        try {
            // Fetching posts related to the current page number used in pagination
            const all_posts = await axiosInstance.get("/api/posts/", {
                withCredentials: true,
                params: {
                    country: country,
                    region: region,
                    page_number: pageDetails.pageNumber,
                    reset_posts: existingPosts === null ? true : false,
                }
            });

            // Update pagination details
            setPageDetails({
                pageNumber: parseInt(all_posts.data.page_number) + 1,
                pagesCount: parseInt(all_posts.data.pages_count),
            });

            setPostsCountry(all_posts.data.posts_country);
            setPostsRegion(all_posts.data.posts_region);

            // Update posts
            if (existingPosts)
                setPosts([...existingPosts, ...all_posts.data.posts]);
            else
                setPosts(all_posts.data.posts);

            // Reset new location data if location was changed
            if (newLocationData.newCountry || newLocationData.regionSelected) {
                setNewLocationData({
                    'newCountry': null,
                    'newRegions': null,
                    'regionSelected': null,
                });

                // Close filter div
                toggleChangingLocation();
            }
        } catch (error) {
            if (error.response)
                setError(error.response.data.error);
        }
    }

    // Api to fetch posts related to the current region and country first time component was loaded
    useEffect(() => {
        fetch_posts(postsCountry, postsRegion, null);
    }, []);

    // If the user started to change posts country to filter posts
    const toggleChangingLocation = () => {
        setChangingLocation(!changingLocation);
    };

    // Get the new country selected
    const handleNewLocation = (e) => {
        setNewLocationData(prev => ({
            ...prev,
            [e.target.name]: parseInt(e.target.value, 10),
        }));
    };

    // Filter regions every time new country is selected
    useEffect(() => {
        if (regions) {
            setNewLocationData(prev => ({
                ...prev,
                'newRegions': regions.filter((region) => region.country === newLocationData.newCountry),
            }));
        }
    }, [newLocationData.newCountry]);

    return (
        <>
            {posts === null && (
                <p>Loading posts...</p>
            )}

            {posts && regions && postsCountry && (
                <>
                    <div className="position-relative w-100 top-0">
                        <img className="w-100 object-fit-cover" height="500px" src={banner} alt="banner" />
                        <div className={`${styles.locationForm} position-absolute top-50 start-50 translate-middle p-3`}>
                            {changingLocation ?
                                <>
                                    <div className="row g-2 justify-content-center">
                                        <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                                            <select onChange={handleNewLocation} className="form-select" name="newCountry">
                                                <option value="">Select a country</option>
                                                {countries.map((country) => (
                                                    <option key={country.id} value={country.id}>{country.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-5 col-sm-6 col-md-3 col-lg-3 col-xl-3">
                                            <select onChange={handleNewLocation} className="form-select" name="regionSelected">
                                                <option value={null}>Select your city</option>
                                                {newLocationData.newCountry ?
                                                    newLocationData.newRegions?.map((region) => (
                                                        <option key={region.id} value={region.id}>{region.name}</option>
                                                    ))
                                                    :
                                                    ""
                                                }
                                            </select>
                                        </div>
                                        <div className="col-5 col-sm-4 col-md-3 col-lg-3 col-xl-3">
                                            <button onClick={() => fetch_posts(newLocationData.newCountry, newLocationData.regionSelected, null)} type="button" className="ms-2 btn btn-outline-secondary">Change Location</button>
                                        </div>
                                        <div className="col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2">
                                            <button onClick={toggleChangingLocation} type="button" className="btn btn-secondary">Cancel</button>
                                        </div>
                                    </div>
                                </>
                                :
                                <>
                                    You are now viewing posts in {postsRegion.id ? postsRegion.name + "," : ""} {postsCountry.name}
                                    <button onClick={toggleChangingLocation} type="button" className="mt-2 ms-2 btn btn-outline-secondary">Change location</button>
                                </>
                            }
                        </div>
                    </div>
                    {error && (
                        <div className="alert alert-danger" role="alert">{error}</div>
                    )}
                    <div className={`container position-relative `}>
                        <form className={styles.newPostForm} onSubmit={newPost}>
                            <div className="mb-3">
                                <div className="mb-3">
                                    <p>Looking for this something in this region ? Create a new post.</p>
                                </div>
                                <textarea onChange={handleNewPost} name="new-post" className="form-control" rows="4" placeholder="Write your post here" value={newPostBody}></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary mb-5">New Post</button>
                        </form>
                        {posts.map((post) => (
                            <Post key={post.id} post={post} />
                        ))}
                        {pageDetails.pageNumber <= pageDetails.pagesCount ? (
                            <div className="d-flex justify-content-center w-100 mb-5">
                                <button type="button" className="btn btn-light w-25" onClick={() => fetch_posts(postsCountry.id, postsRegion ? postsRegion.id : null, posts)}>Load more</button>
                            </div>
                        )
                            :
                            ""
                        }
                    </div>
                </>
            )}
        </>
    )
}
