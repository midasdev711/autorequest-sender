var checked = false;
function popup() {
  chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": checked});
  });
}

function checkCustomerReturn() {
  if (document.getElementById('customer_return').checked) {
    checked = true;
  } else {
    checked = false;
  }
}

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("save_btn").addEventListener("click", popup);
  document.getElementById("customer_return").addEventListener("click", checkCustomerReturn);
});