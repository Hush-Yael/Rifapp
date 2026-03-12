import { createEffect, createSignal } from "solid-js";

export default function useMedia(query: string) {
  let media: MediaQueryList;
  const [matched, setMatched] = createSignal(false);

  createEffect(() => {
    media = window.matchMedia(query);
    setMatched(media.matches);
    const mediaHandler = () => setMatched(media.matches);

    if (media.addEventListener) media.addEventListener("change", mediaHandler);
    else media.addListener(mediaHandler);

    return () => {
      if (media.removeEventListener)
        media.removeEventListener("change", mediaHandler);
      else media.removeListener(mediaHandler);
    };
  });

  return matched;
}
