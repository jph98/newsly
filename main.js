function space() {
    return "&nbsp;";
}  

function getDateKey() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); 
    var yyyy = today.getFullYear();
    return dd + '-' + mm + '-' + yyyy;
}

function displayDateTime() {

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); 
    var yyyy = today.getFullYear();
    var ampm = today.getHours() >= 12 ? 'pm' : 'am';
    var hour = today.getHours() < 10 ? "0" + today.getHours(): today.getHours();
    var mins = today.getMinutes() < 10 ? "0" + today.getMinutes(): today.getMinutes();

    return hour + ':' + mins + ampm;
}

function getMessage() {
    var today = new Date();
    if (today.getHours() < 12) return "Morning";
    if (today.getHours() > 17) return "Evening";
    return "Afternoon";
}

function display(obj) {
    console.log(obj)
}

/**
 * Chrome Storage 
 */
function storeValue(key, value) {    
    chrome.storage.local.set({ [key]: value }, function() {
        console.log('set ' + key + ' ' + value);
    });            
}

function getValue(key, cb) {
    chrome.storage.local.get([key], function (obj) {
        cb(obj);
    });
}

function displayGreetingValue(obj) {
    console.log(obj);
    var dt = document.getElementById("welcomemessage");
    dt.innerHTML = "Good " + getMessage() + " " + obj.firstname;
}

function shouldStoreFirstName(e) {
        
    if (e.keyCode === 13) {                    
        var firstname = document.getElementById("firstname").value;
        storeValue("firstname", firstname);
        setTimeout(function() {
            getValue("firstname", displayGreetingValue);
        }, 1000);
        
    }
}
function displayGreeting(obj) {
    console.log('firstname ' + obj.firstname);
    if (obj.firstname === undefined) {
        console.log("unset");
        var dt = document.getElementById("welcomemessage");    
        dt.innerHTML += "Good " + getMessage() + " <input id='firstname' type='text' placeholder='Enter your name'>";
    } else {
        console.log("set");
        var dt = document.getElementById("welcomemessage");
        dt.innerHTML = "Good " + getMessage() + " " + obj.firstname;
    }
}



function renderMetadata() {
    // var request = new XMLHttpRequest();
    // request.open("GET", "./resources/metadata.json", false);
    // request.send(null);
    // var metadata = JSON.parse(request.responseText);

    this.getValue("firstname", displayGreeting);
}

function renderSites() {

    var request = new XMLHttpRequest();
    request.open("GET", "./resources/sites.json", false);
    request.send(null)        
    var siteCategories = JSON.parse(request.responseText);

    var categoryNames = Object.keys(siteCategories);
    var sitesElement = document.getElementById("sites");

    for (var n = 0; n < categoryNames.length; n++) {

        var catElement = document.createElement("div");                
        catElement.classList.add("text-center");
        catElement.classList.add("col-xs-6");
        var catTopLevel = sitesElement.appendChild(catElement);
        var catName = categoryNames[n];
        var catTitleElement = document.createElement("h4");
        catTopLevel.appendChild(catTitleElement);
        catTitleElement.innerHTML = catName;
        catTitleElement.classList.add("cat-title");

        var sites = Object.values(siteCategories[catName]);
        
        for (var i = 0; i < sites.length; i++) {
            var catText = document.createElement("p");  
                    
            var catLink = document.createElement("a");  
            catLink.href = sites[i].url;
            catLink.innerHTML = sites[i].description;
            catLink.classList.add("cat-link");
            catText.appendChild(catLink);
            catElement.appendChild(catText);
            catElement.classList.add("cat-text");
        }
    }
}

function getWordFromDictionary(metadata) {

    $.ajax({ url: "https://wordsapiv1.p.mashape.com/words?random=true", 
                     type: 'GET',
                     // Access-Control-Allow-Origin
                     headers: { "app_id": metadata['od-appid'], 
                                "app_key": metadata['od-key'] },
                     success: function(res) {
                        console.log(res);                
                        return res;
                    }
    });  
}
function renderQuote() {

    var request = new XMLHttpRequest();
    request.open("GET", "./resources/quotes.json", false);
    request.send(null)        
    var quotes = JSON.parse(request.responseText);
    const randIndex = Math.floor(Math.random() * quotes.length)
    const quote = quotes[randIndex];
    var dt = document.getElementById("quote");
    dt.innerHTML = "\"" + quote.text + "\" " + quote.author;    

}

function renderWordOfTheDay() {

    // TODO
    var request = new XMLHttpRequest();
    request.open("GET", "./resources/metadata.json", false);
    request.send(null)        
    var metadata = JSON.parse(request.responseText);
    const key = 'wotd' + this.getDateKey();        
}

function getKeywordsForSeason() {

    var today = new Date();    
    var mm = String(today.getMonth() + 1).padStart(2, '0'); 

    if (mm < 2 && mm > 11) {
        return "winter,snow"
    }

    if (mm >= 2 && mm <= 4) {
        return "spring"
    }

    if (mm >= 5 && mm <= 9) {
        return "summer,beach,sun"
    }

    if (mm > 9 && mm < 12) {
        return "autumn,leaves"
    }

    if (mm == 12) {
        return "christmas";
    }

}

function getBackgroundUrl(keywords) {

    var xhr = new XMLHttpRequest();
    $.ajax({
        type: "GET",
        url: "https://source.unsplash.com/random?" + keywords,
        xhr: function() {
            return xhr;
        },
        success: function() {
            const url = xhr.responseURL;                   
            setBackground(url);            
        },
        error: function(err) {
            console.log(err);
        }
    });
}

function setBackground(url) {

    const bg = document.getElementById("background");        
    bg.style.height = "100%;" 
    bg.style.backgroundPosition = "center";
    bg.style.backgroundRepeat = "no-repeat";
    bg.style.backgroundSize = "cover";
    const imageUrl = "url('" + url + "')"
    bg.style.backgroundImage = imageUrl;
    return url;
}

function renderBackground() {

    // TODO: render seasonal in the day
    // TODO: Override this with city, night, space if in the night        
    getBackgroundUrl(getKeywordsForSeason());    
}

window.onload = function() {    

    var dt = document.getElementById("datetime");
    dt.innerHTML = this.displayDateTime();    

    window.localStorage.clear();

    this.renderBackground();
    this.renderMetadata();
    this.renderSites();
    //this.renderWordOfTheDay();
    this.renderQuote();    
    
    this.setTimeout(function() {
        var elementExists = document.getElementById("firstname");

        if (elementExists) {
            document.getElementById("firstname").addEventListener("keydown", 
                                                            this.shouldStoreFirstName,
                                                            { once: false, passive: true, capture: true });
            document.getElementById("firstname").focus();
        }

    }, 200);
    
}
