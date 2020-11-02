const express = require("express");
const application = express();

application.set("view engine", "pug");
application.set("views", __dirname);

const cryptocurrencies = require("./cryptocurrencies.json");

application.get("/", (request, response) => {
  response.render("index", { cryptocurrencies });
});

application.get("/event-stream", (request, response) => {
  response.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  application.on("cryptocurrencyChanged", (cryptocurrency) => {
    response.write(`event: cryptocurrencyChanged\n`);
    response.write(`data: ${JSON.stringify(cryptocurrency)}\n\n`);
  });

  setInterval(() => {
    const cryptocurrency =
      cryptocurrencies[Math.floor(Math.random() * cryptocurrencies.length)];
    const randomValue = Math.round(Math.random() * 100) / 1000;
    const shouldValueDrop = Math.random() <= 0.5 ? true : false;

    const currentValue = cryptocurrency.value;
    cryptocurrency.value = shouldValueDrop
      ? currentValue - randomValue
      : currentValue + randomValue;

    application.emit("cryptocurrencyChanged", cryptocurrency);
  }, 1500);
});

application.listen(80, () => {
  console.log(`Server running...`);
});
