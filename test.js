var slaying = true;
var youHit = Math.floor(Math.random());
var damageThisRound = Math.floor(Math.random() * 5 + 1);
var totalDamage = 0;

while (slaying){
    if(youHit){
        console.log("You hit the dragon!");
        totalDamage += damageThisRound;
        if (totalDamage >= 4){
            console.log("Gratz, you have slayed da beast. You hit" + youHit);
            slaying = false;
        }
        else{
            youHit = Math.floor(Math.random());
        }
    }
    else{
        console.log("The Dragon defeated you...");
    }
    slaying = false;
}