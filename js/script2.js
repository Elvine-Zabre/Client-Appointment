// Simple interaction for tabs
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelector('.tab.active').classList.remove('active');
        tab.classList.add('active');
    });
});

// Animation for buttons
document.querySelectorAll('.btn-primary').forEach(button => {
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-2px)';
    });
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
    });
});
