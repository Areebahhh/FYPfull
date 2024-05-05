import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import axios from "axios";
import { AuthContext } from "../../context/authContext";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import "./searchBarConvo.scss";

function SearchBarConvo() {

  const { currentUser } = useContext(AuthContext);

  const [input, setInput] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (value) => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8800/api/users/all");
      if (response && response.data && response.data.length > 0) {
        if (value) {
          const filteredData = response.data.filter((user) =>
            user.name.toLowerCase().includes(value.toLowerCase())
          );
          setData(filteredData);
        } else {
          setData(response.data);
        }
      } else {
        setData([]);
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (value) => {
    setInput(value);
    if (!value) {
      setData([]);
    } else {
      fetchData(value);
    }
  };






  // const handleCreateConversation = async (receiverId) => {
  //   try {
  //     await axios.post(`http://localhost:8800/api/conversations?senderId=${currentUser.id}&receiverId=${receiverId}`);
  //   } catch (error) {
  //     console.error("Error creating conversation:", error);

  //   }
  // };


  const queryClient = useQueryClient();

    const userId = currentUser.id;

  //for rejecting an application by useQueryClient
  const createConvoMutation = useMutation({
    mutationFn: ({ userId , receiverId }) => makeRequest.post(`http://localhost:8800/api/conversations?senderId=${userId}&receiverId=${receiverId}`),
    onSuccess: () => {
      console.log("Success");
      queryClient.invalidateQueries(["conversations"]);
    },
  });
  
  //for rejecting an application by removing the entry from the appliedjobs table
  const handleCreateConversation = (userId, receiverId) => {
    console.log(userId, receiverId);
    createConvoMutation.mutate({ userId, receiverId });
  };



  return (
    <div className="searchBar">
      <div className="search">
        <SearchOutlinedIcon />
        <input
          type="text"
          placeholder="Search..."
          className="chatMenuInput"
          value={input}
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>

      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      <div className="user-list">
        {data
          .filter((user) => user.id !== currentUser.id)
          .map((user) => (
            // <Link key={user.id} to={`/profile/${user.id}`}>
            <div>
              <span onClick={() => {
                
                handleCreateConversation(currentUser.id,user.id)
                setInput("");

              }}> {user.name}</span>
            </div>
            // </Link>
          ))}
      </div>
    </div>
  );
}

export default SearchBarConvo;
