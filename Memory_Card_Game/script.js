let cards = document.querySelectorAll(".card");
const list = document.querySelector("#lists");

let matchCard = 0;
let cardNum = 8;
let cardOne, cardTwo;
let diableDeck = false;

function flipCard(e){
    // get user clicked card
    let clickedCard = e.target;
    if(clickedCard!=cardOne && !diableDeck){
        clickedCard.classList.add("flip");
        if(!cardOne){
            // return cardOne to clickedCard
            return cardOne = clickedCard;
        }
        cardTwo = clickedCard;
        diableDeck = true;
        let cardOneImg = cardOne.querySelector("img").src,
            cardTwoImg = cardTwo.querySelector("img").src;
        matchCards(cardOneImg, cardTwoImg);
    }
}

function matchCards(img1, img2){
    if(img1 === img2){
        getAudioObject("10");
        // if two cards match
        matchCard+=1;
        if(matchCard == cardNum){
            if(matchCard == 18)
                return alert("YOU ARE PASS!")
            levelUp();
            setTimeout(() => {
                return shuffleCard();
            }, 100);
        }
        cardOne.removeEventListener("click", flipCard);
        cardTwo.removeEventListener("click", flipCard);
        cardOne = cardTwo = "";
        return diableDeck = false;
    }
    getAudioObject("1");

    setTimeout(() => {
        // add shake class to both cards after 0.4s
        cardOne.classList.add("shake");
        cardTwo.classList.add("shake");
    },400);

    setTimeout(() => {
        // add shake class to both cards after 0.4s
        cardOne.classList.remove("shake", "flip");
        cardTwo.classList.remove("shake" ,"flip");
        cardOne = cardTwo = "";
        diableDeck = false;
    },1200);
}

function shuffleCard(){
    matchCard = 0;
    cardOne = cardTwo = "";
    diableDeck = false;
    document.getElementById("status").innerHTML= "LEVEL" + parseInt(cardNum/8);
    let arr = new Array(cardNum*2);
    for(let i=0;i<2;i++){
        for(let j=0;j<cardNum;j++){
            arr[i*cardNum+j] = j+1;
        }
    }
    arr.sort(() => Math.random() > 0.5 ? 1 : -1)
    cards = document.querySelectorAll(".card");
    cards.forEach((card, index) =>{
        card.classList.remove("flip");
        let imgTag = card.querySelector("img");
        imgTag.src = `images/img-${arr[index]}.png`
    });
    cards.forEach(card =>{
        card.classList.add("flip");
    });
    let timeLimit = 5000;
    if(cardNum==18) timeLimit = 3000;
    setTimeout(() => {
        cards.forEach((card, index) =>{
            card.classList.remove("flip");
            card.addEventListener("click", flipCard);
        });
    },timeLimit);

}

function getAudioObject(pitch){
    return new Audio("https://awiclass.monoame.com/pianosound/set/"+pitch+".wav").play()
}

const levelUp = function(){
    cardNum = 18;
    document.documentElement.style.setProperty('--row', 6);
    document.documentElement.style.setProperty('--col', 6);
    document.documentElement.style.setProperty('--height', `800px`);
    document.documentElement.style.setProperty('--width', `800px`);
    for(let i=0;i<2;i++){
        for(let j=9;j<=18;j++){
            let liTag=`
            <li class="card">
                <div class="view front-view">
                    <span class="material-icons">question_mark</span>
                </div>
                <div class="view back-view">
                    <img src="images/img-${j}.png" alt="card-img">
                </div>               
            </li>`;
            list.insertAdjacentHTML("beforeend", liTag);
        }
    }
}


shuffleCard();
