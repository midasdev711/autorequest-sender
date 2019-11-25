chrome.runtime.onMessage.addListener(
  async function(request, sender, sendResponse) {
    if( request.message !== null) {
      console.log(request.message);
      // var percent = request.message

      var pagenationNumber = document.querySelectorAll('li[class="a-normal"]');
      var pageTotal = parseInt(pagenationNumber[pagenationNumber.length - 1].innerText);

      var dateFrom = new Date(document.querySelectorAll('input[data-input="start"]')[0].value).getTime();
      var dateTo = new Date(document.querySelectorAll('input[data-input="start"]')[1].value).getTime();

      var orderList = document.querySelectorAll('table[id="orders-table"] tbody tr');
      let marketPlaceId = document.getElementById('a-page').querySelector('img').src.split('/')[7].split(':')[0];

      let reviewUrlList = [];

      orderList.forEach(async(e, i) => {
        let shippedStatus = e.getElementsByClassName('shipped-status')[0];
        if (shippedStatus && shippedStatus.innerText == 'Payment complete') {
          let orderId = e.querySelectorAll('td:nth-of-type(3) a')[0].innerText;
          let reviewUrl = `https://sellercentral.amazon.com/messaging/reviews?orderId=${orderId}&marketplaceId=${marketPlaceId}`;
          reviewUrlList.push(reviewUrl);
        }
      });

      function clickReview(reviewUrl) {
        return new Promise((resolve, reject) => {
          var myWindow = window.open(reviewUrl, "_blank", 'width=100px, height=100px');
          if (myWindow) {
            myWindow.onload = function(){
              setTimeout(function(){ 
                var buttons = myWindow.document.querySelectorAll('div[class="ayb-reviews-button-container"] button');
                let delayClose = 0;
                if (buttons.length > 1) {
                  console.log("- find buttons - ", reviewUrl) 
                  buttons[1].click();
                  delayClose = 2000;
                }
                setTimeout(function() {
                  myWindow.close();
                  resolve(true);
                }, delayClose);
              }, 2000);
            };
          }
        })
      }
      reviewUrlList.reduce( (promise, url) => {      
        return promise.then(() => {
          return clickReview(url);
        });
      }, Promise.resolve());
    }
  }
);

function start(){
    alert("started");
}