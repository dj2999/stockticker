function getStockClassName(stockName) {
    if (!stockName) {
        return "";
    }

    return "stock-" + stockName.toLowerCase();
}

function getStockTickerSymbol(stockName) {
    var tickerSymbols = {
        Gold: "GLD",
        Silver: "SLV",
        Bonds: "BND",
        Oil: "OIL",
        Industrials: "IND",
        Grain: "GRN"
    };

    return tickerSymbols[stockName] || stockName.toUpperCase();
}

function formatTickerPrice(price) {
    if (typeof price !== "number") {
        return "--";
    }

    return "$" + price;
}

function formatCurrencyValue(value) {
    if (typeof value !== "number") {
        return "$--";
    }

    return "$" + value.toLocaleString("en-US");
}

function getTickerItems(data) {
    return data.map(function(item, index) {
        var stockName = item.stockName || null;
        var itemId = item.id || "legacy-" + index + "-" + stockName;

        return {
            id: itemId,
            stockName: stockName,
            price: item.price,
            changeText: item.changeText,
            direction: item.direction || "neutral"
        };
    }).reverse();
}

var Stock = React.createClass({

    handleBuy: function(e) {

        var stockName = $(e.target).attr('data-stock');
        var quantity = parseInt($(e.target).attr('data-quantity'), 10) || 1;
        this.props.onBuy(stockName, quantity);

    },

    handleSell: function(e) {

        var stockName = $(e.target).attr('data-stock');
        var quantity = parseInt($(e.target).attr('data-quantity'), 10) || 1;
        this.props.onSell(stockName, quantity);

    },

    render: function() {

        return (

            <article className="stock">
                <div className="stockHeader">
                    <h3>{this.props.name}</h3>
                    <p className="price">${this.props.price}</p>
                </div>
                <StockHistory history={this.props.history} />
                <div className="buyActions">
                    <button data-stock={this.props.name} data-quantity="1" className="buy" onClick={this.handleBuy}>Buy</button>
                    <button data-stock={this.props.name} data-quantity="10" className="buy buyTen" onClick={this.handleBuy}>Buy 10</button>
                </div>
                <div className="sellActions">
                    <button data-stock={this.props.name} data-quantity="1" className="sell" onClick={this.handleSell}>Sell</button>
                    <button data-stock={this.props.name} data-quantity="10" className="sell sellTen" onClick={this.handleSell}>Sell 10</button>
                </div>
            </article>

        );

    }
});

var HistoryChart = React.createClass({

    render: function() {
        var width = this.props.width || 180;
        var height = this.props.height || 56;
        var padding = this.props.padding || 4;
        var historyLimit = this.props.limit || 100;
        var history = this.props.history && this.props.history.length ? this.props.history.slice(-historyLimit) : [100];
        var minPrice = Math.min.apply(null, history);
        var maxPrice = Math.max.apply(null, history);
        var priceRange = maxPrice - minPrice;
        var chartWidth = width - (padding * 2);
        var chartHeight = height - (padding * 2);

        var coordinates = history.map(function(price, index) {
            var xRatio = history.length === 1 ? 0 : index / (history.length - 1);
            var x = padding + (xRatio * chartWidth);
            var y = padding + (chartHeight / 2);

            if (priceRange !== 0) {
                y = padding + ((maxPrice - price) / priceRange) * chartHeight;
            }

            return {
                x: x,
                y: y
            };
        });

        if (coordinates.length === 1) {
            coordinates = [
                {x: padding, y: coordinates[0].y},
                {x: width - padding, y: coordinates[0].y}
            ];
        }

        var linePoints = coordinates.map(function(point) {
            return point.x.toFixed(1) + "," + point.y.toFixed(1);
        }).join(" ");
        var areaPoints = padding + "," + (height - padding) + " " + linePoints + " " + (width - padding) + "," + (height - padding);
        var lastPoint = coordinates[coordinates.length - 1];
        var chartClassName = this.props.className ? "historyChart " + this.props.className : "historyChart";

        return (
            <svg className={chartClassName} viewBox={"0 0 " + width + " " + height} preserveAspectRatio="none">
                <line className="historyAxis" x1={padding} y1={height - padding} x2={width - padding} y2={height - padding}></line>
                <polygon className="historyArea" points={areaPoints}></polygon>
                <polyline className="historyLine" points={linePoints}></polyline>
                <circle className="historyPoint" cx={lastPoint.x} cy={lastPoint.y} r="3"></circle>
            </svg>
        );
    }

});

var StockHistory = React.createClass({

    render: function() {
        return (
            <div className="stockHistory">
                <HistoryChart history={this.props.history} />
            </div>
        );
    }

});

var TrendHistory = React.createClass({

    render: function() {
        var panelClassName = "trendHistory";

        if (this.props.panelClassName) {
            panelClassName += " " + this.props.panelClassName;
        }

        return (
            <div className={panelClassName}>
                <div className="trendHistoryHeader">
                    <h2>{this.props.title}</h2>
                    <p className="trendHistoryAmount">{formatCurrencyValue(this.props.amount)}</p>
                </div>
                <div className="trendHistoryBody">
                    <HistoryChart className={"trendChart " + (this.props.chartClassName || "")} history={this.props.history} width={560} height={132} padding={4} limit={300} />
                </div>
            </div>
        );
    }

});

var Shares = React.createClass({

    render: function() {
        var totalValue = this.props.count * this.props.price;

        return (
            <p className="share">
                <span className="shareLabel">Shares: {this.props.count}</span>
                <span className="shareValue">Value: ${totalValue}</span>
            </p>
        );
    }

});

var NewsItem = React.createClass({

    render: function() {
        var className = "newsItem";
        var changeText = this.props.changeText || "--";

        if (this.props.direction === "up") {
            className += " isUp";
        } else if (this.props.direction === "down") {
            className += " isDown";
        }

        return (
            <div className={className} data-news-id={this.props.itemId}>
                <span className="newsSymbol">{getStockTickerSymbol(this.props.stockName)}</span>
                <span className="newsQuote">
                    <span className="newsPrice">{formatTickerPrice(this.props.price)}</span>
                    <span className="newsChange">{changeText}</span>
                </span>
            </div>
        )
    }

})

var NewsFeed = React.createClass({

    shouldComponentUpdate: function(nextProps) {
        var currentFirstItem = this.props.data[0];
        var nextFirstItem = nextProps.data[0];
        var currentFirstId = currentFirstItem && currentFirstItem.id;
        var nextFirstId = nextFirstItem && nextFirstItem.id;

        return nextProps.data.length !== this.props.data.length || nextFirstId !== currentFirstId;
    },

    componentDidMount: function() {
        this.offset = 0;
        this.primaryTrackWidth = 0;
        this.pendingOffsetAdjustment = 0;
        this.lastFrameTime = null;
        this.tickerSpeed = 48;
        this.updateTickerMetrics();
        this.startTicker();
    },

    componentWillUpdate: function(nextProps) {
        this.captureTickerShift(nextProps.data);
    },

    componentDidUpdate: function() {
        if (this.pendingOffsetAdjustment) {
            this.offset += this.pendingOffsetAdjustment;
            this.pendingOffsetAdjustment = 0;
        }

        this.updateTickerMetrics();
    },

    componentWillUnmount: function() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    },

    getTickerItemWidth: function(itemId) {
        if (!this.refs.newsTickerPrimary) {
            return 0;
        }

        var itemNode = this.refs.newsTickerPrimary.querySelector('[data-news-id="' + itemId + '"]');

        if (!itemNode) {
            return 0;
        }

        var itemStyles = window.getComputedStyle(itemNode);
        var marginRight = parseFloat(itemStyles.marginRight) || 0;

        return itemNode.getBoundingClientRect().width + marginRight;
    },

    captureTickerShift: function(nextData) {
        this.pendingOffsetAdjustment = 0;

        if (!this.refs.newsTickerPrimary) {
            return;
        }

        var currentItems = getTickerItems(this.props.data);
        var nextItems = getTickerItems(nextData);
        var nextItemIds = {};
        var i = 0;

        if (!currentItems.length || !nextItems.length) {
            return;
        }

        for (i = 0; i < nextItems.length; i++) {
            nextItemIds[nextItems[i].id] = true;
        }

        for (i = 0; i < currentItems.length; i++) {
            if (nextItemIds[currentItems[i].id]) {
                break;
            }

            this.pendingOffsetAdjustment += this.getTickerItemWidth(currentItems[i].id);
        }
    },

    updateTickerMetrics: function() {
        if (!this.refs.newsTickerPrimary || !this.refs.newsTickerTrack) {
            this.primaryTrackWidth = 0;
            this.offset = 0;
            return;
        }

        this.primaryTrackWidth = this.refs.newsTickerPrimary.getBoundingClientRect().width;
        this.offset = this.normalizeOffset(this.offset);
        this.applyTickerTransform();
    },

    normalizeOffset: function(offset) {
        if (!this.primaryTrackWidth) {
            return 0;
        }

        while (offset <= -this.primaryTrackWidth) {
            offset += this.primaryTrackWidth;
        }

        while (offset > 0) {
            offset -= this.primaryTrackWidth;
        }

        return offset;
    },

    applyTickerTransform: function() {
        if (this.refs.newsTickerTrack) {
            this.refs.newsTickerTrack.style.transform = "translate3d(" + this.offset.toFixed(2) + "px, 0, 0)";
        }
    },

    startTicker: function() {
        var tick = function(timestamp) {
            if (this.primaryTrackWidth) {
                if (this.lastFrameTime === null) {
                    this.lastFrameTime = timestamp;
                }

                var deltaSeconds = Math.min((timestamp - this.lastFrameTime) / 1000, 0.05);
                this.offset -= this.tickerSpeed * deltaSeconds;
                this.offset = this.normalizeOffset(this.offset);
                this.applyTickerTransform();
            } else {
                this.applyTickerTransform();
            }

            this.lastFrameTime = timestamp;
            this.animationFrame = requestAnimationFrame(tick);
        }.bind(this);

        this.animationFrame = requestAnimationFrame(tick);
    },

    render: function () {
        var newsItems = getTickerItems(this.props.data);

        var primaryItems = newsItems.map(function(item) {
            return (
                <NewsItem key={"primary-" + item.id} itemId={item.id} stockName={item.stockName} price={item.price} changeText={item.changeText} direction={item.direction} />
            );
        });
        var duplicateItems = newsItems.map(function(item) {
            return (
                <NewsItem key={"duplicate-" + item.id} itemId={item.id} stockName={item.stockName} price={item.price} changeText={item.changeText} direction={item.direction} />
            );
        });

        return (
            <div className="newsFeed">
                <h2>Ticker</h2>
                <div className="newsTickerViewport" ref="newsTickerViewport">
                    {newsItems.length ? (
                        <div className="newsTickerTrack" ref="newsTickerTrack">
                            <div className="newsTickerSegment" ref="newsTickerPrimary">
                                {primaryItems}
                            </div>
                            <div className="newsTickerSegment newsTickerDuplicate">
                                {duplicateItems}
                            </div>
                        </div>
                    ) : (
                        <p className="newsFeedEmpty">No market moves yet.</p>
                    )}
                </div>
            </div>
        )
    }

})

var Cash = React.createClass({

    render: function() {
        return (
            <div className="statusBar">
                <p className="cash">Cash: {formatCurrencyValue(this.props.amount)}</p>
                <p className="netWorth">Net Worth: {formatCurrencyValue(this.props.netWorth)}</p>
            </div>
        )
    }

})

var StockView = React.createClass({

    propTypes: {
        cash: React.PropTypes.number,
        cashHistory: React.PropTypes.array,
        data: React.PropTypes.array,
        newsFeed: React.PropTypes.array,
        netWorthHistory: React.PropTypes.array
    },

    getInitialState: function() {
        return {
            data: stockMarket.stocks.slice(),
            cash: stockMarket.cash,
            cashHistory: stockMarket.cashHistory.slice(),
            newsFeed: stockMarket.newsFeed.slice(),
            netWorthHistory: stockMarket.netWorthHistory.slice()
        }
    },

    updateStocks: function () {
        this.setState({
            data: stockMarket.stocks.slice(),
            cash: stockMarket.cash,
            cashHistory: stockMarket.cashHistory.slice(),
            newsFeed: stockMarket.newsFeed.slice(),
            netWorthHistory: stockMarket.netWorthHistory.slice()
        });
    },

    onBuy: function(stockName, quantity) {
        stockMarket.buyShare(stockName, quantity);
        this.setState({
            data: stockMarket.stocks.slice(),
            cash: stockMarket.cash,
            cashHistory: stockMarket.cashHistory.slice(),
            newsFeed: stockMarket.newsFeed.slice(),
            netWorthHistory: stockMarket.netWorthHistory.slice()
        });
    },

    onSell: function(stockName, quantity) {
        stockMarket.sellShare(stockName, quantity);
        this.setState({
            data: stockMarket.stocks.slice(),
            cash: stockMarket.cash,
            cashHistory: stockMarket.cashHistory.slice(),
            newsFeed: stockMarket.newsFeed.slice(),
            netWorthHistory: stockMarket.netWorthHistory.slice()
        });
    },

    componentDidMount() {
        this.updateStocks();
        setInterval(this.updateStocks, 100);
    },

    render : function () {
        var portfolioValue = 0;

        this.state.data.forEach(function(stock) {
            portfolioValue += stock.shares * stock.price;
        });

        var netWorth = this.state.cash + portfolioValue;

        var stockNodes = this.state.data.map(function(stock) {
            var stockClassName = "stockNode " + getStockClassName(stock.name);

            return (
                <div className={stockClassName} key={stock.name}>
                <Stock id={stock.id} name={stock.name} price={stock.price} history={stock.history} onBuy={this.onBuy} onSell={this.onSell} />
                <Shares name={stock.name} count={stock.shares} price={stock.price} />
                </div>
            );
        }, this);


        return (

            <div id="game">
            <div className="topBar">
                <h1>Stock Ticker</h1>
                <Cash amount={this.state.cash} netWorth={netWorth} />
            </div>

            <NewsFeed data={this.state.newsFeed} />

            <div className="marketLayout">
                <div className="stocks">
                    <h2>Stocks</h2>
                    <div className="stockGrid">
                        {stockNodes}
                    </div>
                </div>

                <div className="marketSidebar">
                    <TrendHistory title="Net Worth Trend" amount={netWorth} history={this.state.netWorthHistory} panelClassName="netWorthHistory" chartClassName="netWorthChart" />
                    <TrendHistory title="Cash Trend" amount={this.state.cash} history={this.state.cashHistory} panelClassName="cashTrendHistory" chartClassName="cashTrendChart" />
                </div>
            </div>

            </div>

        );

    }

});

ReactDOM.render(
    <StockView data={stockMarket.stocks} newsFeed={stockMarket.newsFeed} cashHistory={stockMarket.cashHistory} netWorthHistory={stockMarket.netWorthHistory} />,
    document.getElementById('content')
);
