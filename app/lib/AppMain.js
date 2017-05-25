import { app } from "./App.js";

app.verbose = 2;
app.debug = 2;
app.init(() => {
  console.log("Hello WebApp/2");
  alert(JSON.stringify(app.userAgent, null, 2));
});

