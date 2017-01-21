// var health = 100




// TODO (for fun?)

// 1) refactor health into healthbars
// 2) make sprites play with different moves/states
// 3) add cool sounds
// 4) change buttons to actual keystrokes for movement and attacks
// 5) make hitboxes a thing
// 6) make new players spawn after defeating an old one


// Constructors
var Player = function(name, health, attacks, mobility) {
  this.name = name;
  this.health = health;
  this.maxHealth = health;
  this.attacks = attacks;
  this.mobility = mobility;
  this.equippedItems = [];
  this.isAlive = true;
  this.sprite = name + '.png';
}

var Item = function(itemName, itemValue, itemDescription){
    this.name = itemName;
    this.value = itemValue;
    this.description = itemDescription;
}


// Variables
// var ken = {
//   name: 'Ken',
//   health: 120,
//   attacks: {
//     kick: 20,
//     punch: 15,
//     uppercut: 30,
//     hadouken: 40
//   },
//   equippedItems:[],
//   mobility: 35,
//   isAlive: true,
//   sprite:'ken.png'
// }

// var ryu = {
//   name: 'Ryu',
//   health: 100,
//   attacks: {
//     kick: 15,
//     punch: 10,
//     uppercut: 25,
//     hadouken: 60
//   },
//   mobility: 55,
//   equippedItems:[],
//   isAlive: true,
//   sprite:'ryu.png'
// }

var ryu = new Player('Ryu', 100, {kick:15, punch:10, uppercut:25, hadouken:60}, 55)
var ken = new Player('Ken', 120, {kick:20, punch:15, uppercut:30, hadouken:40}, 35)

var items = {
    shield1:new Item("Shield of Lesser Blocking", {block:2}, "This blocks 2 damage"),
    shield2:new Item("Shield of Blocking", {block:5}, "This blocks 5 damage"),
    shield3:new Item("Shield of Greater Blocking", {block:12}, "This blocks 12 damage"),
    shield4:new Item("Shield of Master Blocking", {block:20, bonusHealth:50}, "This blocks 20 damage")
}


// Functions
function equipItem(player, itemName) {
  for(var item in items) {
    if (items[item] == itemName || item == itemName) {
      player.equippedItems.push(items[item])
      console.log(player.name + ' has equipped ' + items[item].name)
      return
    }
  }
}

function onSlap(attacker, target){
  dealDamage(attacker, target, 1, 'Slap')
  //playSound('slap')
}

function onPunch(attacker, target){
  dealDamage(attacker, target, attacker.attacks['punch'], 'Punch')
  //playSound('punch')
}

function onKick(attacker, target){
  dealDamage(attacker, target, attacker.attacks['kick'], 'Kick')
  //playSound('kick')
}

function onHadouken(attacker, target){
  dealDamage(attacker, target, attacker.attacks['hadouken'], 'HADOUKEN')
  playSound('hadouken')
}

function dealDamage(attacker, target, damage, attackType) {
  var health = target.health
  if (!attacker.isAlive) {
    console.log(attacker.name + ' is down, the fight is over!')
  } else if (target.isAlive) {
      // Add damage filters
      damage = filterDamage(target, damage)
      // Health Check
      if(health <= damage){
        //Don't let the health drop below 0
        logDamage(attacker, target, attackType, health, false)
        target.health = 0;
        target.isAlive = false;
      }else{
        logDamage(attacker, target, attackType, damage, true)
        target.health = +(health - damage).toFixed(1);
      }
      updatePlayer(target);
    } else {
      console.log(target.name + ' is down, the fight is over!')
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

function logDamage(attacker, target, attackType, damage, isAlive) {
  console.log(attacker.name + " hits " + target.name + " with " + attackType + " for " + damage + " damage (" + target.health + "=>" + (target.health-damage)+")");   
  if(!isAlive) {
    console.log(attacker.name + ' knocked out ' + target.name + '!!!')
  }
}

function updatePlayer(player) {
    var healthElem = document.getElementById(player.name + '-health').innerHTML = player.health;

    var playerHealthId = document.getElementById(player.name)
    var playerHealthTag = playerHealthId.getElementsByTagName("span");


    playerHealthTag[0].style = "width:" + ((player.health/player.maxHealth)*100) + "%"

}

function playSound(soundFile) {
    // Plays a sound like Hadouken
    var audio = new Audio('sounds/' + soundFile + '.mp3');
    audio.play();
}

