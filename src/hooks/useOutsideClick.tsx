import { useEffect, useRef } from "react";

const useOutsideClick = <T extends HTMLElement, TT extends HTMLElement>(
  initialState: boolean,
  onClick: Function,
  exception: React.MutableRefObject<TT | null>
) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current || !exception.current) return;

    const element = ref.current;
    const exceptionElement = exception.current;

    const handleClick = (event: MouseEvent) => {
      if (
        initialState &&
        !exceptionElement.contains(event.target as Node) &&
        !element.contains(event.target as Node)
      )
        onClick();
    };

    document.addEventListener("click", handleClick);

    return () => document.removeEventListener("click", handleClick);
  }, [initialState, onClick, exception]);

  return ref;
};

export default useOutsideClick;
