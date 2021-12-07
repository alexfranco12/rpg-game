// game modals
// open the "learn to play" modal by clicking the button
document.getElementById('open-modal').addEventListener('click', () => {
    console.log('open model')
    document.getElementById('modal').style.display = "block";
});

// close the modal
document.getElementById('close-modal').addEventListener('click', () => {
    document.getElementById('modal').style.display = "none";
}); 