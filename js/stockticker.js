var stockMarket = {
    portfolioHistoryLimit : 300,

    stocks : [],
    newsFeed : [],
    cash : 0,
    cashHistory : [],
    netWorthHistory : [],
    nextNewsId : 0,
    messageClearCounter:0,

    init: function () {

        this.stocks = [
            {name: "Gold", price: 100, shares:0, history:[100]},
            {name: "Silver", price: 100, shares:0, history:[100]},
            {name: "Bonds", price: 100, shares:0, history:[100]},
            {name: "Oil", price: 100, shares:0, history:[100]},
            {name: "Industrials", price: 100, shares:0, history:[100]},
            {name: "Grain", price: 100, shares:0, history:[100]}
        ];

        this.newsFeed = [];
        this.cash = 1000;
        this.cashHistory = [this.cash];
        this.netWorthHistory = [this.cash];
        this.nextNewsId = 0;
        this.messageClearCounter = 0
    },

    broadcast:function (entry) {
        this.nextNewsId += 1;

        entry.id = this.nextNewsId;
        this.newsFeed.unshift(entry);
    },

    recordPortfolioHistory: function() {
        this.cashHistory.push(this.cash);

        if (this.cashHistory.length > this.portfolioHistoryLimit) {
            this.cashHistory.shift();
        }

        this.netWorthHistory.push(this.getNetWorth());

        if (this.netWorthHistory.length > this.portfolioHistoryLimit) {
            this.netWorthHistory.shift();
        }
    },

    recordHistory: function() {
        for (var i = 0; i < this.stocks.length; i++) {
            this.stocks[i].history.push(this.stocks[i].price);

            if (this.stocks[i].history.length > 100) {
                this.stocks[i].history.shift();
            }
        }

        this.recordPortfolioHistory();
    },

    update: function() {


        var roll1 = Math.floor(Math.random() * 3 + 1); // action
        var roll2 = Math.floor(Math.random() * 3 + 1) * 5; // amount
        var roll3 = Math.floor(Math.random() * this.stocks.length); // stock choice

        var affectedStock = this.stocks[roll3];

        switch(roll1) {

            case 1:
            if (affectedStock.price >= 100 && affectedStock.shares > 0) {
                var dividend = affectedStock.shares * roll2;
                this.cash += dividend;
            }
            break;

            case 2:
            affectedStock.price += roll2;
            break;

            case 3:
            affectedStock.price -= roll2;
            break;

        }

        if (affectedStock.price >= 200) {

            affectedStock.shares *= 2;
            affectedStock.price = 100;
            this.broadcast({
                stockName: affectedStock.name,
                price: affectedStock.price,
                changeText: "SPLIT",
                direction: "up"
            });

        } else if (affectedStock.price <= 0) {

            affectedStock.shares = 0;
            affectedStock.price = 100;
            this.broadcast({
                stockName: affectedStock.name,
                price: affectedStock.price,
                changeText: "CRASH",
                direction: "down"
            });

        } else if (roll1 === 2 || roll1 === 3) {

            this.broadcast({
                stockName: affectedStock.name,
                price: affectedStock.price,
                changeText: (roll1 === 2 ? "+" : "-") + roll2,
                direction: roll1 === 2 ? "up" : "down"
            });

        }

        this.recordHistory();

        if (this.newsFeed.length > 25) {
            this.newsFeed.pop();
        }
    },

    getStockPrice(stockName) {

        for(var i=0;i < this.stocks.length; i++) {
            if (this.stocks[i].name == stockName) {
                return this.stocks[i].price;
            }
        }

        return -1;
    },

    getStockByName(stockName) {
        for(var i=0;i < this.stocks.length; i++) {
            if (this.stocks[i].name == stockName) {
                return this.stocks[i];
            }
        }
        return null;
    },

    getNetWorth: function() {
        var total = this.cash;

        for (var i = 0; i < this.stocks.length; i++) {
            total += this.stocks[i].shares * this.stocks[i].price;
        }

        return total;
    },

    buyShare(stockName, quantity) {

        //get price
        var thisStock = this.getStockByName(stockName);
        var price = thisStock.price;
        var shareCount = parseInt(quantity, 10) || 1;
        var totalCost = price * shareCount;

        if (this.cash >= totalCost) {
            thisStock.shares += shareCount;
            this.cash -= totalCost;
            this.recordPortfolioHistory();
        } else {
            console.log("You can't afford that stock");
        }

    },

    sellShare(stockName, quantity) {

        var thisStock = this.getStockByName(stockName);
        var shareCount = parseInt(quantity, 10) || 1;

        if (thisStock.shares >= shareCount) {
            this.cash += thisStock.price * shareCount;
            thisStock.shares -= shareCount;
            this.recordPortfolioHistory();
        }

    }
};

stockMarket.init();
stockMarket.interval = setInterval(function() { stockMarket.update()}, 2000);
