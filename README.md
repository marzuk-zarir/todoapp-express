# Todo app mvc

![Todo app](./app.png 'Todo app')

Todo app in express and mongodb. Registered user can create delete and update his todo. Post routes are protected form [csrf attack](https://en.wikipedia.org/wiki/Cross-site_request_forgery). If an user forgot his password this app send a one time password reset link in user's email for 10 minutes.

# Google OAUTH

One time password reset link sends with google oauth form sender account. If you are authenticate with direct password you can change code in controllers/accountController.js file.

**Warning: direct password authentication is very insecure**

# User Authentication

User authentication are handled by [jwt](https://en.wikipedia.org/wiki/JSON_Web_Token). Only server side flash messages are handled by session.

# Router Structure

Auth route

```http
GET     /auth/signup
GET     /auth/login

POST    /auth/signup
POST    /auth/login
```

Account route

```http
GET     /account/forgot-password
GET     /account/reset-password

POST    /account/forgot-password
POST    /account/reset-password
```

Todo route

```http
GET     /todo/new
GET     /todo/edit
GET     /todo/:username

POST    /todo/new
POST    /todo/edit
POST    /todo/remove
```

# How to run:

## First install dependencies

```sh
npm i
```

## Set Environment Variables

## Start in development

```sh
npm run dev
```

Sever is listening on http://localhost:3000

## Start in production

```sh
npm start
```

# Technology

Sever

-   Express
-   Mongoose
-   Jwt
-   Express session
-   Express validator
-   Cookie parser
-   Connect flash
-   Connect mongo
-   Bcrypt
-   Csurf
-   Ejs
-   Googleapis
-   Nodemailer
-   Dotenv

Client

-   [Bootswatch](https://bootswatch.com/) (Bootstrap customized theme)
-   Bootstrap icon

# Contact

Email: [Marzuk Zarir](mailto:business.marzukzarir@gmail.com)
