import React, { useEffect, useState } from "react";
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore'
import "firebase/compat/storage";


import axios from "axios";
import { Row, Col } from "react-bootstrap";
import Loader from "./Loader";
import Paginate from "./Paginate";
import { FaCamera } from "react-icons/fa";
import "../css/Giphy.css";
import { useStore } from "../Contextapi";

const Giphy = ({ handleClose }) => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  // const [image, setImage] = useState("");
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const { image, setImage } = useStore();
  //page 1 item 1 - item 25
  //page 2 item 26 - item 50
  //page 3 item 51 - item 75

  const items = [
    { name: "House Party" },
    { name: "Birthday" },
    { name: "Theme Party" },
    { name: "Night Out" },
    { name: "Dinner Party" },
    { name: "Wedding" },
    { name: "Bachelorette" },
    { name: "Kickback" },
    { name: "Happy Hour" },
    { name: "Holiday" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);

      try {
        const results = await axios(
          "https://api.giphy.com/v1/gifs/search?api_key=a9F64WVAew3LF1qnViqbvB10hOMMlzww&q=party&limit=100&offset=0&rating=g&lang=en"
        );

        setData(results.data.data);
      } catch (err) {
        setIsError(true);
        setTimeout(() => setIsError(false), 4000);
      }

      setIsLoading(false);
    };

    fetchData();
  }, []);

  const handleFileUpload = async (e) => {
    await setImage(window.URL.createObjectURL(e.target.files[0]));
    if (e.target.files) {

      let uniqueKey = (Math.random() + 1).toString(36).substring(7);
      if (e.target.files[0]) {
        const file = e.target.files[0];
        var storageRef = firebase.storage().ref("events/" + uniqueKey);
        var uploadTask = storageRef.put(file);
        uploadTask.on(
          "state_changed",
          () => { },
          (error) => {
            alert(error);
          },
          () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
              console.log(downloadURL)
              setImage(downloadURL);

            });
          }
        );
      }

      e.target.files = null;

    }

    handleClose();
  };

  const renderGifs = () => {
    if (isLoading) {
      return <Loader />;
    }

    //handleFileUpload

    return currentItems.map((el) => {
      return (
        <div
          key={el.id}
          className="gif"
          onClick={async () => {
            await setImage(el.images.downsized.url);
            handleClose();
          }}
        >
          <img src={el.images.fixed_height.url} alt="something" />
        </div>
      );
    });
  };
  const renderError = () => {
    if (isError) {
      return (
        <div className="alert alert-danger alert-dismissible fade show">
          Unable to get Gifs, please try again in a few minutes
        </div>
      );
    }
  };

  const handleTagSearch = (name) => {
    setSearch(name);
    handleSubmit();
  };
  // const handleSearchChange = (event) => {
  //   setSearch(event.target.value);
  // };

  const handleSubmit = async () => {
    setIsError(false);
    setIsLoading(true);

    try {
      const results =
        await axios(`https://api.giphy.com/v1/gifs/search?api_key=a9F64WVAew3LF1qnViqbvB10hOMMlzww&q=${search}&limit=25&offset=0&rating=g&lang=en
      `);
      setData(results.data.data);
    } catch (err) {
      setIsError(true);
      setTimeout(() => setIsError(false), 4000);
    }

    setIsLoading(false);
  };

  // const pageSelected = (pageNumber) => {
  //   setCurrentPage(pageNumber);
  // };

  return (
    <div className="m-2">
      <div>
        <input
          accept="image/gif, image/jpeg, image/png"
          id="icon-button-file"
          type="file"
          style={{ display: "none" }}
          onChange={(e) => handleFileUpload(e)}
        />
        <label
          htmlFor="icon-button-file"
          className="d-flex justify-content-center"
        >
          <div className="d-flex align-items-center uploadBtn">
            <div>
              <FaCamera className="fs-4 text-white" />
            </div>

            <div>
              <p className="mt-3 fs-4 text-white mx-2">
                Upload event cover art
              </p>
            </div>
          </div>
        </label>

        <Row>
          <Col className="justify-content-around my-5">
            <div>
              {items.map((i, k) => {
                return (
                  <div
                    className="badge badge-pill badge-primary badge-btn text"
                    key={k}
                    onClick={() => handleTagSearch(i.name)}
                  >
                    {i.name}
                  </div>
                );
              })}
            </div>
          </Col>
        </Row>
      </div>
      {renderError()}

      <div className="container gifs">{renderGifs()}</div>
    </div>
  );
};

export default Giphy;
