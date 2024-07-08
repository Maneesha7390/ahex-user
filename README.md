
# ahextech-user

The `ahextech-user` package provides user management functionalities including registration, email and phone number verification, OTP generation and validation, and user sign-in.

## Installation

To install the package, use:

```bash
npm install ahextech-user
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
