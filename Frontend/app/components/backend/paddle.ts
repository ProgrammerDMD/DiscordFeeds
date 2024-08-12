import { Environment, Paddle } from "@paddle/paddle-node-sdk";

const paddle = new Paddle(process.env.PADDLE_API!, {
    environment: process.env.PADDLE_ENVIRONMENT === "production" ? Environment.production : Environment.sandbox
});

export default paddle;