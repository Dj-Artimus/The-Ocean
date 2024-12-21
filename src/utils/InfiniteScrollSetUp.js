import { debounce } from "lodash";


export const setInfiniteScroll =
  debounce(async (ref, hasMore, page, isLoading, dataFetcher) => {
    const element = ref.current;
    if (element) {
      const { scrollTop, scrollHeight, clientHeight } = element;
      if (
        hasMore &&
        scrollTop + clientHeight >= scrollHeight - 250 &&
        !isLoading
      ) {
        await dataFetcher();
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
    if (newData?.length === limit) return setPage((prev) => prev + 1);
    if (newData?.length < limit || newData === null) {
      setHasMore(false);
      setPage(1);
    }
  } catch (error) {
    console.error("Error fetching droplets:", error);
  } finally {
    setIsLoading(false);
  }
}