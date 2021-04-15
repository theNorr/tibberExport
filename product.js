function storeToken(){ //Function beign called when user clicks on a category in the navbar.
  sessionStorage.clear(); //Empties the sessionStorage
  sessionStorage.setItem("menuChoice", document.getElementById("form1").value); //stores the id of the menu-choice made by user, in a sessionStorage.
  var choice = sessionStorage.getItem("menuChoice");
  writeToDocument()
}

function writeToDocument(cb){ //Function onload of HTML-body of category-page.

  var header = sessionStorage.getItem("menuChoice");  //Gets the menu-choice made by user and stores it in the variable header.
  $(".category-header").html(header); //Using JQuery to set the Category header.

  getData(function(cb) {  //Calls the getData-function and passes in this function.
    data = cb.artiklar; //Stores the response in data.
    showData(data);  //Calls the showData-function and passes in data
  });
}

function getData(choice) {  //Creates the function getData
  let req = new XMLHttpRequest();  //this gives us the method to open connections, to send connections, and close them.
  //XML stands for Extensible Markup Language, which is similar to HTML in the way it structures its data, and it's a precursor to JSON.

  req.onreadystatechange = function() {  //whenever the state changes of our xhr object, we want to run a check.
    if (req.readyState == XMLHttpRequest.DONE) {  //If the ready state is equal to 4 and the status is 200, then do the following:
      cb(JSON.parse(req.responseText));  //cb calls the function that we pass in when calling the getData-function. Before that it takes the API-response and parse it to JSON.
    }
  };

req.open("GET", "https://api.tibber.com/v1-beta/gql", true); //Opens the connection. KAN VARA FEL!
req.setRequestHeader("Authorization: Bearer" + choice); //The key to access the api. KAN VARA FEL!
req.send();
}

function showData(data) {  //Declaration of the function ShowData. Which pushes the HTML below to the screen.
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    
    var CSV = 'sep=,' + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";
        
        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {
            
            //Now convert each value to string and comma-seprated
            row += index + ',';
        }

        row = row.slice(0, -1);
        
        //append Label row with line break
        CSV += row + '\r\n';
    }
    
    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";
        
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);
        
        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {        
        alert("Invalid data");
        return;
    }   
    
    //Generate a file name
    var fileName = "MyReport_";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g,"_");   
    
    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
    
    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension    
    
    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");    
    link.href = uri;
    
    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";
    
    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}