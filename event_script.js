chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log("requestMessage: " + request.data);
    sendResponse({ data: localStorage.getItem("percent") });
});