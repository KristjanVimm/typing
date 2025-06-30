import { useRef } from "react";

// Taken from stackoverflow. Custom React hook to focus on a specific element upon a specific action.

export default function useFocus<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null);
  const setFocus = () => ref?.current?.focus?.();

  return [ref, setFocus] as const;
}
