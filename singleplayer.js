function singlePlayer(theme, level) {
    startServer('levels/' + theme + '/' + level + '.json', '48667');
    setInterval(function() {
        document.location.href = 'game.html?name=Botrick&player=0&address=localhost:48667';
    }, 1000);
}