# CallScribe AI - Database Design

## Database

CallScribe AI uses MongoDB Atlas with Mongoose for database management.

## User Collection

The `User` collection stores authentication and user information.

### Fields

- `name` - User's name
- `email` - Unique user email
- `passwordHash` - Hashed password
- `avatar` - Optional avatar
- `role` - User role
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

Passwords are never stored in plain text. Passwords are hashed using bcrypt
before being stored in the database.

## CallRecording Collection

The `CallRecording` collection stores meeting recording metadata and
processed transcription data.

### Fields

- `user` - Reference to the owning User
- `title` - Meeting title
- `audioPath` - Path of the audio file in Supabase Storage
- `duration` - Recording duration
- `status` - Current processing status
- `transcript` - Generated meeting transcript
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### Recording Status

The `status` field tracks the processing state of a recording.

Possible values are:

```text
uploaded
processing
completed
failed

Relationship

A user can have multiple call recordings.

User
 |
 | 1
 |
 | *
 v
CallRecording

The user field in CallRecording references the MongoDB _id of the
corresponding User document.

Storage Separation

MongoDB stores metadata and processed information.

Supabase Storage stores the actual audio files.

MongoDB
  |
  +-- User data
  |
  +-- Recording metadata
  |
  +-- Transcript
  |
  +-- Processing status

Supabase Storage
  |
  +-- Audio files

This separation prevents large audio binaries from being stored directly
inside MongoDB and keeps file storage independent from application data.

Data Ownership

Each CallRecording belongs to the authenticated user who uploaded it.

The ownership relationship is established using the user's ID from the
verified JWT token.

This prevents clients from arbitrarily assigning recordings to another user.