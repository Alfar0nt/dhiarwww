/**
 * Link-in-Bio Configuration
 * It is extremely easy to modify your links here!
 * Simply add, edit, or remove objects in the `links` array below.
 */

const links = [
    {
        title: "LinkedIn",
        description: "Connect with me professionally.",
        url: "https://www.linkedin.com/in/dhiaurrahman-rh/",
        // Or leave image blank and it will fallback to an SVG icon or default
        image: "https://cdn-icons-png.flaticon.com/512/3536/3536505.png"
    },
    {
        title: "Curiculum Vitae",
        description: "My CV or personal Resume. (You need to request access first)",
        url: "https://drive.google.com/file/d/1NYIONo-DlEVeUiP2UW6Sch7AeS0siAjG/view?usp=drive_link",
        // Or leave image blank and it will fallback to an SVG icon or default
        image: "https://cdn-icons-png.flaticon.com/512/909/909212.png"
    },
    {
        title: "Personal Wiki and Blog",
        description: "Used to documenting my works, projects, thoughts, or something that i dont want to forget..",
        url: "https://wiki.dhiar.my.id",
        // You can provide an image URL:
        image: "https://cdn-icons-png.flaticon.com/512/2920/2920849.png"
    },
    {
        title: "GitHub",
        description: "Check out my personal or open-source projects.",
        url: "https://github.com/Alfar0nt/",
        image: "https://cdn-icons-png.flaticon.com/512/5968/5968866.png"
    },
    {
        title: "Instagram",
        description: "My Personal Dumps.",
        url: "https://instagram.com/dhiarharianto",
        image: "https://cdn-icons-png.flaticon.com/512/15713/15713420.png"
    },
    {
        title: "YouTube Channel",
        description: "Mostly just a College Projects.",
        url: "https://www.youtube.com/@dhiarharianto/",
        image: "https://cdn-icons-png.flaticon.com/512/3938/3938026.png"
    },
    {
        title: "Spotify",
        description: "My Fav Songs.",
        url: "https://open.spotify.com/user/8kdkeoxc1li5pzujpuy8n7ie6?si=5c04c94b6a704489",
        image: "https://cdn-icons-png.flaticon.com/512/3537/3537017.png"
    }
];

/**
 * Render the links to the page dynamically.
 */
document.addEventListener("DOMContentLoaded", () => {
    const linksContainer = document.getElementById("links-container");

    if (!linksContainer) return;

    links.forEach((link, index) => {
        // Create the anchor tag wrapper
        const linkEl = document.createElement("a");
        linkEl.href = link.url;
        linkEl.className = "link-card";
        linkEl.target = "_blank"; // Open in new tab
        linkEl.rel = "noopener noreferrer"; // Security best practice

        // Stagger the animation delay for a cascade effect
        linkEl.style.animationDelay = `${0.2 + (index * 0.1)}s`;

        // Determine icon/image content
        let mediaContent = '';
        if (link.image) {
            mediaContent = `<img src="${link.image}" alt="${link.title} Icon" loading="lazy">`;
        } else {
            // Default SVG icon if no image is provided
            mediaContent = `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
            `;
        }

        // Populate the inner HTML
        linkEl.innerHTML = `
            <div class="link-icon-container">
                ${mediaContent}
            </div>
            <div class="link-content">
                <h3 class="link-title">${link.title}</h3>
                <p class="link-desc">${link.description}</p>
            </div>
            <svg class="share-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
        `;

        // Append to container
        linksContainer.appendChild(linkEl);
    });
});
