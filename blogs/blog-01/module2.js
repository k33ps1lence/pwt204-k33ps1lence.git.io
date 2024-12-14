function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');

    // Toggle class "open" cho sidebar
    sidebar.classList.toggle('open');

    // Toggle class "shift" cho nội dung
    content.classList.toggle('shift');
}