// Register
function register() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(cred => {
      return db.collection("users").doc(cred.user.uid).set({
        name: name,
        email: email
      });
    })
    .then(() => {
      alert("Akun berhasil dibuat!");
      window.location.href = "feed.html";
    })
    .catch(err => alert(err.message));
}

// Login
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "feed.html";
    })
    .catch(err => alert("Login gagal: " + err.message));
}

// Logout
function logout() {
  auth.signOut().then(() => {
    window.location.href = "index.html";
  });
}

// Create Post
function createPost() {
  const content = document.getElementById("postContent").value;
  const user = auth.currentUser;
  if (!user) return;

  db.collection("posts").add({
    userId: user.uid,
    content: content,
    createdAt: new Date()
  }).then(() => {
    document.getElementById("postContent").value = "";
    loadFeed();
  });
}

// Load Feed
function loadFeed() {
  db.collection("posts").orderBy("createdAt", "desc").get().then(snapshot => {
    let html = "";
    snapshot.forEach(doc => {
      html += `<div class="box"><p>${doc.data().content}</p></div>`;
    });
    document.getElementById("feedContainer").innerHTML = html;
  });
}

// Cek halaman feed & load otomatis
if (window.location.pathname.includes("feed.html")) {
  auth.onAuthStateChanged(user => {
    if (user) loadFeed();
    else window.location.href = "index.html";
  });
}

// Cek halaman profil & load data user
if (window.location.pathname.includes("profile.html")) {
  auth.onAuthStateChanged(user => {
    if (user) {
      db.collection("users").doc(user.uid).get().then(doc => {
        document.getElementById("userEmail").textContent = "Email: " + doc.data().email;
        document.getElementById("userName").textContent = "Nama: " + doc.data().name;
      });
    } else {
      window.location.href = "index.html";
    }
  });
}
