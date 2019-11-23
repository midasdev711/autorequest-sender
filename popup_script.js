 var percent = null;
 function popup() {
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
    var activeTab = tabs[0];
    percent = "amazon";
    chrome.tabs.sendMessage(activeTab.id, {"message": percent});
   });
}

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("save_btn").addEventListener("click", popup);
});