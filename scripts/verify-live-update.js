const https = require("https");

function checkLivePage() {
  console.log("Checking live Vercel deployment status...");

  https.get("https://tedxklh-2026.vercel.app/apply", (res) => {
    let html = "";
    res.on("data", chunk => html += chunk);
    res.on("end", () => {
      console.log("Status /apply:", res.statusCode);
      const hasFeedback = html.includes("RECEIPT SUCCESSFULLY ATTACHED") || html.includes("ATTACHED &amp; READY") || html.includes("ATTACHED & READY");
      console.log("Contains Image Upload Feedback:", hasFeedback ? "YES ✓" : "NO (Waiting for Vercel build)");
    });
  }).on("error", console.error);
}

checkLivePage();
