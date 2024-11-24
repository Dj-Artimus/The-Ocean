export const handleTime = (initialTime) => {
    const [time, setTime] = useState(initialTime);
  
    useEffect(() => {
      const interval = setInterval(() => {
        // Logic to calculate updated time (e.g., "6h" to "7h")
        // You will need to implement a function to handle this
        setTime(/* Updated time value */);
      }, 60000); // Updates every minute
  
      return () => clearInterval(interval); // Cleanup the interval on unmount
    }, []);
  
    return time;
  };