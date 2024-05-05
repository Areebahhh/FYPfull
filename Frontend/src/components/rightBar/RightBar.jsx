import "./rightBar.scss";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";
import { makeRequest } from "../../axios";
import { Link } from "react-router-dom";

const RightBar = () => {
  const { currentUser } = useContext(AuthContext);
  const userId = currentUser.id;

  const { isLoading, error, data } = useQuery({
    queryKey: ["SuggestedFriends"],
    queryFn: () => {
      return makeRequest
        .get(`/relationships/suggestedfriendsdata?userId=${currentUser.id}`)
        .then((res) => {
          return res.data;
        })
        .catch((error) => {
          throw error; // This makes sure errors are handled by `error` in useQuery.
        });
    },
  });

  // For fetching users our current user is FOLLOWING
  const {
    isLoading: FollowingisLoading,
    error: Followingerror,
    data: Followingdata,
  } = useQuery({
    queryKey: ["Following"],
    queryFn: () => {
      return makeRequest

        .get(`/relationships/friendsdata?userId=${currentUser.id}`)
        .then((res) => {
          return res.data;
        })
        .catch((error) => {
          throw error; // This makes sure errors are handled by `error` in useQuery.
        });
    },
  });

  // For fetching users who are FOLLOWING our current user
  //Followers data
  const {
    isLoading: FollowersisLoading,
    error: Followerserror,
    data: Followersdata,
  } = useQuery({
    queryKey: ["Followers"],
    queryFn: () => {
      return makeRequest

        .get(`/relationships/followersdata?userId=${currentUser.id}`)
        .then((res) => {
          return res.data;
        })
        .catch((error) => {
          throw error; // This makes sure errors are handled by `error` in useQuery.
        });
    },
  });

  return (
    <div className="rightBar">
      <div className="container">
        {/* Show a message or loading indicator if  sugessted friends data is loading or not available */}
        {isLoading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}

        {/* Display suggested friends or a message if there are none */}
        {!isLoading && !error && (
          <>
            <div className="item">
              <span>Suggestions For You</span>
              {Array.isArray(data) && data.length > 0 ? (
                // Map suggested friends if data exists
                data.map((friend) => (
                  <div className="user" key={friend.id}>
                    <div className="userInfo">
                      <img
                        src={"/upload/" + friend.profilePic}
                        alt={friend.username}
                      />

                      <Link
                        to={`/profile/${friend.id}`}
                        //to={'/profile/'}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <span>{friend.username}</span>
                      </Link>
                    </div>
                    {/* Render FollowButton component and pass the userId */}
                    <FollowButton userId={friend.id} />
                  </div>
                ))
              ) : (
                // Display a message if there are no suggested friends
                <div className="item">
                  {/* <span>Suggestions For You</span> */}

                  <p>Currently no suggested friends for you.</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Show a message or loading indicator if following data is loading or not available */}
        {FollowingisLoading && <p>Loading...</p>}
        {Followingerror && <p>Error: {Followingerror.message}</p>}

        {/* {console.log(" following Friends:", Followingdata)}
        {console.log(Followingerror)} */}

        {/* Display following friends or a message if there are none */}
        {!FollowingisLoading && !Followingerror && (
          <>
            <div className="item">
              <span>Your Following</span>
              {Array.isArray(Followingdata) && Followingdata.length > 0 ? (
                // Map following friends if data exists
                Followingdata.map((MyFollowing) => (
                  <div className="user" key={MyFollowing.id}>
                    <div className="userInfo">
                      <img
                        src={"/upload/" + MyFollowing.profilePic}
                        alt={MyFollowing.username}
                      />

                      <Link
                        to={`/profile/${MyFollowing.id}`}
                        //to={'/profile/'}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <span>{MyFollowing.username}</span>
                      </Link>
                    </div>
                    {/* Render FollowButton component and pass the userId */}
                    <FollowButton userId={MyFollowing.id} />
                  </div>
                ))
              ) : (
                // Display a message if there are no following friends
                <div className="item">
                  {/* <span>Your Friends</span> */}

                  <p>You are not following anyone. Please follow some.</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Show a message or loading indicator if followers data is loading or not available */}
        {FollowersisLoading && <p>Loading...</p>}
        {Followerserror && <p>Error: {Followerserror.message}</p>}
        {/* {console.log(" followers Friends:", Followersdata)}
        {console.log(Followerserror)} */}

        {/* Display followers of the current user or a message if there are none */}
        {!FollowersisLoading && !Followerserror && (
          <>
            <div className="item">
              <span>Your Followers</span>
              {Array.isArray(Followersdata) && Followersdata.length > 0 ? (
                // Map followers of the current user if data exists
                Followersdata.map((MyFollowers) => (
                  <div className="user" key={MyFollowers.id}>
                    <div className="userInfo">
                      <img
                        src={"/upload/" + MyFollowers.profilePic}
                        alt={MyFollowers.username}
                      />

                      <Link
                        to={`/profile/${MyFollowers.id}`}
                        //to={'/profile/'}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <span>{MyFollowers.username}</span>
                      </Link>
                    </div>
                    {/* Render FollowButton component and pass the userId */}
                    <FollowButton userId={MyFollowers.id} />
                  </div>
                ))
              ) : (
                // Display a message if there are no followers of the current user
                <div className="item">
                 

                  <p>You are not followed anyone Currently.</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Other items */}
        <div className="item">
          <span>Online Friends</span>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt=""
              />
              <div className="online" />
              <span>Jane Doe</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FollowButton = ({ userId }) => {
  const { currentUser } = useContext(AuthContext);

  // For following and unfollowing
  const {
    isLoading: rIsLoading,
    error: rError,
    data: relationshipData,
  } = useQuery({
    queryKey: ["relationship", userId],
    queryFn: () =>
      makeRequest
        .get(`/relationships?followeduserid=${userId}`)
        .then((res) => res.data),
    onError: (error) => {
      console.error("Error fetching relationship data:", error);
    },
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (isFollowing) => {
      // Use the isFollowing flag to decide between follow and unfollow actions
      if (isFollowing) {
        return makeRequest.delete(`/relationships?userId=${userId}`);
      } else {
        return makeRequest.post("/relationships", { userId });
      }
    },
    onSuccess: () => {
      // Invalidate and refetch relationship data to reflect the change
      queryClient.invalidateQueries(["relationship"]);
    },
  });

  const handleFollow = () => {
    // Determine if the current user is already followed by checking if their ID is included in relationshipData
    mutation.mutate(relationshipData.includes(currentUser.id));
  };

  const isFollowing =
    relationshipData && relationshipData.includes(currentUser.id);

  return (
    <div className="buttons">
      {rIsLoading ? (
        "Loading..."
      ) : (
        <button onClick={handleFollow}>
          {isFollowing ? "Following" : "Follow"}
        </button>
      )}
    </div>
  );
};

export default RightBar;
