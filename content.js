chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    //  If error, pop alert
    if(request.error) {
      alert(request.error)
    }

    //  This is where the JSON payload will be returned and we will need to handle 
    //  the csv conversion based on the data returned here
    if(request.payload) {
      //  *********************************** //
      //  You will need to figure out what    //
      //  from the request to send to the     // 
      //  createCSV method                    //
      //  *********************************** //
      createCSV(request.payload.report);
    }

    //  Pick off the right request header to get the bearer token to fetch our data
    if(request.headers && request.headers.requestHeaders) {
      const headers = request.headers.requestHeaders;
      for(const header of headers) {
        if(header.name === 'Authorization') {
          sendResponse({authToken: {found: true, token: header.value, url: request.headers.url }})
        }        
      }           
    }
  }
);

function createCSV(JSONData, ShowLabel=true) {
     //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
     const arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    
     let CSV = '';    
     //Set Report title in first row or line
     
     CSV += 'OperationsData' + '\r\n\n';
 
     //This condition will generate the Label/Header
     if (ShowLabel) {
         let row = "";
         
         //This loop will extract the label from 1st index of on array
         for (let index in arrData[0]) {
             
             //Now convert each value to string and comma-seprated
             row += index + ',';
         }
 
         row = row.slice(0, -1);
         
         //append Label row with line break
         CSV += row + '\r\n';
     }
     
     //1st loop is to extract each row
     for (let i = 0; i < arrData.length; i++) {
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
     const fileName = "MyReport_"; 
     
     //Initialize file format you want csv or xls
     const uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

     const link = document.createElement("a");    
     link.href = uri;
     
     //set the visibility hidden so it will not effect on your web-layout
     link.style = "visibility:hidden";
     link.download = fileName + ".csv";
     
     //this part will append the anchor tag and remove it after automatic click
     document.body.appendChild(link);
     link.click();
     document.body.removeChild(link);
}