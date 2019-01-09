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

function getTimeAndWeather(){
    return Promise.all([getTimeFor(), getWeather()]).then(function (values) {
        return {
            time: values[0],
            weather: values[1]
        }
    });
}

module.exports = {
    getTimeFor: getTimeFor,
    getWeather: getWeather,
    getTimeAndWeather: getTimeAndWeather
};