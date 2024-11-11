
// Function to format time
export function formatTime(time, includeMeridian = false) {
    const hours = time.getHours();
    const minutes = time.getMinutes();
  
      // Format the time in 12-hour format
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    const meridian = hours >= 12 ? "PM" : "AM";

  return `${formattedHours}:${formattedMinutes} ${meridian}`
  }
  
  // Function to format date
  export function formatDate(time) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return time.toLocaleDateString(undefined, options);
  }
  
  // Function to format day
  export function formatDay(day) {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return daysOfWeek[day];
  }
  