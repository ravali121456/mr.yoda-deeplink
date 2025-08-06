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


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

