
const commentsList = document.getElementById('comments-list');

const defaultComments = [
  { name: "Lucía", country: "España", message: "¡Qué emoción! Este año las películas están increíbles." },
  { name: "Carlos", country: "México", message: "Estoy esperando ver quién gana mejor director." },
  { name: "Emily", country: "Argentina", message: "Las nominaciones estuvieron muy reñidas. ¡Me encanta!" }
];

let comments = JSON.parse(localStorage.getItem("comments"));
if (!comments || comments.length === 0) {
  comments = defaultComments;
  localStorage.setItem("comments", JSON.stringify(comments));
}

function displayComments() {
  commentsList.innerHTML = "";
  comments.forEach(comment => {
    const div = document.createElement("div");
    div.innerHTML = `<strong>${comment.name}</strong> (${comment.country}): ${comment.message}`;
    commentsList.appendChild(div);
  });
}

function addComment() {
  const name = document.getElementById("name").value.trim();
  const country = document.getElementById("country").value.trim();
  const message = document.getElementById("message").value.trim();

  if (name && country && message) {
    const newComment = { name, country, message };
    comments.push(newComment);
    localStorage.setItem("comments", JSON.stringify(comments));
    displayComments();

    console.log("Comentario guardado:", newComment);
    console.log("Todos los comentarios guardados:", comments);

    document.getElementById("name").value = "";
    document.getElementById("country").value = "";
    document.getElementById("message").value = "";
  } else {
    alert("Por favor, completa todos los campos.");
  }
}

window.addEventListener("DOMContentLoaded", () => {
  displayComments();
  console.log("Comentarios actuales cargados desde localStorage:", comments);

  const stars = document.querySelectorAll('.star');
  const ratingMessage = document.getElementById('rating-message');

  const savedRating = localStorage.getItem('userRating');
  if (savedRating) {
    highlightStars(savedRating);
    ratingMessage.textContent = `¡Gracias por calificar con ${savedRating} estrella(s)!`;
  }

  stars.forEach(star => {
    star.addEventListener('click', () => {
      const value = star.getAttribute('data-value');
      localStorage.setItem('userRating', value);
      highlightStars(value);
      ratingMessage.textContent = `¡Gracias por calificar con ${value} estrella(s)!`;
    });
  });

  function highlightStars(value) {
    stars.forEach(star => {
      if (parseInt(star.getAttribute('data-value')) <= value) {
        star.classList.add('filled');
        star.innerHTML = '★'; 
      } else {
        star.classList.remove('filled');
        star.innerHTML = '☆'; 
      }
    });
  }
});
  