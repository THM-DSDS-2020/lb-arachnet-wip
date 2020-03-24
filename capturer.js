// Script-like spaghetti code, since I haven't programmed Java or object-oriented languages for over 1.5 years. In bioinformatics mainly scripting languages like Julia or Python are used (without object orientation)
// The Capturer catches the requests called by the current webpage and passes them to the Processor to track the requests



// Creating a Listener to listen for the tracking of requests
// Listener is storen in the variable below
var trackRequestListener = Processor.getTrackRequestListener();

// Function to log the URLs, which are sent by visiting a website
// Calling trackRequest from the Processor to determine if its a crossDomain request
function logURL(requestDetails){
    Processor.trackRequest(requestDetails);
}

// Code used from the 2nd tutorial -> Intercepting HTTP-requests
// Using onBeforRequest to call logURL before the requests are sent
// Matching pattern: "<all_urls>" to match all urls
browser.webRequest.onBeforeRequest.addListener(logURL,{urls: ["<all_urls>"]});


