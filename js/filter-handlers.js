// Initialize filter click handlers
const initFilterButtons = () => {
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
              // Handle navigation for different sections
            if (filter === 'powerbi' || filter === 'Tableau' || filter === 'python') {
                let sectionId;
                switch(filter) {
                    case 'powerbi':
                        sectionId = '#powerbi-section';
                        break;
                    case 'Tableau':
                        sectionId = '#tableau-section';
                        break;
                    case 'python':
                        sectionId = '#python-section';
                        break;
                }
                window.location.href = `projects-micro.html${sectionId}`;
            }
        });
    });
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initFilterButtons();
});
