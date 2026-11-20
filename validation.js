/* Jeremy Henry-Atohengbe | CSC 6370 | CW-05 */

"use strict";

const form = document.getElementById("person-form");
const errorSummary = document.getElementById("error-summary");
const result = document.getElementById("result");

const fields = [
    {
        input: document.getElementById("user-id"),
        error: document.getElementById("id-error"),
        label: "ID"
    },
    {
        input: document.getElementById("first-name"),
        error: document.getElementById("first-name-error"),
        label: "First Name"
    },
    {
        input: document.getElementById("last-name"),
        error: document.getElementById("last-name-error"),
        label: "Last Name"
    }
];

// Track fields that have been checked so typing does not flag untouched fields.
const checkedFields = new Set();

function getError(field) {
    const value = field.input.value.trim();

    if (value === "") {
        return `Please enter a ${field.label}.`;
    }

    if (field.input.id === "user-id" && !/^[0-9]+$/.test(value)) {
        return "ID must contain digits only.";
    }

    return "";
}

function validateField(field) {
    const message = getError(field);

    // Only fixed validation messages are inserted with innerHTML.
    field.error.innerHTML = message;

    if (message !== "") {
        field.input.setAttribute("aria-invalid", "true");
    } else {
        field.input.removeAttribute("aria-invalid");
    }

    return message;
}

function updateSummary() {
    const count = fields.filter(
        (field) => field.error.textContent !== ""
    ).length;

    errorSummary.textContent = count === 0
        ? ""
        : `Please correct ${count} ${count === 1 ? "field" : "fields"} below.`;
}

function displayResult(values) {
    const heading = document.createElement("h2");
    heading.textContent = "Last Added Person";

    const labels = ["UserID", "First Name", "Last Name"];
    const content = [heading];

    values.forEach((value, index) => {
        const paragraph = document.createElement("p");
        const label = document.createElement("strong");

        label.textContent = `${labels[index]}: `;

        // User input is displayed as text, never interpreted as HTML.
        paragraph.append(label, document.createTextNode(value));
        content.push(paragraph);
    });

    // Replace the previous entry instead of accumulating results.
    result.replaceChildren(...content);
}

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const errors = [];

    fields.forEach((field) => {
        checkedFields.add(field.input.id);

        const message = validateField(field);

        if (message !== "") {
            errors.push({ field, message });
        }
    });

    updateSummary();

    if (errors.length > 0) {
        // Loop through every error and list them in field order.
        let alertMessage = "Please correct the following fields:\n";

        errors.forEach((error, index) => {
            alertMessage += `\n${index + 1}. ${error.message}`;
        });

        window.alert(alertMessage);
        errors[0].field.input.focus();
        return;
    }

    const values = fields.map((field) => field.input.value.trim());

    displayResult(values);
    form.reset();

    checkedFields.clear();

    fields.forEach((field) => {
        field.error.innerHTML = "";
        field.input.removeAttribute("aria-invalid");
    });

    errorSummary.textContent = "";
    fields[0].input.focus();
});

fields.forEach((field) => {
    // Check a field when the user leaves it.
    field.input.addEventListener("blur", () => {
        checkedFields.add(field.input.id);
        validateField(field);
        updateSummary();
    });

    // Clear or update feedback while a previously checked field is edited.
    field.input.addEventListener("input", () => {
        if (checkedFields.has(field.input.id)) {
            validateField(field);
            updateSummary();
        }
    });
});