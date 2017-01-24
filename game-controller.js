
var GameController = function () {

    var game = new GameService()

    this.onAttack = function(attacker, target, attackName) {
        game.dealDamage(attacker, target, attackName)
        draw()
        //playSound('slap')
    }

    this.onAddItem = function(playerName, itemName) {
        game.equipItem(playerName, itemName)
    }

    this.onUseItem = function(playerName, itemName) {
        game.useItem(playerName, itemName)
        draw()
    }

    this.onReset = function(player1, player2) {
        game.reset()

        console.log("Game is Reset")
        draw()
    }

    function draw() {
        var health1 = game.getPlayerHealth('ryu')
        var health2 = game.getPlayerHealth('ken')

        var healthPercent1 = game.getPlayerHealthPercent('ryu')
        var healthPercent2 = game.getPlayerHealthPercent('ken')

        var hits1 = game.getPlayerHits('ryu')
        var hits2 = game.getPlayerHits('ken')

        var playerHealthId = document.getElementById("Ryu-health");
        var playerHealthTag = playerHealthId.getElementsByTagName("span");
        playerHealthTag[0].style = "width:" + healthPercent1 + "%"
        var playerHitsId = document.getElementById('Ryu-hits').innerHTML = hits1

        var playerHealthId = document.getElementById("Ken-health");
        var playerHealthTag = playerHealthId.getElementsByTagName("span");
        playerHealthTag[0].style = "width:" + healthPercent2 + "%"
        var playerHitsId = document.getElementById('Ken-hits').innerHTML = hits2
    }

}