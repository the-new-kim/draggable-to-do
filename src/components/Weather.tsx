import { useEffect, useState } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  /* padding: 10px; */
  display: grid;
  grid-template-areas:
    "icon temp"
    "icon city";

  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;

  * {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
const Temp = styled.div`
  grid-area: temp;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;
const Icon = styled.div<{ $iconUrl: string }>`
  grid-area: icon;

  background-image: url(${(props) => props.$iconUrl});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
`;
const City = styled.div`
  grid-area: city;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const API_KEY = "4f4ae174dd9b4e994aa13974e09f450c";

interface IWeatherData {
  loading: boolean;
  data?: {
    main: {
      temp: number;
    };
    weather: { icon: string }[];
    name: string;
  };
  denied?: boolean;
}

interface ICoords {
  lat?: number;
  lon?: number;
  error?: object;
}

function Weather() {
  const [coords, setCoords] = useState<ICoords>({
    lat: undefined,
    lon: undefined,
    error: undefined,
  });
  const [weatherData, setWeatherData] = useState<IWeatherData>({
    loading: true,
    data: undefined,
    denied: false,
  });

  useEffect(() => {
    const onSucess = (position: GeolocationPosition) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      setCoords({ lat, lon });
    };

    const onError = (error: GeolocationPositionError) => {
      setCoords({ error });
    };

    navigator.geolocation.getCurrentPosition(onSucess, onError);
  }, []);

  useEffect(() => {
    if (coords.error)
      setWeatherData((prev) => {
        return { ...prev, denied: true, loading: false };
      });

    if (!coords.lat || !coords.lon) return;

    const fetchWeatherData = async () => {
      const data = await (
        await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY}&units=metric`
        )
      ).json();
      setWeatherData({ data, loading: false, denied: false });
    };

    fetchWeatherData();

    const intervalId = setInterval(() => {
      fetchWeatherData();
    }, 60000);

    return () => clearInterval(intervalId);
  }, [coords]);

  return (
    <>
      {weatherData.denied ? null : (
        <>
          {weatherData.loading ? (
            "Loading..."
          ) : (
            <Wrapper>
              <Temp>{weatherData.data?.main.temp.toFixed(1)}℃</Temp>
              <Icon
                $iconUrl={`http://openweathermap.org/img/wn/${weatherData.data?.weather[0].icon}@2x.png`}
              ></Icon>
              <City>{weatherData.data?.name}</City>
            </Wrapper>
          )}
        </>
      )}
    </>
  );
}

export default Weather;
