import { useEffect, useState } from "react";

interface IGeoLocation {
  lat: number;
  lon: number;
}

const useGeolocation = () => {
  const [state, setState] = useState<IGeoLocation | null>(null);

  useEffect(() => {
    const onOk = (position: GeolocationPosition) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      setState({ lat, lon });
    };

    const onError = () => {
      return;
    };

    navigator.geolocation.getCurrentPosition(onOk, onError);
  }, []);

  return { coords: state };
};

export default useGeolocation;
