function displayMessage() {
    let inputbox = document.getElementById('message');

    let message = inputbox.value;


    Swal.fire(
        {
            backdrop: false,
            title: 'App Name',
            text: message
        }
    )
}