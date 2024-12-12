import { debounce } from "@mui/material";

export const setInfiniteScroll =
  debounce(async (ref, hasMore, page, isLoading, dataFetcher) => {
    const element = ref.current;
    if (element) {
      const { scrollTop, scrollHeight, clientHeight } = element;
      //   console.log("scrollTop", scrollTop);
      //   console.log("scrollHeight", scrollHeight);
      //   console.log("clientHeight", clientHeight);

      if (
        hasMore &&
        clientHeight + 100 < scrollHeight &&
        scrollTop + clientHeight >= scrollHeight - 100
      ) {
        console.log("Fetch more data!", page);
        if (page > 1 && !isLoading) await dataFetcher();
      }
    }
  }, 300)

export const setScrollListener = (ref, handleScroll) => {
  const element = ref.current;
  const debouncedScroll = debounce(handleScroll, 300);

  if (element) {
    element.addEventListener("scroll", debouncedScroll);
  }

  return () => {
    if (element) {
      element.removeEventListener("scroll", debouncedScroll);
    }
  };
}

export const fetchDataForInfiniteScroll = async (isLoading, setIsLoading, hasMore, setHasMore, page, setPage, limit, dataFetcher) => {
  if (isLoading || !hasMore) return;
  setIsLoading(true);
  try {
    const newData = await dataFetcher(page, limit);
    console.log("Fetched Droplets:", newData);

    if (newData?.length > 0) {
      if (newData.length < limit) setHasMore(false); // Stop fetching
      else setPage((prev) => prev + 1); // Increment only if fetch is valid
    } else {
      setHasMore(false);
    }
  } catch (error) {
    console.error("Error fetching droplets:", error);
  } finally {
    setIsLoading(false);
  }
}