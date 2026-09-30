# CallScribe AI - API Design

## Base URL

```text
/api

Authentication

Authentication uses JWT bearer tokens.

Authorization: Bearer <token>

Protected endpoints require a valid JWT.

Authentication Endpoints
Register
POST /api/auth/register

Creates a new user account.

Request body:

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
Login
POST /api/auth/login

Authenticates a user and returns a JWT.

Request body:

{
  "email": "john@example.com",
  "password": "password123"
}
Call Recording Endpoints
Create Recording
POST /api/call-recordings

Creates a new call recording.

Authentication is required.

Request:

multipart/form-data

Fields:

title - Meeting title
duration - Recording duration
audio - Audio file

The backend:

Authenticates the user.
Receives the audio file.
Uploads the audio to Supabase Storage.
Creates a recording document in MongoDB.
Associates the recording with the authenticated user.
Protected Test Endpoint
GET /api/test/protected

Used to verify that JWT authentication is working correctly.

Processing Flow
Client
  |
  | POST /api/call-recordings
  v
Express API
  |
  +--> Supabase Storage
  |
  +--> MongoDB
  |
  v
Transcription Service
  |
  v
faster-whisper
  |
  v
Transcript
Response Codes

Common HTTP status codes:

200 - Successful request
201 - Resource created
400 - Invalid request
401 - Authentication required or invalid
404 - Resource not found
500 - Internal server error