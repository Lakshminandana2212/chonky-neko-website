// Get the cat image element from the HTML
const catChaser = document.getElementById('cat-chaser');

// Listen for the 'mousemove' event on the entire window
window.addEventListener('mousemove', (event) => {
    // Get the mouse's X and Y coordinates from the event
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // Update the cat's position using CSS Transform.
    // We subtract 50px from each to center the 100px cat image on the cursor.
    // The smooth movement comes from the 'transition' property in the CSS.
    catChaser.style.transform = `translate(${mouseX - 50}px, ${mouseY - 50}px)`;
});