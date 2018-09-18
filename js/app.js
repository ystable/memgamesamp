/* Memory Game */

let clickClassList = [];                  //class list of clicked cards
let clickCardList =[];                    //list of cards clicked (of 2 cards)
let clickCount = 0;                       //click counter
let allCardList = $('.deck .card .fa');           //list of all cards
let arrayClassInfo=[];                    //array of classes to shuffle
let moveCount = 0;                        //move counter
let starCount = 3;                        //star counter
let start = new Date;                     //timer reference
let gameTimer = setInterval(startTimer, 1000);    //timer count
let modal = document.getElementById('modal');     //modal

shuffleCards();

// -- click event function --
let clickAction = $( '.deck .card' ).click(function(event) {
  addMoveCount();
  checkStars();
  toggleOpenShow($(this));
  // if click opens card
  if ($(this).hasClass('open')){
    clickCount += 1;
    createClassList($(this), clickCount);

    // if one card clicked add to list
    if (clickCount === 1 ){
      createClickedCardList($(this), clickCount);

    // if second card clicked then check for match
    } else if (clickCount === 2) {
      createClickedCardList($(this), clickCount);

      // if match occurs - keep cards
      if (clickClassList[clickCount] != undefined && clickClassList[clickCount] === clickClassList[clickCount-1] ) {
        // adds class 'correct'
        setTimeout(addCorrect, 300, clickCardList[clickCount]);
        setTimeout(addCorrect, 300, clickCardList[clickCount-1]);
        // add class 'match' and checks if all cards matched
        setTimeout( flipKeep, 1000, clickCardList[clickCount]);
        setTimeout( flipKeep, 1000, clickCardList[clickCount-1]);
        clickCount = 0;
        bckgrnd('darkgreen');

      } else {
        // if not a match - reset cards
        setTimeout(addWrong, 300, clickCardList[clickCount]);
        setTimeout(addWrong, 300, clickCardList[clickCount-1]);
        setTimeout( flipBack, 1000, clickCardList[clickCount]);
        setTimeout( flipBack, 1000, clickCardList[clickCount-1]);
        clickCount = 0;
        bckgrnd('darkred');
      };
      clearOpenList();
    };
  } else {
    // doubleclick closes open card
    if (clickCount != 0) {
      clickCount -= 1;
    };
  };
});

// restarts page upon restart icon click
$('.restart').on('click', restartGame);


/**
* @description Shuffle function from http://stackoverflow.com/a/2450976
* @param {array} array
* @returns {array} shuffled array
*/
function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;
  while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
  }
  return array;
}

/**
* @description Shuffles deck of cards
* @constructor shuffle function
* @param allCardList
* @param arrayClassInfo
* @param index
*/
function shuffleCards() {
  // >> shuffle allCardList, change html class
  allCardList.each(function(index) {
    arrayClassInfo[index] = $(this).attr('class');
  });
  shuffle(arrayClassInfo);
  allCardList.each(function(index) {
    $(this).attr('class', arrayClassInfo[index]);
  });
}

/**
* @description Start game timer
* @param timeCount
*/
function startTimer(){
  timeCount = Math.round((new Date - start) / 1000, 0);
  $('.timer').text('Timer:  ' + timeCount + ' Seconds');
}

/**
* @description Stop game timer
* @constructor clearInterval
* @param gameTimer
*/
function stopTimer(){
  clearInterval(gameTimer);
}

/**
* @description Restart game
* @constructor reload
*/
function restartGame(){
  location.reload();
}

/**
* @description Count number of moves
* @param moveCount
*/
function addMoveCount(){
  moveCount += 1;
  $('.moves').text(moveCount);
}

/**
* @description Star reduction count
* @constructor hideStar
* @param moveCount
* @param starCount
*/
function checkStars(){
  if (moveCount === 25){
    hideStar($('#star3'));
    starCount-= 1;
  } else if (moveCount === 35){
    hideStar($('#star2'));
    starCount-= 1;
  } else if (moveCount === 40){
    hideStar($('#star1'))
    starCount-= 1;
  }
}

/**
* @description Hide star
* @param {ID} $param - star ID
*/
function hideStar($param){
  $param.hide();
}

/**
* @description Card class toggle open show
* @param {object} $param - card selected
*/
function toggleOpenShow($param){
  $param.toggleClass( 'open show' );
}

/**
* @description Creates class list of cards createClickedCardList
* @param {object} $param - card selected
* @param {number} count
*/
function createClassList($param, count){
  clickClassList[count] = $param.children().attr('class');
}

/**
* @description Creates list of clicked cards
* @param {object} $param - card selected
* @param {number} count
*/
function createClickedCardList($param, count){
  clickCardList[count] = $param;
}

/**
* @description Clear clicked card lists
*/
function clearOpenList(){
  clickClassList = [];
  clickCardList = [];
}

/**
* @description Change class to wrong when not match
* @param {object} $param - clickCardList
*/
function addWrong($param){
  $param.toggleClass('wrong');
}

/**
* @description Change class to correct when match
* @param {object} $param - clickCardList
*/
function addCorrect($param){
  $param.toggleClass('correct');
}

/**
* @description Rotate card back to blank
* @param {object} $param - clickCardList
*/
function flipBack($param){
  $param.slideUp();
  $param.removeClass('open show wrong');
  $param.fadeIn();
  $param.on('click');
}

/**
* @description Keep showing card and check if all cards matched
* @param {object} $param - clickCardList
*/
function flipKeep($param){
  $param.off('click');
  $param.slideUp();
  $param.removeClass('open show correct');
  $param.addClass('match');
  $param.fadeIn();
  checkAllCardsMatched();
}

/**
* @description Get total of 'match' cards
* @returns {number} Length of matched cards
*/
let listCardsMatchLength = function() {
  return $('.deck .card.match').length;
};

/**
* @description Get totals and show modal if all cards are matched
*/
function checkAllCardsMatched(){
  //if (listCardsMatchLength() === 2) {
  if (listCardsMatchLength() === allCardList.length) {
  stopTimer();
  getTotalMoves();
  getTotalSeconds();
  getStarRating();
  modal.style.display = 'block';
  let bttn = document.getElementById('restartGameButton');
  bttn.onclick = function() {
    restartGame();
    }
  }
}

/**
* @description Get final timer count
*/
function getTotalSeconds(){
  $('.totalSeconds').text(timeCount);
}

/**
* @description Get final star rating
*/
function getStarRating() {
  $('.starRating').text(starCount);
}

/**
* @description Get final number of moves
*/
function getTotalMoves() {
  $('.totalMoves').text(moveCount);
}

/**
* @description Change background-color
* @param {string} newcolor - selected color
*/
function bckgrnd(newcolor){
  $( '.container' ).css( 'background-color', newcolor);
}
