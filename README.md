# RoundTable

www.rdtble.com

RoundTable is a web application that allows people to create and discuss a query and reply to other queries. Users can create an account, and create their own category (such as Science, Medicine, Astronomy, etc.) and make a forum post accordingly, to which other users can engage with, by upvoting/downvoting/commenting on it. The user creating the post will be using a Markdown editor to create content. Users will have the ability to explore other users' profiles. The website will also have a global chatroom, where any user can join in on an ongoing discussion.

## Core tech used

-   **React**: Used for the frontend to create the single-page application
-   **Redis**: Used to cache post and user data
-   **GraphQL**: Used as the main backend query language to fetch all the necessary data

## Independent tech used

-   **Dolby.io**: High-fidelity audio and video for all library, used to create the chatroom
-   **Deploying to DigitalOcean**: Deployed to AWS using a Droplet, and reverse-proxying through Nginx

## Before running the project

Make sure you are running Redis server, as the backend uses Redis to cache data. Clear any existing cache if required. Database doesn't need to be seeded, as we're using MongoDB Atlas.

## How to run

In order to run the project, there are two directories involved:
First, move to the project directory by using `cd Project/`
Then,

### To run the frontend:

In the `Project` directory,
`cd frontend`
`npm install`

If testing locally,
`npm run dev`

If creating a deployment build,
`npm build`
`npm start`
The React project will run on port `3000`.

### To run the backend:

In the `Project` directory,
`cd backend`
`npm install`
`npm start`
The GraphQL server will run on port `4000`.
