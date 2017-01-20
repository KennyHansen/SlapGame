var health = 100

var ken = {
  name: 'Ken',
  health: 120,
  attacks: {
    kick: 20,
    punch: 15,
    uppercut: 30,
    hadouken: 40
  },
  mobility: 35,
  sprite:'ken.png'
}

var ryu = {
  name: 'Ryu',
  health: 100,
  attacks: {
    kick: 15,
    punch: 10,
    uppercut: 25,
    hadouken: 60
  },
  mobility: 55,
  sprite:'ryu.png'
}

var Item = function(itemName, itemValue, itemDescription){
    this.name = itemName;
    this.value = itemValue;
    this.description = itemDescription;
}

var items = {
    shield1:new Item("Shield of Lesser Blocking", {block:2}, "This blocks 2 damage"),
    shield2:new Item("Shield of Blocking", {block:5}, "This blocks 5 damage"),
    shield3:new Item("Shield of Greater Blocking", {block:12}, "This blocks 12 damage"),
    shield4:new Item("Shield of Master Blocking", {block:20, bonusHealth:50}, "This blocks 20 damage")
}



function onSlap(){
  dealDamage(ryu, ken, 1, 'Slap')
  //playSound('slap')
}

function onPunch(){
  dealDamage(ryu, ken, ryu.attacks['punch'], 'Punch')
  //playSound('punch')
}

function onKick(){
  dealDamage(ryu, ken, ryu.attacks['kick'], 'Kick')
  //playSound('kick')
}

function onHadouken(){
  dealDamage(ryu, ken, ryu.attacks['hadouken'], 'HADOUKEN')
  playSound('hadouken')
}

function dealDamage(attacker, target, damage, attackType) {
  var health = target.health

  // Add damage filters

  // Health Check
  if(health <= damage){
        //Don't let the health drop below 0
        console.log(attacker.name + " hits " + target.name + " with " + attackType + " for " + health + " damage")
        console.log("Player is dead!")
        target.health = 0;
    }else{
        console.log(attacker.name + " hits " + target.name + " with " + attackType + " for " + damage + " damage")
        target.health = +(health - damage).toFixed(1);
    }
    updatePlayer(ken);
}

function updatePlayer(player) {
    var healthElem = document.getElementById(player.name + '-health').innerHTML = player.health;
}

function playSound(soundFile) {
    // Plays a sound like Hadouken
    var audio = new Audio('sounds/' + soundFile + '.mp3');
    audio.play();
}

