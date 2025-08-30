const express = require('express');
const path = require('path');
const app = express();

const IOS_APP_STORE_URL = 'https://apps.apple.com/in/app/mr-yoda/id6740283592';
const ANDROID_APP_STORE_URL = 'https://play.google.com/store/apps/details?id=com.mryoda&pcampaignid=web_share';
const CUSTOM_SCHEME = 'mr-yoda-deeplink://test/'; 

const filePath = path.join(__dirname, '.well-known');
console.log('Serving static files from:', filePath);

app.use('/.well-known', express.static(filePath));

app.get('/test/:id', (req, res) => {
  const testId = req.params.id;
  const userAgent = req.headers['user-agent'] || '';

  const isIOS = /iPhone|iPad|iPod/.test(userAgent);
  const isAndroid = /Android/.test(userAgent);

  const deepLink = `${CUSTOM_SCHEME}${testId}`;
  // const fallback = isIOS ? IOS_APP_STORE_URL : isAndroid ? ANDROID_APP_STORE_URL : 'https://mryoda.yodaprojects.com/';
  const fallback = isIOS ? IOS_APP_STORE_URL : ANDROID_APP_STORE_URL;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Opening App...</title>
      <meta charset="UTF-8" />
      <script>
        setTimeout(function () {
          window.location.href = '${fallback}';
        }, 2000);
        window.location = '${deepLink}';
      </script>
    </head>
    <body>
      <p>Redirecting to app...</p>
    </body>
    </html>
  `;

  res.send(html);
});


app.get("/:type/:id", (req, res) => {
  const { type, id } = req.params;
  res.send(`
<html>
<head>
<title>Yoda Deep Link</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
          body { font-family: sans-serif; padding: 20px; }
          .card { border: 1px solid #ddd; padding: 20px; border-radius: 8px; }
          a { display: inline-block; margin-top: 12px; padding: 10px 15px; background: #0070f3; color: #fff; text-decoration: none; border-radius: 6px; }
</style>
</head>
<body>
<div class="card">
<h2>Deep Link Redirect</h2>
<p>Type: <b>${type}</b></p>
<p>ID: <b>${id}</b></p>
<a href="myapp://deeplink/${type}/${id}">Open in App</a>
</div>
</body>
</html>
  `);
}); 


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

