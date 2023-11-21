const state = {
  score: {
    playerScore: 0,
    computerScore: 0,
    scoreBox: document.querySelector('#score_points')
  },
  cardSprites: {
    avatar: document.querySelector('#card-image'),
    name: document.querySelector('#card-name'),
    type: document.querySelector('#card-type')
  },
  fieldCards: {
    player: document.querySelector("#player-field-card"),
    computer: document.querySelector("#computer-field-card")
  },
  playerSides: {
    player1: "player-cards",
    player1Box: document.querySelector("#player-cards"),
    computer: "computer-cards",
    computerBox: document.querySelector("#computer-cards")
  },
  actions: {
    button: document.querySelector("#next-duel"),
  },
};

const playerSides = {
  player1: "player-cards",
  computer: "computer-cards"
}

const pathImages = "./src/assets/images/";
const cardData = [
  {
    id: 0,
    name: "Blue Eyes White Dragon",
    type: "Paper",
    img: `${pathImages}dragon.png`,
    WinOf: [1],
    LoseOf: [2],
  },
  {
    id: 1,
    name: "Dark Magician",
    type: "Rock",
    img: `${pathImages}dragon.png`,
    WinOf: [2],
    LoseOf: [0],
  },
  {
    id: 2,
    name: "Exodia",
    type: "Scissors",
    img: `${pathImages}exodia.png`,
    WinOf: [0],
    LoseOf: [1],
  }
]

async function getRandomCardId() {
  const randomIndex = Math.floor(Math.random() * cardData.length);
  return cardData[randomIndex].id
}

async function createCardImage(IdCard, fieldSide) {
  const cardImage = document.createElement("img");
  cardImage.setAttribute("height", "100px")
  cardImage.setAttribute("src", "./src/assets/images/card-back.png")
  cardImage.setAttribute("data-id", IdCard)
  cardImage.classList.add("card")

  if (fieldSide === playerSides.player1) {
    cardImage.addEventListener("mouseover", () => {
      drawSelectCard(IdCard)
    });

    cardImage.addEventListener("click", () => {
      setCardsField(cardImage.getAttribute("data-id"));
    });
  }

  return cardImage;
}

async function setCardsField(cardId) {
  await removeAllCardsImages();

  let computerCardId = await getRandomCardId();

  state.cardSprites.avatar.src = ""
  state.cardSprites.name.innerText = ""
  state.cardSprites.type.innerText = ""

  state.fieldCards.player.style.display = "block";
  state.fieldCards.computer.style.display = "block";

  state.fieldCards.player.src = cardData[cardId].img;
  state.fieldCards.computer.src = cardData[computerCardId].img;

  let duelResults = await checkDuelResults(cardId, computerCardId);

  await updateScore();
  await drawButton(duelResults);
}

async function drawButton(text) {
  state.actions.button.innerText = text;
  state.actions.button.style.display = "block";
}

async function updateScore() {
  state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`
}

async function checkDuelResults(playerCardId, computerCardId) {
  let duelResults = "DRAW";
  let playerCard = cardData[playerCardId];

  if(playerCard.WinOf.includes(computerCardId)) {
    duelResults = "WIN";
    await playAudio(duelResults)
    state.score.playerScore++;
  }

  if(playerCard.LoseOf.includes(computerCardId)) {
    duelResults = "LOSE";
    await playAudio(duelResults)
    state.score.computerScore++;
  }

  return duelResults;
}

async function removeAllCardsImages() {
  let { computerBox, player1Box } = state.playerSides;

  let imgElements = computerBox.querySelectorAll("img");
  imgElements.forEach((img) => img.remove());

  imgElements = player1Box.querySelectorAll("img");
  imgElements.forEach((img) => img.remove());
}

async function drawSelectCard(index) {
  state.cardSprites.avatar.src = cardData[index].img;
  state.cardSprites.name.innerText = cardData[index].name;
  state.cardSprites.type.innerText = "Attribute : " + cardData[index].type;
}

async function drawCards(cardNumbers, fieldSide) {
  for (let i = 0; i < cardNumbers; i++) {
    const ramdomIdCard = await getRandomCardId();
    const cardImage = await createCardImage(ramdomIdCard, fieldSide);

    document.getElementById(fieldSide).appendChild(cardImage)
  }
}

async function resetDuel() {
  state.cardSprites.avatar.src = "";
  state.actions.button.style.display = "none";
  state.fieldCards.player.style.display = "none";
  state.fieldCards.computer.style.display = "none";


  init()
}

async function playAudio(status) {
  const audio = new Audio(`./src/assets/audio/${status}.wav`);
  audio.play()
}

function init() {
  state.fieldCards.player.style.display = "none"
  state.fieldCards.computer.style.display = "none"

  drawCards(5, playerSides.player1)
  drawCards(5, playerSides.computer)

  const bgm = document.getElementById("bgm");
  bgm.play()
}

init()