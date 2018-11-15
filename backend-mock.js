function getTimeFor() {
    return new Date().toLocaleDateString('pl');
}

module.exports = {
    getTimeFor: getTimeFor
};