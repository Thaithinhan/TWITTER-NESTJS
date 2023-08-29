
import BaseAxios from '../API/axiosConfig';

// GET USER BY ID FROM API
export const fetchUserById = async (id: string | undefined) => {
    //Fetch User Profile
    try {
        const response = await BaseAxios.get(
            `/api/v1/users/${id}`
        );
        const user = response.data.user;
        return user;
    } catch (error) {
        console.error("Error fetching user:", error);
        throw error;
    }
};

//FETCH USER CURRENT FROM API
export const fetchCurrentUser = async () => {

    try {
        const response = await BaseAxios.get("/api/v1/users/current-user");
        return response.data.user;
    } catch (error) {
        console.error("Error fetching current user:", error);
    }
};

//Update current user
export const fetchUpdateUser = async (formData: FormData) => {
    try {
        const token = localStorage.getItem("accessToken") || "";
        if (!token) {
            throw new Error("No token found");
        }
        const response = await BaseAxios.patch(
            "/api/v1/users/update-user",
            formData
        );

        if (response.status === 200) {
            return response.data.user;
        }

    } catch (error) {
        console.error("There was an error updating the user profile:", error);
    }
}

//GET ALL RELEVANT TWEETS
export const getRelevantTweets = async () => {
    try {
        const response = await BaseAxios.get('/api/v1/tweets');
        return response.data.tweets;
    } catch (error) {
        console.error("Error fetching relevant tweets:", error);
        throw new Error("Failed to fetch relevant tweets");
    }
};

export const postNewTweet = async (data: { content: string, images: File[] }) => {
    try {
        const formData = new FormData();
        formData.append('content', data.content);
        data.images.forEach(image => {
            formData.append('images', image);
        });

        const response = await BaseAxios.post('/api/v1/tweets', formData);
        return response.data;
    } catch (error) {
        console.error("Error posting new tweet:", error);
        throw new Error("Failed to post new tweet");
    }
};

//CHECK FOLLOWING CỦA CURRENT USER
export const checkFollowing = async (tweetAuthorId: string) => {
    try {
        const response = await BaseAxios.get(`/api/v1/follow/checkFollow/${tweetAuthorId}`);
        return response.data.isFollowing
    } catch (error) {
        console.log("Error checking if following:", error);
    }
};