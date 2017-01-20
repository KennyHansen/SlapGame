var health = 100

function onSlap(){
  dealDamage(1, 'Slap')
}

function onPunch(){
  dealDamage(5, 'Punch')
}

function onKick(){
  dealDamage(10, 'Kick')
}

function onHadouken(){
  dealDamage(28.6, 'HADOUKEN')
  playSound('hadouken')
}

function dealDamage(amount, attackType) {
  if(health <= amount){
        //Don't let the health drop below 0
        console.log(attackType + " player for " + health + " damage")
        console.log("Player is dead!")
        health = 0;
        update();
    }else{
        console.log(attackType + " player for " + amount + " damage")
        health = (health - amount).toFixed(1);
        update();
    }
}

function playSound(soundFile) {
  // Plays a sound like Hadouken
  
}

function update() {
    var healthElem = document.getElementById('health').innerHTML = health;
}