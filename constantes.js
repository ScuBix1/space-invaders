//canvas
let tailleCarreau = 32;
let lignes = 16;
let colonnes = 16;
let canvas;
let largeurCanvas = tailleCarreau*colonnes;
let hauteurCanvas = tailleCarreau*lignes;
let context; 

//vaisseau
let largeurVaisseau =tailleCarreau*2;
let hauteurVaisseau = tailleCarreau;
let vaisseauX = tailleCarreau * colonnes/2 - tailleCarreau;
let vaisseauY = tailleCarreau * lignes - tailleCarreau*2;
let vaisseauImage;
let vaisseauDeplacementX = tailleCarreau;
let peutTirer = true;

//alien
let alienArray = [];
let largeurAlien = tailleCarreau*2;
let hauteurAlien = tailleCarreau;
let alienX = tailleCarreau;
let alienY = tailleCarreau;
let alienImage;
let ligneAlien = 1;
let colonneAlien = 1;
let nombreAlien = 0;
let alienDeplacementX = 3;

//tir vaisseau
let tirArray=[];
let tirDeplacementY=- 12;

//score
let score = 0;
let gameOver = false;

let vaisseau = {
    x: vaisseauX,
    y: vaisseauY, 
    largeur: largeurVaisseau,
    hauteur: hauteurVaisseau
}



window.onload = function(){
    canvas = document.getElementById("canvas");
    canvas.width = largeurCanvas;
    canvas.height = hauteurCanvas;
    context = canvas.getContext("2d");

    //chargement du vaisseau
    vaisseauImage = new Image();
    vaisseauImage.src = "img/vaisseau.png";
    vaisseauImage.onload = function(){
        context.drawImage(vaisseauImage, vaisseau.x, vaisseau.y, vaisseau.largeur, vaisseau.hauteur);
    };
    //chargement des aliens
    alienImage = new Image();
    alienImage.src = "img/alien-rouge.png";
    creationAlien();
    //score

    requestAnimationFrame(update);
    document.addEventListener("keydown", deplaceVaisseau);
    document.addEventListener("keydown", tirVaisseau);
}

function update(){
    requestAnimationFrame(update);
    if(gameOver){
        return alert("game over");
    }
    context.clearRect(0,0,canvas.width, canvas.height);
    context.drawImage(vaisseauImage, vaisseau.x, vaisseau.y, vaisseau.largeur, vaisseau.hauteur);
    //alien
    for(let i = 0; i<alienArray.length; i++){
        let alien = alienArray[i];
        if(alien.alive == true){
            alien.x += alienDeplacementX;
            if(alien.x + alien.largeur >= canvas.width || alien.x<=0){
                alienDeplacementX *= -1;
                alien.x += alienDeplacementX*2;
                for(let j = 0; j<alienArray.length; j++){
                    alienArray[j].y += hauteurAlien;
                    
                }
            }
            context.drawImage(alienImage, alien.x, alien.y, alien.largeur, alien.hauteur);
            if(alien.y >= vaisseau.y){
                gameOver = true;
            }
        }
    }
    //tir du vaisseau 
    for(let i = 0; i<tirArray.length;i++){
        let tir=[];
        tir = tirArray[i];
        tir.y += tirDeplacementY;
        context.fillStyle = "lightgreen";
        if((tir.y+tir.largeur)/2 <= tir.y){
            context.fillRect(tir.x, tir.y, tir.hauteur, tir.largeur);
        }
        for (let j =0; j<alienArray.length; j++){
            let alien = alienArray[j];    
            if(!tir.utilise && alien.alive && toucheMonstre(tir, alien)){
                tir.utilise = true;
                alien.alive = false;
                nombreAlien--;  
                score+=10;
            }
        }
    }

    while(tirArray.length > 0 && (tirArray[0].utilise||tirArray[0].y <0)){
        tirArray.shift();
    }

    if(nombreAlien == 0){
        colonneAlien = Math.min(colonneAlien + 1, colonnes/2 -2)  ;
        ligneAlien  =Math.min(ligneAlien+1, lignes-4);
        alienDeplacementX += 0.00001;
        alienArray = [];
        tirArray = [];
        creationAlien();
    }
    context.fillStyle="white";
    context.font = "16px Courier";
    context.fillText(score, 5, 20);
}

function deplaceVaisseau(e){
    if(gameOver){
        return alert("game over");
    }
    
    if(e.code == "ArrowLeft" && vaisseau.x - vaisseauDeplacementX >= 0){  
        vaisseau.x -= vaisseauDeplacementX;
    }else if(e.code == "ArrowRight" && vaisseau.x + vaisseauDeplacementX + vaisseau.largeur <= canvas.width){
        vaisseau.x += vaisseauDeplacementX;
    }
}
    
function creationAlien(){
    for(let i = 0; i<colonneAlien; i++){
        for(let j = 0; j<ligneAlien; j++){
            let alien = {
                img: alienImage,
                x: alienX + i*largeurAlien,
                y: alienY + j*hauteurAlien,
                largeur: largeurAlien,
                hauteur: hauteurAlien, 
                alive: true
            }
            alienArray.push(alien);
        }
    }
    nombreAlien = alienArray.length;
}
function tirVaisseau(e){
    if(gameOver){
        return alert("game over");
    }
    if(e.code == "Space" && peutTirer){ 
       
        let tir = {
            x: vaisseau.x+largeurVaisseau*15/32,
            y: vaisseau.y,
            largeur: tailleCarreau/2,
            hauteur: tailleCarreau/8,
            utilise: false
        }
        tirArray.push(tir);
        peutTirer = false;
        setTimeout(() => {
            peutTirer = true;
        }, 200);
    }

    
}
function toucheMonstre(a, b){
    return a.x< b.x + b.largeur && a.x + a.largeur > b.x &&a.y < b.y + b.hauteur && a.y + a.hauteur > b.y;
}