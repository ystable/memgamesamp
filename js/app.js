/* Memory Game */

// todo todo
// show all data on alert
// disable timer and click features at end

// adjust click-star rating
// clean up log
// check formatting
// post on git

var clickClassList = [];             //class list of clicked cards
var clickCardList =[];                   //list of cards clicked (out of 2 cards)
var clickCount = 0;
var allCardList = $('.deck .card .fa');          // list of all cards
var arrayClassInfo=[];

var moveCount = 0;
var starCount = 3;
var start = new Date;
var gameTimer = setInterval(startTimer, 1000);

var modal = document.getElementById('modal');

shuffleCards();

// -- click event function --
var clickAction = $( ".deck .card" ).click(function(event) {
  console.log('<<<<< new click >>>>>>');

  addMoveCount();
  checkStars();



  toggleOpenShow($(this));
  if ($(this).hasClass('open')){
    clickCount += 1;
    createClassList($(this), clickCount);



    // if one card clicked add to list
    if (clickCount === 1 ){
      console.log('\n* if clickCount = 1');

      createClickedCardList($(this), clickCount);
      // console.log('clickCardList[clickCount]) = $(this); = ', clickCardList[clickCount]);
      // console.log('clickCardList = ', clickCardList);
      //
      // console.log('> clickClassList[clickCount] = ', clickClassList[clickCount]);
      // console.log('one card clicked clickClassList = ', clickClassList);

    // if two cards clicked then check for match
    } else if (clickCount === 2) {
      console.log('\n** if clickCount = 2');

      // create clickCardList
      createClickedCardList($(this), clickCount);

      // console.log(' @ inside clickCount = 2 : clickClassList[1 and 2] = ', clickClassList[1], clickClassList[2]);
      // console.log('clickCardList[clickCount]) = $(this); = ', clickCardList[clickCount]);
      // console.log('> clickClassList[clickCount] = ', clickClassList[clickCount]);
      // console.log('two card clicked clickClassList = ', clickClassList);
      // console.log('\n');

      // -- check for match --
      // if match occurs ->
      if (clickClassList[clickCount] != undefined && clickClassList[clickCount] === clickClassList[clickCount-1] ) {
        //console.log('\n - inside match occurs -');

        // adds class 'correct'
        setTimeout(addCorrect, 300, clickCardList[clickCount]);
        setTimeout(addCorrect, 300, clickCardList[clickCount-1]);

        // add class 'match' and checks if all cards matched
        setTimeout( flipKeep, 1000, clickCardList[clickCount]);
        setTimeout( flipKeep, 1000, clickCardList[clickCount-1]);
        console.log('cards matched');
        clickCount = 0;
        bckgrnd('darkgreen');

      } else {
        // if not a match - reset cards
        setTimeout(addWrong, 300, clickCardList[clickCount]);
        setTimeout(addWrong, 300, clickCardList[clickCount-1]);
        setTimeout( flipBack, 1000, clickCardList[clickCount]);
        setTimeout( flipBack, 1000, clickCardList[clickCount-1]);
        clickCount = 0;
        // console.log('>no match if > removeOpenShow :  clickCount = ', clickCount);
        // console.log('not a match reset cards clickClassList = ', clickClassList);
        bckgrnd('darkorange');
      };

      // clear arrays
      clearOpenList();
      // console.log('clear array clickClassList = ', clickClassList);
      // console.log('clickCardList = ', clickCardList);
    };
  } else {
    // doubleclick closes open card
    if (clickCount != 0) {
      clickCount -= 1;
    };
  };
});

// restarts page upon restart click
$('.restart').on('click', restartGame);




// < functions >
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function shuffleCards() {
  // >> shuffle allCardList, change html class
  allCardList.each(function(index) {
    arrayClassInfo[index] = $(this).attr('class');
  });
  shuffle(arrayClassInfo);
  allCardList.each(function(index) {
    $(this).attr('class', arrayClassInfo[index]);
  });

};

// - - functions - -

// start game timer
function startTimer(){
    timeCount = Math.round((new Date - start) / 1000, 0);
    $('.timer').text('Timer:  ' + timeCount + " Seconds");
};

// stop game timer
function stopTimer(){
  clearInterval(gameTimer);
};

// reload page
function restartGame(){
  location.reload();
};

// count number of clicks
function addMoveCount(){
  moveCount += 1;
  $('.moves').text(moveCount);
};

// star reduction
function checkStars(){
  if (moveCount === 5){
    hideStar($('#star3'));
    starCount-= 1;
  } else if (moveCount === 30){
    hideStar($('#star2'));
    starCount-= 1;
  } else if (moveCount === 40){
    hideStar($('#star1'))
    starCount-= 1;
  }
};

// hide functions - to run //hideStar($("#star1"));
// from (https://stackoverflow.com/questions/12093192/how-to-create-a-jquery-function-a-new-jquery-method-or-plugin)
function hideStar($param){
  $param.hide();
};


// card toggle class open show
function toggleOpenShow($param){
  $param.toggleClass( "open show" );
};

// creates list of click card class - was clickCardListfunc
function createClassList($param, count){
  clickClassList[count] = $param.children().attr('class');
};

// creates list of cards
function createClickedCardList($param, count){
  clickCardList[count] = $param;
};

// clear lists
function clearOpenList(){
  clickClassList = [];
  clickCardList = [];
};

// turn card red when not match
function addWrong($param){
  $param.toggleClass('wrong');
};

function addCorrect($param){
  $param.toggleClass('correct');
};

// rotate card back to blank
function flipBack($param){
  $param.slideUp();
  $param.removeClass('open show wrong');
  $param.fadeIn();
  $param.on('click');

};

// rotate card keep showing
function flipKeep($param){
  $param.off('click');
  $param.slideUp();
  $param.removeClass('open show correct');
  $param.addClass('match');
  $param.fadeIn();
  // check if all cards = match
  checkAllCardsMatched();
};



// todo check diff function Styles
// deck match, returns length of 'match' cards
var listCardsMatchLength = function() {
  return $('.deck .card.match').length;
};

// check match length = number of cards length - allCardList.length
function checkAllCardsMatched(){
  //console.log('``` inside checkAllCardsMatched `````');
  if (listCardsMatchLength() === 2) {
  //if (listCardsMatchLength() === allCardList.length) {
  stopTimer();

  getTotalMoves();
  getTotalSeconds();
  getStarRating();
  // todo
  modal.style.display = "block";

  var btn = document.getElementById('restartGameButton');
  btn.onclick = function() {
    restartGame();
  }

    console.log(';;;;;;;;;; function ;;;;; match compare  !!!!!!!');
    //prompt('this is a prompt modal', 100);
    bckgrnd('darkblue');
    // //confirm('this is a confirm modal');
    // if (confirm("Congratulations\nClick OK to play again!")) {
    //     //alert('Ok pressed\nmovecount = ', moveCount);
    //     //alert('starCount = ', starCount)
    //     //alert('timeCount = ', timeCount)
    //     console.log('< restart game >');
    //     // restart
    //     restartGame();
    // } else {
    //     //alert('cancel pressed  timeCount = ', timeCount)
    //     // todo
    //
    //     console.log('< end game >');
    //
    //     // add - disable game functionality
    //
    // }

    //alert(' Congratulations, you got them all !!!!!!\n would you like to play again?\n it took 333 seconds to win\n and your star rating is 22.')
    // todo - add reaction to alert box
    // todo - add end of game > disable all features, stop time
  }
}

// get final timer count
function getTotalSeconds(){
  $('.totalSeconds').text(timeCount);
}

// get final star rating
function getStarRating() {
  $('.starRating').text(starCount);
}

// get final number of moves
function getTotalMoves() {
  $('.totalMoves').text(moveCount);
}

// background-color function - param 'newcolor' - to run //bckgrnd('blue');
function bckgrnd(newcolor){
  $( '.container' ).css( 'background-color', newcolor);
};

// function somethinge(){
//   console.log('this is sommethinge e ');
//   var listCardsMatch = $('.card.match');
//   console.log('listCardsMatch = ', listCardsMatch.length);
// }
// $(somethinge());




/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
        toggleOpenShow($(this));
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)

 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)

 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
