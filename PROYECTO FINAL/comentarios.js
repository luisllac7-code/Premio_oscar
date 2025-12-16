
const commentsList = document.getElementById('comments-list');

const defaultComments = [
  {
    id: "1",
    name: "Lucía",
    country: "España",
    message: "¡Qué emoción! Este año las películas están increíbles.",
    timestamp: Date.now() - 3600000,
    likes: 5,
    avatarColor: "#FFD700"
  },
  {
    id: "2",
    name: "Carlos",
    country: "México",
    message: "Estoy esperando ver quién gana mejor director.",
    timestamp: Date.now() - 86400000,
    likes: 12,
    avatarColor: "#FF5733"
  },
  {
    id: "3",
    name: "Emily",
    country: "Argentina",
    message: "Las nominaciones estuvieron muy reñidas. ¡Me encanta!",
    timestamp: Date.now() - 172800000,
    likes: 3,
    avatarColor: "#33FF57"
  }
];


function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


function timeAgo(dateParam) {
  if (!dateParam) return "hace mucho";
  const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
  const today = new Date();
  const seconds = Math.round((today - date) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return "hace un momento";
  else if (minutes < 60) return `hace ${minutes} minutos`;
  else if (hours < 24) return `hace ${hours} horas`;
  else return `hace ${days} días`;
}


let comments = [];

function loadComments() {
  try {
    const stored = JSON.parse(localStorage.getItem("comments"));
    if (stored && Array.isArray(stored)) {

      comments = stored.map(c => ({
        ...c,
        id: c.id || Date.now().toString() + Math.random(),
        timestamp: c.timestamp || Date.now(),
        likes: c.likes || 0,
        avatarColor: c.avatarColor || getRandomColor()
      }));
    } else {
      comments = defaultComments;
    }
  } catch (e) {
    console.warn("Storage access failed, using defaults");
    comments = defaultComments;
  }
}

function saveComments() {
  try {
    localStorage.setItem("comments", JSON.stringify(comments));
  } catch (e) {
    console.warn("Save failed");
  }
}

function displayComments() {
  commentsList.innerHTML = "";

  const sortedComments = [...comments].sort((a, b) => b.timestamp - a.timestamp);

  sortedComments.forEach(comment => {
    const initial = comment.name ? comment.name.charAt(0).toUpperCase() : "?";

    const card = document.createElement("div");
    card.className = "comment-card";
    card.innerHTML = `
      <div class="comment-avatar" style="background-color: ${comment.avatarColor}">${initial}</div>
      <div class="comment-content">
        <div class="comment-header">
           <span class="comment-author">${comment.name} <small style="color: #666; font-weight:normal">(${comment.country})</small></span>
           <span class="comment-meta">${timeAgo(comment.timestamp)}</span>
        </div>
        <div class="comment-text">${comment.message}</div>
        <div class="comment-actions">
           <button class="action-btn ${comment.likes > 0 ? 'liked' : ''}" onclick="likeComment('${comment.id}')">
             ${comment.likes > 0 ? '❤️' : '🤍'} ${comment.likes}
           </button>
           <button class="action-btn delete-btn" onclick="deleteComment('${comment.id}')">
             🗑️ Eliminar
           </button>
        </div>
      </div>
    `;
    commentsList.appendChild(card);
  });
}


window.likeComment = function (id) {
  const comment = comments.find(c => c.id === id);
  if (comment) {
    comment.likes++;
    saveComments();
    displayComments();
  }
};

window.deleteComment = function (id) {
  if (confirm("¿Estás seguro de que quieres borrar este comentario?")) {
    comments = comments.filter(c => c.id !== id);
    saveComments();
    displayComments();
  }
};

window.addComment = function () {
  const nameInput = document.getElementById("name");
  const countryInput = document.getElementById("country");
  const messageInput = document.getElementById("message");

  const name = nameInput.value.trim();
  const country = countryInput.value.trim();
  const message = messageInput.value.trim();

  if (name && country && message) {
    const newComment = {
      id: Date.now().toString(),
      name,
      country,
      message,
      timestamp: Date.now(),
      likes: 0,
      avatarColor: getRandomColor()
    };

    comments.push(newComment);
    saveComments();
    displayComments();


    nameInput.value = "";
    countryInput.value = "";
    messageInput.value = "";
  } else {
    alert("Por favor, completa todos los campos.");
  }
};

window.addEventListener("DOMContentLoaded", () => {
  loadComments();
  displayComments();


  const stars = document.querySelectorAll('.star');
  const ratingMessage = document.getElementById('rating-message');

  let savedRating = null;
  try { savedRating = localStorage.getItem('userRating'); } catch (e) { }

  if (savedRating) {
    highlightStars(savedRating);
    ratingMessage.textContent = `¡Gracias por calificar con ${savedRating} estrella(s)!`;
  }

  stars.forEach(star => {
    star.addEventListener('click', () => {
      const value = star.getAttribute('data-value');
      try { localStorage.setItem('userRating', value); } catch (e) { }
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
