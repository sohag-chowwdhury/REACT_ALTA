import React, { useEffect, useState } from "react";
import { Col, Container, Offcanvas, Row } from "react-bootstrap";
import { AiFillPicture, AiFillSafetyCertificate } from "react-icons/ai";
import Addons from "./Addons";
import EnterForm from "./EnterForm";
import ImageUpload from "./ImageUpload";
import "../css/Form.css";
import { FiSettings } from "react-icons/fi";
import AppSettings from "./AppSettings";
import { useStore } from "../Contextapi";
import { MapMarker, GMap, Card } from "react-rainbow-components";
import GoogleMap from "./GoogleMap";
import { db } from "../utility/firebase";
import moment from 'moment';

function Form() {
  //sidebar hooks

  const [disabled, setDisabled] = useState(true);

  const [submit, setSubmit] = useState(false);

  //password

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //invite code

  const {
    title,
    dj,
    address,
    spots,
    price,
    description,
    latitude,
    longitude,
    reload,
    setReload,
    isMaskRequired,
    isVaccineRequired,
    isWaitingList,
    limit,
    password,
    inviteCode,
    capacity,
    image,
    startDate,
    endDate,
    guestList,
  } = useStore();

  console.log(
    title,
    startDate,
    endDate,
    dj,
    address,
    spots,
    price,
    description,
    latitude,
    longitude,
    reload,
    setReload,
    isMaskRequired,
    isVaccineRequired,
    isWaitingList,
    limit,
    password,
    inviteCode,
    capacity,
    image,
    guestList
  );
  console.log("image", image)

  useEffect(() => {
    if (reload) {
      setReload(false);
    }
  }, [reload, setReload]);

  useEffect(() => {
    if (!title || !dj || !spots || !price || !description || !address) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [address, description, dj, price, spots, title]);
  const firebaseUpdate = () => {
    const data = {
      hostName: dj,
      isFree: true,
      isMaskRequerd: false,
      isVaxRequired: false,
      limit: limit,
      price: price,
      isGuestList: false,
      isWaitingList: false,
      passwordProtected: {
        isPassword: true,
        password: password
      },
      private: {
        isPrivate: true,
        inviteCode: inviteCode
      },
      name: title,
      inviteCode: inviteCode,
      startTime: startDate.value,
      formattedStartDate: moment(new Date(startDate.value)).format('L'),
      date: moment(new Date()).format('LL'),
      description: description,
      location: {
        latitude: latitude,
        longitude: longitude
      },
      venue: {
        address: address,
        photo: image
      },
      formattedEndDate: moment(new Date(endDate.value)).format('L'),
      endDate: endDate.value,
      photo: image

    }
    if (isMaskRequired === true) {
      data.isMaskRequerd = true
    }
    if (isVaccineRequired === true) {
      data.isVaxRequired = true
    }
    if (price !== 0) {
      data.isFree = false
    }
    if (password === "") {
      data.passwordProtected.isPassword = false
    }
    if (inviteCode === "") {
      data.private.isPrivate = false
    }
    if (isWaitingList === true) {
      data.isWaitingList = true
    }
    if (guestList === true) {
      data.isGuestList = true
    }

    db.collection("events").doc().set(data)
  }
  const postToFirebase = () => {
    if (!title || !dj || !spots || !price || !description || !address) {
      setDisabled(true);
      firebaseUpdate()
    } else {
      setSubmit(true);
      setDisabled(false);

    }
  };

  return (
    <Container className="mt-1 pt-5">
      <Row>
        <Col lg={6} sm={12} xs={12}>
          <EnterForm />
          <div className="my-2 d-flex align-items-center gap-2">
            <p className="text-white" style={{ fontSize: "30px" }}>
              <AiFillSafetyCertificate />
            </p>
            <p className="text-white" style={{ fontSize: "30px" }}>
              Covid-19 Settings
            </p>
          </div>
          <Addons></Addons>
        </Col>
        <Col lg={6} sm={12} xs={12}>
          <div style={{ width: "100%", backgroundColor: "white" }}>
            <div
              className="d-inline-flex align-items-center justify-content-center gap-2 settings"
              onClick={handleShow}
              style={{ width: "100%" }}
            >
              <div className="pb-1">
                <FiSettings />
              </div>
              <div> Configure Event Settings</div>
            </div>
          </div>
          {longitude && latitude ? <div style={{ width: "100%", marginTop: 25, marginBottom: 25 }}>
            <Card
              className="rainbow-m_auto"
              title="Map"
              // icon={ICON}
              style={{ width: "100%" }}
            >
              {!reload ? (
                <GoogleMap longitude={longitude} latitude={latitude} />
              ) : (
                ""
              )}
            </Card>
          </div> : ""}

          <div className="my-2 d-flex align-items-center gap-2">
            <p className="text-white" style={{ fontSize: "30px" }}>
              <AiFillPicture />
            </p>
            <p className="text-white" style={{ fontSize: "30px" }}>
              Edit Event Cover Art
            </p>
          </div>
          <ImageUpload />
          <br></br>
          <br></br>

          {/* //offcanvas setting */}
          <AppSettings show={show} handleClose={handleClose} />
        </Col>
      </Row>
      <br></br>
      {/* IF REQUIRED FORM FIELDS ARE COMPLETED (TITLE, DATE, # of spots, description) display publish button / hide at first */}
      <center>
        <button
          style={{
            border: "none",
            padding: 25,
            display: "block",
            width: "80%",
            marginBottom: 45,
          }}
          onClick={postToFirebase}
        // disabled={disabled}
        >
          <h3 style={{ color: "black" }}>
            {!submit ? "Submit Event" : "SUBMITTED"}
          </h3>
        </button>
      </center>
    </Container>
  );
}

export default Form;
