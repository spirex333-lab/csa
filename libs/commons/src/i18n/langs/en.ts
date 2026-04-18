export default {

    components: {
        toolbar: {
            search: {
                placeholder: "Search"
            }
        }
    },

    classes: {
        loan: {
            amount: {
                error: "Should not be empty"
            }
        },
        member: {
            email: {
                error: "Should be a valid email"
            },
            username: {
                error: "Should be a unique username"
            },
            password: {
                error: "Should not be empty"
            },
            role: {
                error: "Should not be empty"
            },
        },
        customer: {
            email: {
                error: "Should be a valid email"
            },
            username: {
                error: "Should be a unique username"
            },
            password: {
                error: "Should not be empty"
            },
            role: {
                error: "Should not be empty"
            },
        },
        application: {
            email: {
                error: "Should be a valid email"
            },
            username: {
                error: "Should not be empty"
            },
            phone: {
                error: "Should not be empty"
            }
        }
    }
}