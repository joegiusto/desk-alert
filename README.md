# alert
Desk Pager that was built for the Raspberry Pi.
Hook up a led to GPIO Pin 2 and it will light whenever someone pushes down the button on the website.

>Comment out isPie=true in the .env file if running on a computer, this allows server to make execSync() calls on the Pi for lighting LED, if ran on a computer only the background of the website will change.

1. Run `npm install`
2. Run `npm run start` or `node server.js`
3. Navigate to localhost:3001
