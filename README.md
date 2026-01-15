# simple-homepage-builder
Simple Homepage Builder - all local and single page

## Installation

1. Clone or download the repository.
2. Run `npm install` to install dependencies.

## Running Locally

Run `npm start` to start the server on port 3000. Access at http://localhost:3000.

To change the port, set the PORT environment variable: `PORT=8080 npm start`.

## Docker

Build and run with Docker:

```bash
docker build -t media-links-app .
docker run -p 3000:3000 media-links-app
```

## Docker Compose

Run `docker-compose up` to start the app. The port can be configured by setting the PORT environment variable before running, e.g., `PORT=8080 docker-compose up`.

## Usage

Open the app in your browser. Click "Add Link" to add new media links with title, URL, and image URL. Links are saved on the server and persist across devices and browsers. Use Edit and Delete buttons on each card to modify or remove links. Drag and drop tiles to reorder them. If no image URL is provided, a default image will be used.
