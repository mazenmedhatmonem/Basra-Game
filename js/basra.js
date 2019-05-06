// Variable Declerations
var computer_cards  = document.getElementById('co-img-div');
var ground_cards    = document.getElementById('gr-img-div');
var player_cards    = document.getElementById('pl-img-div');
var com_cards_arr   = new Array();
var gr_cards_arr    = new Array();
var pl_cards_arr    = new Array();
var deck_cards      = new Array();
var player_score = {
    score:0,
    div_element:document.getElementById('player-score')
};
var computer_score = {
    score:0,
    div_element:document.getElementById('compute-score')
};
var compF=0;
var jack_Flag = 1;
var turn_Count = 0;
var cp_Event = new Event('computer_Click');
var div_Flag;

//Class Declerations
class myCard{
    constructor(_name)
    {
        this.src="./images/"+_name+".png";
        
        this.id=parseInt(Math.random().toFixed(4).toString().split(".")[1]);
        if(this.src == "./images/7_of_diamonds.png")
        {
           this.value="kommy";
        }
        else
        {
           this.value=_name.split("_")[0];
        }
    }
}

// Events
document.getElementById('btn').addEventListener('click',function(){
    startNewRound(true);
});

// Create Deck
function createDeck()
{
    var value=[1,2,3,4,5,6,7,8,9,10,"king","jack","queen"];
    var suit=["clubs","diamonds","hearts","spades"];
    
    for(i=0;i<value.length;i++)
    {
        for(j=0;j<suit.length;j++)
        {
            deck_cards.push(new myCard(value[i]+"_of_"+suit[j]));
        }
    }
    // Shuffle The Deck
    deck_cards = deck_cards.sort(function (a,b){return a.id-b.id;});
}

// Function For Giving Cards To Two Parameters (the array that will hold the card,the div element that will append the image cards)
function giveCards(cardsArray,divElement,player_type)
{
    if(player_type == "ground")    // Give The Ground The Cards
    {
        for(i=0;i<4;i++)
        {
            var __card = deck_cards.pop();
            while(__card.value == "jack" || __card.src == "./images/7_of_diamonds.png")
            {
                deck_cards.splice((deck_cards.length/2),0,__card);
                __card = deck_cards.pop();
            }
            cardsArray[i] = __card;
        }
    }
    else            // Give Any One Else The Cards
    {
        for(i=0;i<4;i++)
        {
            cardsArray[i] = deck_cards.pop();
        }
    }
    for(i=0;i<cardsArray.length;i++)
    {
        var cur_image = document.createElement('img');
        cur_image.className = "img-s";
        if(player_type == "computer")
        {cur_image.src = "./images/facedown.png";}
        else
        {cur_image.src = cardsArray[i].src;}
        cur_image.alt = cardsArray[i].value;
        cur_image.id  = cardsArray[i].id;
        divElement.appendChild(cur_image);
    }
}

// Function To Set The Event For Player Cards
function setTheEvent()
{
    var player_images = player_cards.getElementsByTagName('img');
    var computer_images = computer_cards.getElementsByTagName('img');
    
    for(i=0;i<4;i++)
    {
        
        player_images[i].addEventListener('click',function (){
            turn_Count++;
            play(pl_cards_arr,player_score);
            computer_images[0].dispatchEvent(cp_Event);
        });  
        
        computer_images[i].addEventListener('computer_Click',function (){
            play(com_cards_arr,computer_score);

            if(turn_Count == 4 && deck_cards.length)
            {
                startNewRound();
                turn_Count = 0;
            }
            else if(turn_Count == 4 && deck_cards.length == 0)
            {
                if(div_Flag == "player-score")
                {
                   player_score.score += gr_cards_arr.length;
                   player_score.div_element.innerText = player_score.score; 
                }
                else
                {
                   computer_score.score += gr_cards_arr.length;
                   computer_score.div_element.innerText = computer_score.score;
                }
                if(gr_cards_arr.length)
                {
                    ground_cards.innerHTML = "";
                }
                
                setTimeout(function(){
                    if(player_score.score > computer_score.score)
                    {alert("Player Win");}
                    else
                    {alert("Computer With Random Choice Win");}
                },500);
            }
        });
    }
}

// Function For Playing 
function play(player_array,__score)
{
    var match_at_least_once = 0;
    var _card = event.target;
    //Get The Index In The Player Array
    var _index = 0;    
    while(player_array[_index].id != _card.id){_index++;}
    
    document.getElementById("computer_card").getElementsByTagName('img')[0].src = player_array[_index].src;
        if(_card.alt == "jack" || _card.alt == "kommy" ) //If The Card Is Jack Or Kommy
    {
        match_at_least_once = 1;
        //Set The Flag For The Basra
        jack_Flag = 0;
        // Empty the ground DIV
        ground_cards.innerHTML="";
        // Calculate the score
        __score.score = parseInt(__score.score) + gr_cards_arr.length;
        __score.div_element.innerText = __score.score;
        // Empyt the ground ARRAY
        gr_cards_arr = [];        
    }
    else
    {
        //Take Every Single Card On The Ground
        for(i=0;i<gr_cards_arr.length;i++)
        {
            if(_card.alt == gr_cards_arr[i].value)
            {
                match_at_least_once = 1;
                // Remove From ground DIV
                ground_cards.removeChild(document.getElementById(gr_cards_arr[i].id));
                // Remove From Ground ARRAY
                gr_cards_arr.splice(i,1);
                // Increse The Score With One
                __score.score++;
                __score.div_element.innerText = __score.score;
                i--;
            }
        }
        var third_arr = new Array();
        //The Three Values
        for(i=0;i<gr_cards_arr.length-2;i++)
        {
            for(j=i+1;j<gr_cards_arr.length-1;j++)
            {
                for(k=j+1;k<gr_cards_arr.length;k++)
                { if(parseInt(gr_cards_arr[i].value)+parseInt(gr_cards_arr[j].value)+parseInt(gr_cards_arr[k].value) == _card.alt)
                    {
                        third_arr[third_arr.length] = [i,j,k];
                    }
                }
            }
        }
        if(third_arr.length)
        {
            match_at_least_once = 1;
            for(i=0;i<third_arr.length-1;i++)
            {
               for(j=i+1;j<third_arr.length;j++)
               {
                  if((third_arr[i][0] == third_arr[j][0]) || (third_arr[i][0] == third_arr[j][1]) || 
                     (third_arr[i][0] == third_arr[j][2]) || (third_arr[i][1] == third_arr[j][0]) || 
                     (third_arr[i][1] == third_arr[j][1]) || (third_arr[i][1] == third_arr[j][2]) ||
                     (third_arr[i][2] == third_arr[j][0]) || (third_arr[i][2] == third_arr[j][1]) ||
                     (third_arr[i][2] == third_arr[j][2]))
                  {
                      third_arr.splice(j,1);
                  }
               }
            }
            
            
            // Delete The Cards From Ground And Array According To Second Array
            for(i=0;i<third_arr.length;i++)
            {      
                console.log(third_arr);
                //Remove From Ground DIV
                ground_cards.removeChild(document.getElementById(gr_cards_arr[third_arr[i][0]].id));
                ground_cards.removeChild(document.getElementById(gr_cards_arr[third_arr[i][1]].id));
                ground_cards.removeChild(document.getElementById(gr_cards_arr[third_arr[i][2]].id));
                //Remove From Ground ARRAY
                gr_cards_arr.splice(third_arr[i][0],1);
                gr_cards_arr.splice((third_arr[i][1])-1,1);
                gr_cards_arr.splice((third_arr[i][2])-2,1);
                //Increase Score
                __score.score += 3;
                __score.div_element.innerText = __score.score;
            }
        }        
        
        var secondArr = [];
        //Take The Doubled Card
        for(i=0;i<gr_cards_arr.length-1;i++)
        {
            for(j=i+1;j<gr_cards_arr.length;j++)
            {
                if(parseInt(gr_cards_arr[i].value) + parseInt(gr_cards_arr[j].value) == _card.alt)
                {
                    secondArr[secondArr.length] = [i,j];
                }
                
            }
        }
        // If The Array Has Values
        if(secondArr.length)
        {
            match_at_least_once = 1;
            for(i=0;i<secondArr.length-1;i++)
            {
               for(j=i+1;j<secondArr.length;j++)
               {
                  if((secondArr[i][0] == secondArr[j][0]) || (secondArr[i][0] == secondArr[j][1]) || 
                     (secondArr[i][1] == secondArr[j][0]) || (secondArr[i][1] == secondArr[j][1]))
                  {
                      secondArr.splice(j,1);
                  }
               }
            }
            
            // Delete The Cards From Ground And Array According To Second Array
            for(i=0;i<secondArr.length;i++)
            {      
                //Remove From Ground DIV
                ground_cards.removeChild(document.getElementById(gr_cards_arr[secondArr[i][0]].id));
                ground_cards.removeChild(document.getElementById(gr_cards_arr[secondArr[i][1]].id));
                //Remove From Ground ARRAY
                gr_cards_arr.splice(secondArr[i][0],1);
                gr_cards_arr.splice((secondArr[i][1])-1,1);
                //Increase Score
                __score.score += 2;
                __score.div_element.innerText = __score.score;
            }
        }
        
    }
    if(match_at_least_once)
    {
        //Remove The Element From Player DIV
        _card.parentNode.removeChild(_card);
        
        //Remove The Element From Player ARRAY        
        player_array.splice(_index,1);
        
        //Increase The Score
        __score.score++;
        if(gr_cards_arr.length == 0 && jack_Flag){__score.score += 10;}
        jack_Flag = 1;
        __score.div_element.innerText = __score.score; 
        
        div_Flag = __score.div_element.id;
    }
    else
    {
        //Append To Ground ARRAY
        gr_cards_arr.push(player_array[_index]);
        
        //Append To Ground DIV
        _card.parentNode.removeChild(_card);
        var gr_Image = document.createElement('img');
        gr_Image.className = "img-s";
        gr_Image.src = player_array[_index].src;
        gr_Image.alt = player_array[_index].value;
        gr_Image.id  = player_array[_index].id;
        ground_cards.appendChild(gr_Image);
        
        //Remove From Player ARRAY
        player_array.splice(_index,1);
    }
}
// Function For Start The Game
function startNewRound(start) 
{
    if(start)
    {
        createDeck();    
        giveCards(gr_cards_arr, ground_cards, "ground");
        document.getElementById('btn').style.display = "none";
    }
    giveCards(pl_cards_arr, player_cards);
    giveCards(com_cards_arr, computer_cards,"computer");
    setTheEvent();
}