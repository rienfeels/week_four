"use strict";

document.addEventListener("DOMContentLoaded", function () {
  console.log("CONTENT LOADED");
  const root = document.querySelector("#root");

  // Prompt the user for Discogs artist ID
  const artistId = prompt("Enter Discogs Artist ID:");

  if (!artistId) {
    // Handle empty or canceled input
    console.log("No artist ID provided. Exiting.");
    return;
  }

  const apiKey = "bmowHxKDkguJzXoMyPoU";

  // Example Discogs API endpoint for fetching artist information
  const artistUrl = `https://api.discogs.com/artists/${artistId}?key=${apiKey}&secret=NiRGOLydFLANQtnwZgmkaYqaWMbOkQPm`;

  fetch(artistUrl, {
    method: "GET",
    headers: {
      "User-Agent": "YourApp/1.0",
    },
  })
    .then(function (response) {
      if (!response.ok) {
        throw new Error(
          `Failed to fetch artist data. Status: ${response.status}`
        );
      }
      return response.json();
    })
    .then(function (artistData) {
      const artistName = artistData.name;

      // Example Discogs API endpoint for fetching top releases by artist
      const releasesUrl = `https://api.discogs.com/artists/${artistId}/releases?key=${apiKey}&secret=YOUR_DISCOGS_API_SECRET`;

      return fetch(releasesUrl, {
        method: "GET",
        headers: {
          "User-Agent": "YourApp/1.0",
        },
      })
        .then((response) => response.json())
        .then((releasesData) => {
          showArtist(artistName, artistData.uri, releasesData.releases);
          console.log(artistData);
        });
    })
    .catch(function (error) {
      console.error(error.message);
    });

  function showArtist(artistName, artistProfile, releases) {
    const greeting = document.createElement("h1");
    const paragraph = document.createElement("p");

    greeting.textContent = `Hello ${artistName} enjoyer`;
    paragraph.textContent = `Profile: ${artistProfile}`;

    root.appendChild(greeting);
    root.appendChild(paragraph);

    if (releases && releases.length > 0) {
      const releasesHeading = document.createElement("h2");
      releasesHeading.textContent = "Top Releases:";
      root.appendChild(releasesHeading);

      const releasesList = document.createElement("ul");

      for (let i = 0; i < Math.min(3, releases.length); i++) {
        const release = releases[i];
        const releaseItem = document.createElement("li");
        releaseItem.textContent = release.title;
        releasesList.appendChild(releaseItem);
      }

      root.appendChild(releasesList);
    } else {
      const noReleasesMessage = document.createElement("p");
      noReleasesMessage.textContent = "No releases found";
      root.appendChild(noReleasesMessage);
    }
  }
});
