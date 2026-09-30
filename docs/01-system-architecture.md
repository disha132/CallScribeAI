# CallScribe AI - System Architecture

## Overview

CallScribe AI is an AI-powered meeting and conversation intelligence platform
that allows users to upload meeting recordings, generate transcripts, and
extract structured meeting insights.

The application follows a modular full-stack architecture where the frontend,
backend, database, file storage, and transcription service have separate
responsibilities.

## Current Architecture

```text
React Frontend
      |
      | HTTP / REST API
      v
Node.js + Express Backend
      |
      +----------------------+
      |                      |
      v                      v
MongoDB Atlas          Supabase Storage
      |                      |
      |                 Audio Files
      |                      |
      |                Download Audio
      |                      |
      +----------+-----------+
                 |
                 v
        Local Python Service
                 |
                 v
          faster-whisper
                 |
                 v
             Transcript
                 |
                 v
            MongoDB Atlas

            Backend Responsibilities

The Node.js and Express backend is responsible for:

User registration and authentication
JWT-based authorization
Meeting recording metadata management
Audio upload handling
Supabase Storage integration
Audio retrieval
Transcription orchestration
MongoDB persistence
API request validation and response handling

Business logic is separated into controllers, services, models, routes, and
middleware to keep the backend modular and maintainable.

Storage
MongoDB Atlas

MongoDB Atlas stores structured application data such as:

Users
Meeting recording metadata
Audio file paths
Recording duration
Processing status
Transcripts
Future meeting analysis data

MongoDB stores metadata and processed information rather than the actual
audio binary files.

Supabase Storage

Supabase Storage is used to store the actual meeting audio files.

The application uses a private bucket named:

call-recordings

Audio files are stored using user-specific paths.

Example:

<userId>/<generated-file-name>.mp3

This keeps uploaded recordings logically separated by user.

Transcription Pipeline

The current transcription pipeline uses a local Python service with
faster-whisper.

The flow is:

Supabase Audio File
        |
        v
Node.js downloads audio
        |
        v
Temporary local audio file
        |
        v
Python transcription service
        |
        v
faster-whisper
        |
        v
Generated transcript
        |
        v
Node.js receives transcript
        |
        v
MongoDB

The temporary audio file is deleted after transcription is completed.

The transcription logic is isolated inside a dedicated service so that the
transcription provider can be replaced or upgraded later without changing
the rest of the application architecture.

Authentication

The backend uses JWT-based authentication.

After successful login, the server generates a JWT containing the authenticated
user's ID and role.

Protected requests include the token in the Authorization header:

Authorization: Bearer <token>

The authentication middleware verifies the token before allowing access to
protected routes.

The authenticated user's ID is obtained from the verified JWT rather than
being trusted from client-provided data.

Data Flow

A typical recording workflow is:

1. User logs into the application
          |
          v
2. User uploads a meeting recording
          |
          v
3. Backend authenticates the request
          |
          v
4. Audio is uploaded to Supabase Storage
          |
          v
5. Recording metadata is stored in MongoDB
          |
          v
6. Backend retrieves the stored audio
          |
          v
7. Audio is processed by faster-whisper
          |
          v
8. Transcript is generated
          |
          v
9. Transcript is stored in MongoDB
          |
          v
10. Future processing can generate meeting insights
Design Principles

The project follows these architectural principles:

Separate frontend, backend, storage, and processing responsibilities.
Keep business logic separated into controllers and services.
Keep database models separate from request handling logic.
Store sensitive configuration in environment variables.
Store large audio files in object storage instead of MongoDB.
Use authenticated user identity from the JWT for resource ownership.
Keep transcription logic isolated behind a service layer.
Delete temporary audio files after processing.
Design the system so individual services can be replaced or extended later.
Future Architecture

The architecture can later be extended with additional processing such as:

Transcript
    |
    v
LLM Processing
    |
    +--> Meeting Summary
    |
    +--> Action Items
    |
    +--> Decisions
    |
    +--> Key Topics