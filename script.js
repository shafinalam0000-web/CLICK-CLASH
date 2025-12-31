// Load points from localStorage or start at 0
let points = parseInt(localStorage.getItem("points")) || 0;
document.getElementById("points").innerText = points;

// Load leaderboard from localStorage or empty
let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

// Function to update leaderboard display
function updateLeaderboard() {
    const lb = document.getElementById("leaderboard");
    lb.innerHTML = "";
    leaderboard.sort((a,b) => b.points - a.points); // highest first
    leaderboard.slice(0, 5).forEach(player => {
        const li = document.createElement("li");
        li.innerText = `${player.name}: ${player.points}`;
        lb.appendChild(li);
    });
}

// Click button logic
document.getElementById("clickButton").addEventListener("click", () => {
    points += 1;
    document.getElementById("points").innerText = points;
    localStorage.setItem("points", points);
});

// Add yourself to leaderboard
function addToLeaderboard() {
    const name = prompt("Enter your name for the leaderboard:") || "Anonymous";
    leaderboard.push({ name: name, points: points });
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    updateLeaderboard();
}

// Run leaderboard display on page load
updateLeaderboard();

// Optional: ask user to submit score when leaving page
window.addEventListener("beforeunload", () => {
    addToLeaderboard();
});
