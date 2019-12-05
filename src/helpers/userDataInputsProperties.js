const inputsProperties = [
    {
        id: "fName",
        name: "fName",
        label: "First Name",
        type: "text",
        errorMessage: "Please provide a valid first name"
    },
    {
        id: "lName",
        name: "lName",
        label: "Last Name",
        type: "text",
        errorMessage: "Please provide a valid last name"
    },
    {
        id: "password",
        name: "password",
        label: "Password",
        type: "password",
        errorMessage:
            "The password must be at least 8 characters and include a combination of lowercase, uppercase letters and numbers"
    },
    {
        id: "confirmPassword",
        name: "confirmPassword",
        label: "Confirm Password",
        type: "password",
        errorMessage: "The passwords don't match"
    }
];

export { inputsProperties };
