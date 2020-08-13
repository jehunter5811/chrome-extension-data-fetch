let dataInMemory = null;
const MAIN_URL = ''; // This is the URL you will eventually make your request for data to
const URL_TO_FETCH_HEADERS_FROM = ''

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    if(dataInMemory) {
      chrome.tabs.sendMessage(activeTab.id, {"payload": dataInMemory });
    } else {
      chrome.tabs.sendMessage(activeTab.id, {"error": 'No data found' });
    }
  });
});

//  Here we are listening for network requests that match our criteria (eg: GET request against whatever URL you specify)

chrome.webRequest.onBeforeSendHeaders.addListener(
  function (info) {
    const requirements =
      (info.method === "GET") &&
      info.url.includes(URL_TO_FETCH_HEADERS_FROM);
    if (requirements) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { headers: info }, async function (
          response
        ) {
          if (response.authToken.found) {
            //  Make post request with token
            const token = response.authToken.token;
            chrome.tabs.sendMessage(tabs[0].id, { testingToken: token })
            const url = response.authToken.url;
            try {
              const data = await fetchData(token);
              dataInMemory = data;          
            } catch (error) {
              console.log(error);
            }
          }
        });
      });
    }
  },
  {
    urls: ["http://*/*", "https://*/*"],
  },
  ["blocking", "requestHeaders"]
);

async function fetchData(token) {
  var myHeaders = new Headers();
  myHeaders.append(
    "Authorization",
    token
  );

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  return new Promise(async (resolve, reject) => {
    try {
      const res = await fetch(
        MAIN_URL,
        requestOptions
      );
  
      const data = await res.json();
      resolve(data);
    } catch (error) {
      reject(error);
    }
  })  
}