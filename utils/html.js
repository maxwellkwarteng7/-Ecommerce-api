const customHtml = (username, pin) => {
    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>EMail Title</title>
          <style>
            body {
            font-family: Arial, sans-serif;
            }
            .container {
               padding: 20px;
               background-color: #f9f9f9;
               border: 1px solid #ccc;
               }
            .header {
               background-color: black;
               color: white;
               padding: 10px;
                text-align: center;
              }
            .content {
               margin: 20px 0;
             }
            .footer {
               text-align: center;
               font-size: 12px;
               color: #777;
              }
            .pin {
              color: black ;
              font-weight: bold;
            }          
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 class="main-title">E-Commerce</h1>
            </div>
            <div class="content">
              <p>Hello ${username},</p>
              <p>Enter <span class="pin">${pin}</span> to reset your password. Thank You</p>
              <p>This pin is valid for 5 minutes</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 Ecommerce. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;
    return htmlContent;
  };
  
  module.exports = customHtml;