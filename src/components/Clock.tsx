import { useEffect, useState } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 1fr;

  @media (max-width: 700px) {
    display: none;
  }
`;

interface IClockState {
  date?: string;
  time?: string;
}

function Clock() {
  const [clock, setClock] = useState<IClockState>({
    date: undefined,
    time: undefined,
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentDate = new Date(Date.now());
      const date = currentDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        weekday: "short",
      });

      const time = currentDate.toLocaleTimeString("en-US");

      setClock({ date, time });
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Wrapper>
      <div>{clock.date}</div>
      <div>{clock.time}</div>
    </Wrapper>
  );
}

export default Clock;
