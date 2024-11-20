const addMinutesToCurrentTime = (minutes) => {
    const currentTime = new Date(); // Get current time
    currentTime.setMinutes(currentTime.getMinutes() + minutes); // Add minutes to current time
    return currentTime;
};

module.exports = addMinutesToCurrentTime;