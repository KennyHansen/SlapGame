// var health = 100
// TODO (for fun?)

// 1) (DONE) refactor health into healthbars 
// 2) make sprites play with different moves/states
// 3) add cool sounds
// 4) change buttons to actual keystrokes for movement and attacks
// 5) make hitboxes a thing
// 6) make new players spawn after defeating an old one
// 7) add a counter-attack method


// Constructors
var GameService = function () {

    var dataStore = this;

    function Player(name, health, attacks, mobility) {
        this.name = name;
        this.health = health;
        this.maxHealth = health;
        this.attacks = attacks;
        this.mobility = mobility;
        this.equippedItems = [];
        this.stashedItems = [];
        this.isAlive = true;
        this.sprite = name + '.png';
        this.hits = 0;
    }

    function Item(itemName, itemValue, itemDescription) {
        this.name = itemName;
        this.value = itemValue;
        this.description = itemDescription;
    }

    var players = {
        ryu: new Player('Ryu', 100, { slap: 1, kick: 15, punch: 10, uppercut: 25, hadouken: 60 }, 55),
        ken: new Player('Ken', 120, { slap: 1, kick: 20, punch: 15, uppercut: 30, hadouken: 40 }, 35)
    }

    var items = {
        shield1: new Item("Shield of Lesser Blocking", { block: 2 }, "This blocks 2 damage"),
        shield2: new Item("Shield of Blocking", { block: 5 }, "This blocks 5 damage"),
        shield3: new Item("Shield of Greater Blocking", { block: 12 }, "This blocks 12 damage"),
        shield4: new Item("Shield of Master Blocking", { block: 20, bonusHealth: 50 }, "This blocks 20 damage"),

        heal1: new Item("Choccy Milk", { heal: 10 }, "Doot")

    }

    dataStore.getPlayerHealth = function(playerName) {
        return players[playerName].health
    }

    dataStore.getPlayerHealthPercent = function(playerName) {
        return (players[playerName].health / players[playerName].maxHealth) * 100
    }

    dataStore.getPlayerHits = function(playerName) {
        return players[playerName].hits
    }

    dataStore.getAttackDamage = function(attackerName, attackName) {
        return players[attackerName].attacks[attackName]
    }

    dataStore.equipItem = function(playerName, itemKey) {
        var player = players[playerName]
        var item1 = items[itemKey]
        if (items[itemKey] == item1 || items[itemKey].name == itemKey) {
            searchItems(playerName, item1)
            player.equippedItems.push(items[itemKey])
            console.log(player.name + ' has equipped ' + items[itemKey].name + "!")
        }
    }
    
    dataStore.dealDamage = function(attackerName, targetName, attackType, counter) {
        var attacker = players[attackerName]
        var target = players[targetName]
        var health = target.health
        var damage = attacker.attacks[attackType]
        if (!attacker.isAlive) {
            console.log(attacker.name + ' is down, the fight is over!')
        } else if (target.isAlive) {
            // Add damage filters
            // if (hasSound) playSound(attackType);
            damage = filterDamage(target, damage)
            // Health Check
            if (health <= damage) {
                //Don't let the health drop below 0
                logDamage(attacker, target, attackType, health, false)
                killPlayer(target)
            } else {
                logDamage(attacker, target, attackType, damage, true)
                target.health = +(health - damage).toFixed(1);
            }
            updateHits(attackerName)
            if (!counter) {
                counterAttack(target, attacker)
            }
        } else {
            console.log(target.name + ' is down, the fight is over!')
        }
    }

    dataStore.useItem = function(playerName, itemKey) {
        var player = players[playerName]
        var item1 = items[itemKey]
        if (item1.value.heal) {
            healDamage(player, item1.value.heal, item1.name)
        }
    }

    dataStore.reset = function() {
        players.ryu.health = players.ryu.maxHealth
        players.ken.health = players.ken.maxHealth

        players.ryu.hits = 0
        players.ken.hits = 0

        players.ryu.isAlive = true
        players.ken.isAlive = true

        players.ryu.equippedItems = []
        players.ryu.stashedItems = []
        players.ken.equippedItems = []
        players.ken.stashedItems = []
    }

    var counterAttack = function(target, attacker) {
        debugger
        var damageType = getRandomAttack(target)
        var targetName = target.name.toLowerCase()
        var attackerName = attacker.name.toLowerCase()
        dataStore.dealDamage(targetName, attackerName, damageType, true)
    }

    var getRandomAttack = function(player) {
        var attacks = player.attacks
        var randomIndex = Math.floor((Object.keys(attacks).length * Math.random()))
        var counter = 0
        
        for(attack in attacks) {
            if (counter == randomIndex) {
                return attack;
            } else {
                counter++;
            }
        }
    }

    var searchItems = function(playerName, item) {
        var player = players[playerName]
        var equippedItems = player.equippedItems
        var stashedItems = player.stashedItems
        var itemType = item.type
        for (var i = 0; i < equippedItems.length; i++) {
            var equippedItem = equippedItems[i];
            if (equippedItem.type == itemType) {
                equippedItems.splice(i, 1)
                stashedItems.push[equippedItem]
                console.log(player.name + " has moved " + equippedItem.name + " into their stash.")
            }
        }
    }


    var updateHits = function(playerName) {
        var player = players[playerName]
        player.hits += 1;
    }

    var healDamage = function(target, heal, healType) {
        var health = target.health
        if (!target.isAlive) {
            console.log(target.name + ' is down, the fight is over!')
        } else if (target.isAlive) {
            if (target.health + heal > target.maxHealth) {
                heal = target.maxHealth - target.health
            }
            logHealing(target, heal, healType)
            target.health += heal
        }
    }

    function filterDamage(target, damage) {
        var block = 0
        if (target.equippedItems) {
            for (var i = 0; i < target.equippedItems.length; i++) {
                var item = target.equippedItems[i];
                if (item.value.block) block += item.value.block;
            }
        }
        damage = damage - block
        if (damage < 0) damage = 0;
        return damage
    }

    function killPlayer(player) {
        player.health = 0;
        player.isAlive = false;
    }

    function logDamage(attacker, target, attackType, damage, isAlive) {
        console.log(attacker.name + " hits " + target.name + " with " + attackType + " for " + damage + " damage (" + target.health + "=>" + (target.health - damage) + ")");
        if (!isAlive) {
            console.log(attacker.name + ' knocked out ' + target.name + '!!!')
        }
    }

    function logHealing(target, heal, healType) {
        console.log(target.name + " used " + healType + " to restore " + heal + " health (" + (target.health) + "=>" + (target.health + heal) + ")");
    }

    function nextChallenger(player) {

    }



    function playSound(soundFile) {
        // Plays a sound like Hadouken
        var audio = new Audio('sounds/' + soundFile + '.mp3');
        audio.play();
    }
}
