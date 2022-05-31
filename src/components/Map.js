import React, { useEffect, useRef, useState } from "react";
import { useStore } from "../Contextapi";

const apiKey = "AIzaSyBNQlwGQRhbknQ0BrIHQy4ReFf_oJnNm74";

const mapApiJs = "https://maps.googleapis.com/maps/api/js";

const geocodeJson = "https://maps.googleapis.com/maps/api/geocode/json";

// load google map api js

function loadAsyncScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");

    Object.assign(script, {
      type: "text/javascript",

      async: true,

      src,
    });

    script.addEventListener("load", () => resolve(script));

    document.head.appendChild(script);
  });
}

const extractAddress = (place) => {
  const address = {
    city: "",

    state: "",

    zip: "",

    country: "",

    plain() {
      const city = this.city ? this.city + ", " : "";

      const zip = this.zip ? this.zip + ", " : "";

      const state = this.state ? this.state + ", " : "";

      return city + zip + state + this.country;
    },
  };

  console.log(address);

  if (!Array.isArray(place?.address_components)) {
    return address;
  }

  place.address_components.forEach((component) => {
    const types = component.types;

    const value = component.long_name;

    if (types.includes("locality")) {
      address.city = value;
    }

    if (types.includes("administrative_area_level_2")) {
      address.state = value;
    }

    if (types.includes("postal_code")) {
      address.zip = value;
    }

    if (types.includes("country")) {
      address.country = value;
    }
  });

  return address;
};

function Map() {
  const searchInput = useRef(null);

  const { setAddress, setLatitude, setLongitude, setReload } = useStore();

  // init gmap script

  const initMapScript = () => {
    // if script already loaded

    if (window.google) {
      return Promise.resolve();
    }

    const src = `${mapApiJs}?key=${apiKey}&libraries=places&v=weekly`;

    return loadAsyncScript(src);
  };

  // do something on address change

  //   const onChangeAddress = (autocomplete) => {
  //     const place = autocomplete.getPlace();

  //     console.log("bal", place);
  //     setAddress(extractAddress(place));
  //   };

  const onChangeAddress = (autocomplete) => {
    const place = autocomplete.getPlace();
    let components = {};
    place.address_components.forEach((addressComponent) => {
      addressComponent.types.forEach((type) => {
        components[type] = addressComponent.long_name;
      });
    });

    var formatedLocation = place.formatted_address;

    var latitude = place.geometry.location.lat();
    var longitude = place.geometry.location.lng();

    console.log("aaaaaaa", formatedLocation);
    setLatitude(latitude);
    setLongitude(longitude);

    setAddress(formatedLocation);
    setReload(true);
  };

  // init autocomplete

  const initAutocomplete = () => {
    if (!searchInput.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      searchInput.current
    );



    autocomplete.addListener("place_changed", () =>
      onChangeAddress(autocomplete)
    );
  };

  const reverseGeocode = ({ latitude: lat, longitude: lng }) => {
    const url = `${geocodeJson}?key=${apiKey}&latlng=${lat},${lng}`;

    searchInput.current.value = "Getting your location...";

    fetch(url)
      .then((response) => response.json())

      .then((location) => {
        const place = location.results[0];

        const _address = extractAddress(place);

        setAddress(_address);

        searchInput.current.value = _address.plain();
      });
  };

  const findMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        reverseGeocode(position.coords);
      });
    }
  };

  // load map script after mounted

  useEffect(() => {
    initMapScript().then(() => initAutocomplete());
  }, []);

  return (
    <>
      <input
        id="location"
        className="location"
        ref={searchInput}
        type="text"
        placeholder=" Enter event location / address"
        name="location"
      />

      <button onClick={findMyLocation} className="d-none">
        GP Fixed
      </button>
    </>
  );
}

export default Map;
