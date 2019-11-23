chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message !== null) {
      console.log(request.message);
      // var percent = request.message

      function load(url, callback) {
        var xhr = new XMLHttpRequest();
      
        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
            callback(xhr.response);
          }
        }
      
        xhr.open('GET', url, true);
        
        xhr.send('');
      }

      var pagenationNumber = document.querySelectorAll('li[class="a-normal"]');
      var pageTotal = parseInt(pagenationNumber[pagenationNumber.length - 1].innerText);

      var dateFrom = new Date(document.querySelectorAll('input[data-input="start"]')[0].value).getTime();
      var dateTo = new Date(document.querySelectorAll('input[data-input="start"]')[1].value).getTime();

      var orderList = document.querySelectorAll('table[id="orders-table"] tbody tr');
      let marketPlaceId = document.getElementById('a-page').querySelector('img').src.split('/')[7].split(':')[0];

      let reviewUrlList = [];

      orderList.forEach((e, i) => {
        let shippedStatus = e.getElementsByClassName('shipped-status')[0];
        if (shippedStatus && shippedStatus.innerText == 'Payment complete') {
          let orderId = e.querySelectorAll('td:nth-of-type(3) a')[0].innerText;
          let reviewUrl = `https://sellercentral.amazon.com/messaging/reviews?orderId=${orderId}&marketplaceId=${marketPlaceId}`;
          reviewUrlList.push(reviewUrl);
          var myWindow = window.open(reviewUrl, "_blank", 'width=100px, height=100px');
          var buttons = myWindow.document.querySelectorAll('div[class="ayb-reviews-button-container"] button');
          if (buttons.length > 0) {
            buttons[1].click();
          }
          myWindow.close();
        }
      });
    }
  }
);

function start(){
    alert("started");
}