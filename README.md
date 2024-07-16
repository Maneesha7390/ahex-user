
# ahextech-user

The `ahextech-user` package provides user management functionalities including registration, email and phone number verification, OTP generation and validation, and user sign-in.

## Installation

To install the package, use:

```bash
npm install ahextech-user
```

## Environment Variables

Make sure to set the following environment variables in your project:

```env
PORT=yoour_port
MONGO_URI=your_mongodb_uri
DATABASE_NAME= your_database_name
MONGODB_USER=db_user
MONGODB_PASSWORD = your_db_user_password
JWT_SECRET=your_jwt_secret
EMAIL_SERVICE=your_email_service_provider
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_password
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_OAUTH_REDIRECT_URL= your_google_redirection_url
SUCCESS_REDIRECT= your_success_screen_url_after_successful_googlesso
FAILURE_REDIRECT=your_failed_screen_url_after_failed_googlesso
```

## API Endpoints

### Register User

- **Endpoint:** `/register`
- **Method:** `POST`
- **Description:** Registers a new user.
- **Body Parameters:**
  - `firstName` (string, required)
  - `lastName` (string, required)
  - `email` (string, required)
  - `password` (string, required)
  - `phoneNumber` (string, required)

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "phoneNumber": "1234567890"
}
```

### Verify Email OTP

- **Endpoint:** `/verify/email-otp`
- **Method:** `POST`
- **Description:** Verifies the OTP sent to the user's email.
- **Body Parameters:**
  - `email` (string, required)
  - `emailOTP` (string, required)

```json
{
  "email": "john.doe@example.com",
  "emailOTP": "123456"
}
```

### Resend Email OTP

- **Endpoint:** `/resend/email-otp`
- **Method:** `POST`
- **Description:** Resends the OTP to the user's email.
- **Body Parameters:**
  - `email` (string, required)

```json
{
  "email": "john.doe@example.com"
}
```

### Verify SMS OTP

- **Endpoint:** `/verify/sms-otp`
- **Method:** `POST`
- **Description:** Verifies the OTP sent to the user's phone number.
- **Body Parameters:**
  - `email` (string, required)
  - `phoneNumber` (string, required)
  - `smsOTP` (string, required)

```json
{
  "email": "john.doe@example.com",
  "phoneNumber": "1234567890",
  "smsOTP": "654321"
}
```

### Resend SMS OTP

- **Endpoint:** `/resend/sms-otp`
- **Method:** `POST`
- **Description:** Resends the OTP to the user's phone number.
- **Body Parameters:**
  - `email` (string, required)
  - `phoneNumber` (string, required)

```json
{
  "email": "john.doe@example.com",
  "phoneNumber": "1234567890"
}
```

### Sign In User

- **Endpoint:** `/signin`
- **Method:** `POST`
- **Description:** Signs in a user.
- **Body Parameters:**
  - `email` (string, required)
  - `password` (string, required)

```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```
### GCP Account setup 
For getting clientID, ClientSecret from googole-auth do follow this steps [Word](https://docs.google.com/document/d/11pSvp4d3AoU8vtu_K4deTDhRpuLT1A9-oDMIi1tnEfY/edit?usp=sharing).

### Google SSO
- **Initiate Google Authentication:**
    - **Endpoint:** `/google`
    - **Method**: `GET`
    - **Description**: Initiates the Google Single Sign-On (SSO) process. Redirects the user to Google's authentication page with required scopes for profile and email.

- **Google SSO Callback:**
    - **Endpoint:** `/google/callback`
    - **Method**: `GET`
    - **Description:** Callback URL for Google SSO. Handles authentication callback from Google. On success, redirects to /success, and on failure, redirects to /failure.

- **Success Page:**
    - **Endpoint:** `/success`
    - **Method:** `GET`
    - **Description:** Displays success message or page after successful Google SSO authentication.
    
- **Failure Page:**
    - **Endpoint:** /failure
    - **Method:** GET
    - **Description:** Displays failure message or page after failed Google SSO authentication.

### Google SSO Testing

For a detailed implementation of Google SSO using Passport.js and how it integrates with this project, watch this [Loom video](https://www.loom.com/share/a1009acba4fb41088cb1b6953101086e?sid=afa9368d-aeab-4f55-8be3-38b18d475153).

## Validation

The package uses `Joi` for request validation. The following validators are included:

- `validateRegisterUser` - Validates user registration data.
- `validateLoginUser` - Validates user login data.
- `validateOTPViaEmail` - Validates email OTP.
- `validatResendEmailOTP` - Validates resend email OTP request.
- `validateOTPViaPhoneNumber` - Validates phone number OTP.
- `validatResenSMSOTP` - Validates resend SMS OTP request.
- `validateSignIn` - Validates user sign-in data.

## Services

The following services are provided for user management:

- `registerUser` - Registers a new user.
- `uniqueUserCheck` - Checks if a user with the given email already exists.
- `updateOTPs` - Updates OTPs for email and phone verification.
- `verifyOTPViaEmail` - Verifies email OTP.
- `verifyOTPViaSMS` - Verifies phone number OTP.
- `findUser` - Finds a user by email.

## License

This project is licensed under the ISC License.
