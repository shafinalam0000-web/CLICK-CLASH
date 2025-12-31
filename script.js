// ================================
// 1. Firebase Setup
// ================================
const firebaseConfig = {
  apiKey: "AIzaSyDUsBgtHJ7v0nJEL9Rz3qhF-C3P_tZJiMM",
  authDomain: "clicker-game-28c75.firebaseapp.com",
  projectId: "clicker-game-28c75",
  storageBucket: "clicker-game-28c75.firebasestorage.app",
  messagingSenderId: "345609148916",
  appId: "1:345609148916:web:a5b240449cb39fc25741a1",
  measurementId: "G-XYFY1NZ698"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// ================================
// 2. Login / Signup Buttons
// ================================
document.getElementById("signupBtn").addEventListener("click", () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            alert("Signed Up! Now log in.");
        })
        .catch(error => alert(error.message));
});

document.getElementById("loginBtn").addEventListener("click", () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            alert("Logged in!");
            document.getElementById("loginDiv").style.display = "none"; // hide login
            startClicker(userCredential.user.uid); // start game for this user
        })
        .catch(error => alert(error.message));
});

// ================================
// 3. Clicker Game Functions
// ================================
function startClicker(userId) {
    const pointsSpan = document.getElementById("points");

    // Load points from Firestore
    db.collection("users").doc(userId).get().then(docSnap => {
        let points = docSnap.exists ? docSnap.data().points : 0;
        pointsSpan.innerText = points;

        // Click button updates points
        document.getElementById("clickButton").addEventListener("click", async () => {
            points += 1;
            pointsSpan.innerText = points;
            await db.collection("users").doc(userId).set({ points: points }, { merge: true });
            updateLeaderboard(); // update leaderboard live
        });

        // Load leaderboard initially
        updateLeaderboard();
    });
}

// ================================
// 4. Leaderboard
// ================================
async function updateLeaderboard() {
    const lb = document.getElementById("leaderboard");
    lb.innerHTML = "";

    const snapshot = await db.collection("users").orderBy("points", "desc").limit(5).get();
    snapshot.forEach(doc => {
        const data = doc.data();
        const li = document.createElement("li");
        li.innerText = `${data.email || "Anonymous"}: ${data.points}`;
        lb.appendChild(li);
    });
}

