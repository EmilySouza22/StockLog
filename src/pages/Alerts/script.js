const tabs = document.querySelectorAll('.folderTab');
const contents = document.querySelectorAll('.tabContent');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(tab => tab.classList.remove('active'));
        contents.forEach(content => content.classList.remove('active'));

        tab.classList.add('active');

        const tabId = tab.getAttribute('data-tab');
        const target = document.getElementById(tabId);
        if (target) {
            target.classList.add('active');
        }
    });
});