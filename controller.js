
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