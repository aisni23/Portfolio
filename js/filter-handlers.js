// Initialize filter click handlers
const initFilterButtons = () => {
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            if (filter === 'powerbi' || filter === 'Tableau') {
                // Redirect to projects page with appropriate section
                window.location.href = `projects-micro.html${filter === 'powerbi' ? '#powerbi-section' : '#tableau-section'}`;
            }
        });
    });
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initFilterButtons();
});
