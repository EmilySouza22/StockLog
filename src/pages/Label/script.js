/* MODAL */

const openButtons = document.querySelectorAll('.btnConfig2');

openButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modalId = button.getAttribute('data-modal');
        const modal = document.getElementById(modalId);

        modal.showModal();
    })
});

// JsBarcode(".barcode").init();
