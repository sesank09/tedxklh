const https = require("https");

async function checkBundles() {
  https.get("https://tedxklh-2026.vercel.app/apply", (res) => {
    let html = "";
    res.on("data", chunk => html += chunk);
    res.on("end", async () => {
      // Find script tags
      const matches = html.match(/src="(\/_next\/static\/chunks\/[^"]+)"/g) || [];
      console.log(`Found ${matches.length} chunks in /apply HTML.`);
      
      let found = false;
      for (const m of matches) {
        const src = m.replace('src="', '').replace('"', '');
        const url = "https://tedxklh-2026.vercel.app" + src;
        const js = await new Promise((resolve) => {
          https.get(url, (r) => {
            let data = "";
            r.on("data", c => data += c);
            r.on("end", () => resolve(data));
          });
        });

        if (js.includes("RECEIPT SUCCESSFULLY ATTACHED") || js.includes("ATTACHED & READY") || js.includes("ATTACHED &amp; READY") || js.includes("READY TO SUBMIT")) {
          found = true;
          console.log("✓ FOUND NEW IMAGE UPLOAD FEEDBACK in chunk:", src);
        }
      }

      if (found) {
        console.log(">>> DEPLOYMENT IS LIVE WITH ALL UPDATES! <<<");
      } else {
        console.log("Vercel is still building/caching. Retrying...");
      }
    });
  });
}

checkBundles();
