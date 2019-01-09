function getTimeFor() {
    return new Promise(function (resolve) {
        return resolve(new Date().toLocaleDateString('pl'));
    });
}

function getWeather(){
    return new Promise(function (resolve){
        return resolve("The weather is always fine");
    });
}

module.exports = {
    getTimeFor: getTimeFor,
    getWeather: getWeather
};