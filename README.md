## Chrome Extension To Fetch Data From "Internal" APIs and Download to CSV

This is the example repo tied to a Chrome extension I wrote for my wife and [blogged about on Dev.to](https://dev.to/polluterofminds/i-built-my-first-chrome-extension-to-improve-the-software-my-wife-uses-464n). 

To use this yourself, you'll need to specify the `MAIN_URL` and the `URL_TO_FETCH_HEADERS_FROM`. What you should supply for these variables is defined in the `background.js` file. 

You will also need to make sure the response data you get from your eventual API request is specified properly before sending it through the CSV converter. See the notes in the `content.js` file. 