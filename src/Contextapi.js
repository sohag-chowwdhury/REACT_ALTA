import React, { useContext, useState } from "react";
import gif from "./images/giphy.gif";
//step 1

export const StoreContext = React.createContext();

export const StoreProvider = ({ children }) => {
  //image
  const [image, setImage] = useState(gif);

  //longitude, //latitude
  const [longitude, setLongitude] = useState(-73.935242);
  const [latitude, setLatitude] = useState(40.730610);

  //form information

  //title
  const [title, setTitle] = useState("");

  //start date
  const [startDate, setStartDate] = useState({
    value: new Date(),
    locale: { name: "en-US", label: "English (US)" },
  });

  //end date
  const [endDate, setEndDate] = useState({
    value: new Date(),
    locale: { name: "en-US", label: "English (US)" },
  });

  //dj host name
  const [dj, setDj] = useState("");

  //location

  const [address, setAddress] = useState({});

  //spots

  const [spots, setSpots] = useState("");

  //price
  const [price, setPrice] = useState("");

  //password
  const [password, setPassword] = useState("");

  //descriptions
  const [description, setDescription] = useState("");

  //set  Reload
  const [reload, setReload] = useState(false);

  //mask required
  const [isMaskRequired, setIsMaskRequired] = useState(false);
  const [isVaccineRequired, setIsVaccineRequired] = useState(false);

  //code required

  const [inviteCode, setInviteCode] = useState("");

  //waitingList

  const [isWaitingList, setIsWaitingList] = useState(false);

  //limit
  const [limit, setLimit] = useState("Up to 5");

  //show guest list
  const [guestList, setGuestList] = useState("HIDE");

  //capacity
  const [capacity, setcapacity] = useState("");
  const value = {
    image,
    setImage,
    password,
    setPassword,
    longitude,
    setLongitude,
    latitude,
    setLatitude,
    title,
    setTitle,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    dj,
    setDj,
    address,
    setAddress,
    spots,
    setSpots,
    price,
    setPrice,
    description,
    setDescription,
    reload,
    setReload,
    isMaskRequired,
    setIsMaskRequired,
    isVaccineRequired,
    setIsVaccineRequired,
    isWaitingList,
    setIsWaitingList,
    limit,
    setLimit,
    guestList,
    setGuestList,
    inviteCode,
    setInviteCode,
    capacity,
    setcapacity,
  };
  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};

export function useStore() {
  return useContext(StoreContext);
}
