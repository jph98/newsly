function space() {
    return "&nbsp;";
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

function renderMetadata() {
    var request = new XMLHttpRequest();
    request.open("GET", "./resources/metadata.json", false);
    request.send(null);
    var metadata = JSON.parse(request.responseText);

    var dt = document.getElementById("welcomemessage");
    dt.innerHTML = "Good " + this.getMessage() + " " + metadata.yourfirstname;    
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

function renderWordOfTheDay() {
    $.ajax({
        url: "https://www.dictionary.com/e/word-of-the-day/",
        dataType: 'text',
        success: function(data) {

            $(data).find("div.wotd-item-headword__word > h1").each(function() {
                var text = $(this).text();
                console.log(text);
            });             
        }
   });
}

window.onload = function() {
    var dt = document.getElementById("datetime");
    dt.innerHTML = this.displayDateTime();    

    this.renderMetadata();
    this.renderSites();
    this.renderWordOfTheDay();
}
