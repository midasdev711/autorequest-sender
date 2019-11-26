chrome.runtime.onMessage.addListener(
  async function(request, sender, sendResponse) {
    if( request.message !== null) {
      console.log(request.message);
      var customerReturnChecked = request.message;

      var pageTotal = document.querySelectorAll('ul[class="a-pagination"] span li').length;

      var dateFrom = new Date(document.querySelectorAll('input[data-input="start"]')[0].value).getTime();
      var dateTo = new Date(document.querySelectorAll('input[data-input="start"]')[1].value).getTime() + 86399000;

      var pageUrlList = [];

      for (let i = 1; i <= pageTotal; i ++) {
        let tmp = `https://sellercentral.amazon.com/orders-v3?page=${i}&date-range=${dateFrom}-${dateTo}`;
        pageUrlList.push(tmp);
      }

      var reviewUrlList = [];
      var marketPlaceId = document.getElementById('a-page').querySelector('img').src.split('/')[7].split(':')[0];

      function getOrderList(pageUrl) {
        return new Promise((resolve, reject) => {
          var myWindow = window.open(pageUrl, "_blank", 'width=100px, height=100px');
          if (myWindow) {
            myWindow.onload = () => {
              setTimeout(() => { 
                var orderList = myWindow.document.querySelectorAll('table[id="orders-table"] tbody tr');
                orderList.forEach(async(e, i) => {
                  let shippedStatus = e.getElementsByClassName('shipped-status')[0];
                  if (shippedStatus && shippedStatus.innerText == 'Payment complete') {
                    let orderId = e.querySelectorAll('td:nth-of-type(3) a')[0].innerText;
                    let isCustomerReturn = e.querySelectorAll('div[class="order-status-column"] span[class="secondary-status refund-is-applied"]');
                    if (customerReturnChecked) {
                      let reviewUrl = `https://sellercentral.amazon.com/messaging/reviews?orderId=${orderId}&marketplaceId=${marketPlaceId}`;
                      reviewUrlList.push(reviewUrl);
                    } else {
                      if (isCustomerReturn.length == 0) {
                        let reviewUrl = `https://sellercentral.amazon.com/messaging/reviews?orderId=${orderId}&marketplaceId=${marketPlaceId}`;
                        reviewUrlList.push(reviewUrl);
                      }
                    }
                  }
                });
                setTimeout(function() {
                  myWindow.close();
                  resolve(true);
                }, 1000);
              }, 2000);
            };
          }
        })
      }
      
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

      pageUrlList.reduce((promise, url) => {      
        return promise.then(() => {
          return getOrderList(url);
        });
      }, Promise.resolve()).then(_ => {
        reviewUrlList.reduce( (promise, url) => {      
          return promise.then(() => {
            return clickReview(url);
          });
        }, Promise.resolve());
      });
    }
  }
);

function start(){
    alert("started");
}