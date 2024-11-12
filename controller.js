//This is the URL of the Google sheet with a 'callback function' with a response we'll pare down to JSON. What's JSON? See: https://en.wikipedia.org/wiki/JSON
//If you want to see the URL of the sheet itself, copy this into your browser: https://docs.google.com/spreadsheets/d/1DA6htKy-Z-8QRkifkLbzlzG2r5YWOKE77JXEJNmq45g/. 

sheetIndex = 0;
sheetsFileID = '1DA6htKy-Z-8QRkifkLbzlzG2r5YWOKE77JXEJNmq45g';

var SHEETSRESPONSE = `https://docs.google.com/spreadsheets/d/${sheetsFileID}/gviz/tq?tqx=out:json&tq&gid=${sheetIndex}`

//This waits until the baseline page is loaded and then gets the JSON feed, and as long as it doesn't error, calls the readdata function to start taking that feed and drawing the HVAC parts. The way it does this is through 'AJAX', which stands for 'Asynchronous JavaScript And XML'. This allows you to go and get data from a server/service (like Google Sheets) after the page has loaded. 

/*This is probably your first time seeing options/settings supplied to a JS function with key:value pairs. 	
 */

document.addEventListener('DOMContentLoaded', function () {
  fetch(SHEETSRESPONSE)
  	//this converts whatever it gets back into text, which is what we're assuming we'll work with in the code that follows
    .then(response => response.text())
    //this passes whatever came from the prior line to the prepData function, which makes some updates to it and then makes sure it's in a format called 'JSON'
    .then(textResponse => prepData(textResponse))
    //this then passes that data to a function that manages creating the div's
    .then(partFeed => loadParts(partFeed))
    //BUT if this errors, this line catches that and posts it to the console
    .catch(error => console.error('Fetch error:', error));
});

function prepData(data) {
  //response has a junk line at top (/*O_o*/), so we split it on the newline character and get the second row, [1]
  data = data.split("\n");
  //this is a kind of hacky solution to extracting the JSON body from the sheets response, using a regular expression to remove the stuff we don't want- OK for a proof of concept; and the HinH team is going to use Firebase for the 'production' version anyway
    //What's JSON? It's a format for encapsulating and describing data. It's very common as a format for digital services exchange information through API's. If you want to see this JSON, you can download this file  and ask chatGPT, etc. to set it up as JSON: https://docs.google.com/spreadsheets/d/1DA6htKy-Z-8QRkifkLbzlzG2r5YWOKE77JXEJNmq45g/gviz/tq?tqx=out:json&tq&gid=0
  data = data[1].replace(/google.visualization.Query.setResponse\((.*)\);/, "$1");
  if (isJson(data)) {
    partfeed = JSON.parse(data);
    return (partfeed);
  } else {
    console.log('it is not JSON- yarf');
  }
}

function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}


function loadParts(partfeed) {

  //these statements initialize the variables below, meaning that it puts them in the baseline state we want before we start doing stuff with them
  const firstCol = 1;

  /* This is a for loop that iterates through the rows from the Google Sheet, now JSON objects. What is a for loop? See: https://www.w3schools.com/js/js_loop_for.asp. See also the Codecademy module on Javascript: https://www.codecademy.com/learn/introduction-to-javascript. 
    //The JSON represents a single sheet in Google Sheets. The model is that the sheet has a table, the table has a series of rows, and those rows have values and then sometimes supplemental items. JS also has built-in facilities to index a JSON scheme where, for example, this statement:
  …partfeed.table.rows[i].c[j].v;
  based on the schema from Google Sheets and the JSON response it got, which is 'partfeed', is able to reference the value of cell in the jth column of the ith row of the table element. There's a pretty good written tutorial on JSON here, if you're interested: 
  https://www.w3schools.com/js/js_json_syntax.asp
  */
  for (var i = 0; i < partfeed.table.rows.length; i++) {
    //partfeed[i] indexes a given row in the array of data that has the JSON content. What is an array? See: https://www.w3schools.com/js/js_arrays.asp or check out the Codecademy tutorial above (module on arrays). 
    var row = [];
    //console.log('we are on the ' + i + 'th row');

    //this loop puts a row's worth of data, which is one part, into an array and passes it to another function that draws the div

    for (var j = firstCol; j < partfeed.table.rows[i].c.length; j++) {
      console.log('we are on the ' + j + 'th item');
      val = partfeed.table.rows[i].c[j].v;
      console.log(val);
      //since we're iterating from the first column but we still want our arrays to start at 0, we do an offset of 1
      row[j - 1] = val;
    }
    drawDiv(row);
  }
}

//Basically, this function takes a rows-worth/parts-worth of data and maps the right parameters onto JQuery functions that draw the div.
function drawDiv(divData) {
  if (divData == null) return null;

  partNum = divData[0].trim();
  imgURL = divData[1].trim();
  mfr = divData[2].trim();
  model = divData[3].trim();
  type = divData[4].trim();
  price = ("$" + String(divData[5]).trim());
  //for bonus points, fix this so that the price always shows out to to decimal places (cents)
  avail = divData[6].trim();
  orders = String(divData[7]).trim();

  //Write parts div
  var newPartsDiv = document.createElement('div');
  newPartsDiv.className = 'catalog-part';
  newPartsDiv.setAttribute("mfr", mfr);
  newPartsDiv.setAttribute("model", model);
  var partImg = document.createElement('img');
  partImg.setAttribute("src", ("https://" + imgURL));
  newPartsDiv.appendChild(partImg);

  var newOverlayDiv = document.createElement('div');
  newOverlayDiv.className = 'overlay';
  newOverlayDivP = document.createElement('p');
  newOverlayDivP.innerHTML = (mfr + " " + partNum + "<br>" + orders + " Orders <br>" + price + " " + avail);
  newOverlayDiv.appendChild(newOverlayDivP);
  console.log(newOverlayDiv);

  newPartsDiv.appendChild(newOverlayDiv);
  console.log(newPartsDiv);

  var theParent = document.getElementById("parts-content");

  theParent.appendChild(newPartsDiv);
}


document.addEventListener("DOMContentLoaded", function(event) {
  //find the "Go" button in the HTML body
  const goButton = document.getElementById('go-btn');

  //listen for the user clicking on it and if they do, call function 'goClick'
  goButton.addEventListener('click', filterParts);

  function filterParts() {
    //Is the function working?
    console.log('go!');

    //get any values selected in the dropdown and make sure it's working
    selMfr = document.getElementById('ddMfr').value
    selModel = document.getElementById('ddModel').value
    console.log("the selected mfr is " + selMfr + ", and the selected model is " + selModel);

    //filter out items that don't match the dropdown- but only run if a filter's applied
    //get all the parts- that is, items with class "catalog-part"
    var parts = document.getElementsByClassName("catalog-part");
    //go through each one
    for (var i = 0; i < parts.length; i++) {
      //reset to make show anything hidden
      parts.item(i).style.display = "block";
      //if the manufacturer doesn't match the dropdown, then hide it
      if ((selMfr != parts.item(i).getAttribute('mfr')) && (selMfr != "All")) {
        console.log("mfr diff");
        parts.item(i).style.display = "none";
      }
      //...and same for model
      if ((selModel != parts.item(i).getAttribute('model')) && (selModel != "All")) {
        console.log("model diff");
        parts.item(i).style.display = "none";
      }

    }
  }


});
