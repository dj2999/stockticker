# Stock Ticker

This repository is a customized fork of the original [arawkins/stockticker](https://github.com/arawkins/stockticker) browser game: a lightweight single-player take on the classic board game *Stock Ticker*.

The core market loop is still intentionally simple:

- Six stocks start at `$100`
- You start with `$1,000` cash
- Every 2 seconds one stock moves by `$5`, `$10`, or `$15`, or pays a dividend
- Stocks split at `$200`
- Stocks crash and reset at `$0`

What changed in this fork is the presentation and portfolio tooling around that loop.

## What's New In This Fork

- Board-game-inspired stock cards with unique colors for Gold, Silver, Bonds, Oil, Industrials, and Grain
- A moving market ticker at the top instead of the original scrolling news log
- Inline stock history sparklines for each stock card
- Separate `Cash` and `Net Worth` badges with comma-formatted currency values
- Dedicated `Net Worth Trend` and `Cash Trend` panels in the sidebar
- Portfolio trend history expanded to 300 points
- Share ownership display that shows both share count and current position value
- Faster trading controls with `Buy`, `Buy 10`, `Sell`, and `Sell 10`
- Trade actions removed from the market ticker so it only shows market events
- Responsive layout refinements so the game scales better on smaller screens

## How To Play

The game is still played like a simplified rolling market simulator:

- Buy shares before prices rise
- Sell shares before prices fall
- Collect dividends when you own shares in stocks trading at `$100` or above
- Benefit from splits when a stock reaches `$200`
- Avoid being caught in a crash at `$0`

There is no formal win screen in this fork. The practical goal is to grow your net worth over time.

## Interface Overview

- `Ticker`: live market feed showing symbol, current value, and move direction
- `Stocks`: six stock cards with current price, 100-point history graph, and trading buttons
- `Cash`: current cash on hand
- `Net Worth`: cash plus market value of all held shares
- `Net Worth Trend`: 300-point graph of total portfolio value
- `Cash Trend`: 300-point graph of cash-only history

## Running It

This project is fully static. There is no build step.

You can run it by opening [index.html](index.html) directly in a browser, or by serving the folder with any simple static file server.

## Project Structure

- [index.html](index.html): static page shell that loads the game
- [js/stockticker.js](js/stockticker.js): plain JavaScript game engine and market state
- [js/main.js](js/main.js): React-based UI layer
- [css/common.css](css/common.css): styling, layout, card themes, and graph/ticker presentation
- `js/vendor/`: vendored browser dependencies

## Technical Notes

- The UI uses older browser-side React with `type="text/babel"` and vendored scripts
- The game engine is separate from the React UI and can be read independently
- Stock price history is tracked per stock for 100 points
- Cash and net worth history are tracked separately for 300 points

## Attribution

Original concept and base implementation:

- [arawkins/stockticker](https://github.com/arawkins/stockticker)
