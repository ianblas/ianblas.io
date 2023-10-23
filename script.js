document.addEventListener("DOMContentLoaded", function () {
  const episodeContainer = document.querySelector(".container");
  const verMasButton = document.getElementById("ver-mas");
  let mostrarTodos = false; 

  fetch("https://anchor.fm/s/6fc944b4/podcast/rss")
    .then(response => response.text())
    .then(data => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "text/xml");
      const items = xmlDoc.querySelectorAll("item");

      function mostrarEpisodios() {
        episodeContainer.innerHTML = ""; 

        items.forEach((item, index) => {
          if (!mostrarTodos && index >= 12) {
            return;
          }
          const title = item.querySelector("title").textContent;
          const fullDescription = item.querySelector("description").textContent;
          const firstParagraph = extractFirstParagraph(fullDescription);
          const link = item.querySelector("link").textContent;

          const episodeDiv = document.createElement("div");
          episodeDiv.innerHTML = `
            <div class="episode-box">
              <h3><a href="${link}" target="_blank">${title}</a></h3>
              <p>${firstParagraph}</p>
            </div>
          `;

          episodeContainer.appendChild(episodeDiv);
        });

        if (mostrarTodos) {
          verMasButton.textContent = "Ver menos";
        } else {
          verMasButton.textContent = "Ver más";
        }
      }

      verMasButton.addEventListener("click", () => {
        mostrarTodos = !mostrarTodos;
        mostrarEpisodios();
      });

      mostrarEpisodios();
    })
    .catch(error => console.error("Error fetching RSS feed:", error));
});

function extractFirstParagraph(description) {
  const firstParagraph = description.split("\n")[0];
  return firstParagraph.trim();
}
