# ICP 201 Language Learning System

## Overview

This is a comprehensive system for language learning, facilitating decentralized language courses, user interactions, and progress tracking on the Internet Computer blockchain Typescript challenge 201. It includes features like course enrollment, lesson completion, progress tracking, and user management, demonstrating the capabilities of smart contracts for real-world language learning applications.

## Structure

### 1. Data Structures

- **Course**: Represents a language course with properties like `id`, `title`, `description`, `language`, `level`, `lessons`, and `instructor`.
- **CoursePayload**: Used for creating or updating a course with necessary properties.
- **User**: Represents a user with properties like `id`, `name`, `email`, `languagePreferences`, `enrolledCourses`, and `progress`.
- **ErrorType**: Variant type representing different error scenarios.

### 2. Storage

- `languageStorage`: A `StableBTreeMap` to store languages by their IDs.
- `enrolmentStorage`: A `StableBTreeMap` to store enrolment status.
- `usersStorage`: A `StableBTreeMap` to store users by their IDs.

### 3. Canister Functions

- **Enroll User**: Enrolls a user in a language course.
- **Complete Lesson**: Marks a lesson as completed for a user.
- **Get Courses**: Retrieves all courses from storage.
- **Get Lessons**: Retrieves all lessons from storage.
- **Get Course**: Retrieves a course by its ID.
- **Get Lesson**: Retrieves a lesson by its ID.
- **Get User**: Retrieves a user by their ID.
- **Update User**: Updates an existing user's progress.
- **Delete User**: Deletes a user by their ID.

### 4. Helper Functions

- **Generate Correlation ID**: Generates a correlation ID for tracking user progress.
- **Verify Completion**: Verifies lesson completion based on user interactions.

### 5. Dependencies

- Imports necessary modules from the `"azle"` library.
- Utilizes IC APIs like `ic.call` for blockchain interaction.

### 6. Miscellaneous

- Uses `globalThis.crypto` for generating random values.
- Uses custom correlation IDs for tracking progress.

### 7. Error Handling

- Functions return `Result` types to handle success or different error scenarios.

## Things to be explained in the course

1. What is Internet Identity? More details here: <https://internetcomputer.org/internet-identity>
2. What is Principal, Identity, Address? <https://internetcomputer.org/internet-identity>
3. Canister-to-canister communication and how multi-canister development is done? <https://medium.com/icp-league/explore-backend-multi-canister-development-on-ic-680064b06320>

## How to deploy canisters implemented in the course

### Backend canister

`dfx deploy backend` - deploys the backend canister where the business logic is implemented.

Do not forget to run `dfx generate backend` anytime you add/remove functions in the canister or when you change the signatures.
Otherwise, these changes won't be reflected in IDL's and won't work when called using the JS agent.

### Frontend canister

`dfx deploy frontend` - deployes the frontend app for the backend canister on IC.