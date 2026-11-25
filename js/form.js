const contactForm = document.querySelector("#contact-form");
const nameField = document.querySelector("#name");
const fields = contactForm.querySelectorAll('input, select, textarea');

// we will take care of the validation
contactForm.noValidate = true;

// custom validation logic on top of the basic required on most fields
const runCustomValidators = () => {
    // 1. Reset all custom errors first so native rules (required) re-evaluate cleanly
    fields.forEach((field) => field.setCustomValidity(''));

    if (nameField.value.length < 3) {
        nameField.setCustomValidity('Please enter your full name (at least 3 characters)');
    }
};

// move the validation messages into the dataset so we can display using CSS
// its a bit weird, but it uses datasets and some funky css rules
const syncAllErrors = () => {
    // Sync every field's current message (native OR custom) to its parent <label>
    fields.forEach((field) => {
        field.closest('label').dataset.error = field.validationMessage;
    });
};

// when they start typing lets resync the validation messages until they submit again
contactForm.querySelectorAll('input, select').forEach((input) => {
    input.addEventListener('input', () => {
        syncAllErrors();
    });
});

// Validate everything at once on submit
contactForm.addEventListener('submit', (e) => {
    runCustomValidators();
    syncAllErrors();

    if (!contactForm.checkValidity()) {
        // if the form is not valid display the validation errors
        e.preventDefault();
        contactForm.classList.add('was-validated');
    } else {
        // otherwise we tell the user its all good and reset the page
        // and for your viewing pleasure, an alert box as a joke.
        e.preventDefault();
        alert('Your form has been submitted!');
        contactForm.reset();
        contactForm.classList.remove('was-validated');
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
});
