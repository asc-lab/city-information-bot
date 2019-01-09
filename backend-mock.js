function getTimeFor() {
    return new Date().toLocaleDateString('pl');
}

function getWeather(){
    return "The weather is always fine";
}

module.exports = {
    getTimeFor: getTimeFor,
    getWeather: getWeather
};