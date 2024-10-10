// Import the necessary Firebase services
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAAKS8RzC6wZmg9mOaPXrvMf3LuXsGyls",
    authDomain: "sports-buddy-bba97.firebaseapp.com",
    projectId: "sports-buddy-bba97",
    storageBucket: "sports-buddy-bba97.appspot.com",
    messagingSenderId: "563217360134",
    appId: "1:563217360134:web:4e3203500bfb1459346a87",
    measurementId: "G-8X2Z11DHB3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentUser = null;

// User registration and login event listener
document.getElementById('auth-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Validate email format
    if (!email.endsWith('@gmail.com')) {
        alert('Please use a Gmail address for registration.');
        return;
    }

    // Check if the form is for login or registration
    if (document.getElementById('auth-submit').innerText === 'Register') {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            alert('User registered successfully! You can now login.');
            document.getElementById('auth-form').reset();
        } catch (error) {
            console.error("Error registering user: ", error);
            alert(error.message);
        }
    } else {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert('User logged in successfully!');
            currentUser = auth.currentUser;
            document.getElementById('auth-section').classList.add('hidden-section');
            document.getElementById('user-actions').classList.remove('hidden-section');
        } catch (error) {
            console.error("Error logging in: ", error);
            alert(error.message);
        }
    }
});

// Show login instead of registration
document.getElementById('show-login').addEventListener('click', function() {
    document.getElementById('auth-title').innerText = 'Login';
    document.getElementById('auth-form').querySelector('.button').innerText = 'Login';
});

// User action buttons event listeners
document.getElementById('add-event-btn').addEventListener('click', function() {
    document.getElementById('user-actions').classList.add('hidden-section');
    document.getElementById('add-event-section').classList.remove('hidden-section');
});

document.getElementById('manage-events-btn').addEventListener('click', function() {
    document.getElementById('user-actions').classList.add('hidden-section');
    document.getElementById('manage-events-section').classList.remove('hidden-section');
    displayEvents();
});

// Add Sports Event
document.getElementById('add-event-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const eventName = document.getElementById('event-name').value;
    const gameType = document.getElementById('game-type').value;
    const specificGame = gameType === 'Other' ? document.getElementById('specific-game').value : gameType;

    // Add event to Firestore
    try {
        const docRef = await addDoc(collection(db, "events"), {
            eventName: eventName,
            gameType: specificGame,
        });
        alert('Event added successfully!');
        document.getElementById('add-event-form').reset();
        document.getElementById('add-event-section').classList.add('hidden-section');
        document.getElementById('user-actions').classList.remove('hidden-section');
    } catch (error) {
        console.error("Error adding document: ", error);
    }
});

// Display Events for Management
async function displayEvents() {
    const eventList = document.getElementById('event-list');
    eventList.innerHTML = '';

    const querySnapshot = await getDocs(collection(db, "events"));
    querySnapshot.forEach((doc) => {
        const li = document.createElement('li');
        li.innerText = `${doc.data().eventName} - ${doc.data().gameType}`;
        eventList.appendChild(li);
    });
}

// Cancel adding event
document.getElementById('cancel-add-event').addEventListener('click', function() {
    document.getElementById('add-event-section').classList.add('hidden-section');
    document.getElementById('user-actions').classList.remove('hidden-section');
});

// Back to User Actions
document.getElementById('back-to-user-actions').addEventListener('click', function() {
    document.getElementById('manage-events-section').classList.add('hidden-section');
    document.getElementById('user-actions').classList.remove('hidden-section');
});

// Handle showing specific game input
document.getElementById('game-type').addEventListener('change', function() {
    const gameType = this.value;
    const specificGameInput = document.getElementById("specific-game");
    if (gameType === "Other") {
        specificGameInput.classList.remove("hidden-section");
    } else {
        specificGameInput.classList.add("hidden-section");
        specificGameInput.value = ""; // Clear the input
    }
});

// Show authentication messages
function showAuthMessage(message) {
    const authMessage = document.getElementById("auth-message");
    authMessage.textContent = message;
    authMessage.classList.remove("hidden-section");
}
