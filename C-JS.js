/* =========================================================
   PROTECH SOLUTIONS
   COMPLETE FRONTEND JAVASCRIPT
   CUSTOMER + ADMIN + STAFF MODULE

   IMPORTANT:
   This file must contain JavaScript only.
========================================================= */


/* =========================================================
   BACKEND API
========================================================= */

const API_BASE_URL = "http://localhost:3000/api";

/* =========================================================
   AUTHENTICATION & SESSION HELPERS
========================================================= */


/* ---------------------------------------------------------
   GET LOGGED-IN CUSTOMER
--------------------------------------------------------- */

function getLoggedInCustomer() {

    const stored =
        localStorage.getItem("loggedInCustomer");

    if (!stored) {
        return null;
    }

    try {

        const parsed =
            JSON.parse(stored);

        if (
            parsed &&
            typeof parsed === "object" &&
            parsed._id
        ) {
            return parsed;
        }

    } catch (e) {

        console.error(
            "Invalid customer session:",
            e
        );

        localStorage.removeItem(
            "loggedInCustomer"
        );
    }

    return null;
}


/* ---------------------------------------------------------
   GET LOGGED-IN STAFF
--------------------------------------------------------- */

function getLoggedInStaff() {

    const stored =
        localStorage.getItem("loggedInStaff");

    if (!stored) {
        return null;
    }

    try {

        const parsed =
            JSON.parse(stored);

        if (
            parsed &&
            typeof parsed === "object" &&
            parsed._id
        ) {
            return parsed;
        }

    } catch (e) {

        console.error(
            "Invalid staff session:",
            e
        );

        localStorage.removeItem(
            "loggedInStaff"
        );
    }

    return null;
}


/* =========================================================
   API RESPONSE HELPER
========================================================= */

async function readApiResponse(response) {

    const text =
        await response.text();

    if (!text) {
        return {};
    }

    try {

        return JSON.parse(text);

    } catch (e) {

        return {
            message: text
        };
    }
}


/* =========================================================
   CUSTOMER AUTHENTICATION GUARD
========================================================= */

function requireCustomerAuth() {

    const current =
        window.location.pathname
            .split("/")
            .pop() || "index.html";

    const publicPages = [

        "Login.html",
        "Registration.html",
        "ForgotPassword.html",
        "ResetPassword.html",
        "S_Login.html",
        "S_Registration.html"
    ];


    if (
        current.startsWith("S_")
    ) {
        return true;
    }


    if (
        publicPages.includes(current)
    ) {
        return true;
    }


    const customer =
        getLoggedInCustomer();


    if (
        !customer ||
        !customer._id
    ) {

        alert(
            "Please login to access this section."
        );

        window.location.replace(
            "Login.html"
        );

        return false;
    }

    return true;
}


/* =========================================================
   STAFF AUTHENTICATION GUARD
========================================================= */

function requireStaffAuth() {

    const current =
        window.location.pathname
            .split("/")
            .pop() || "";


    if (
        current.startsWith("S_") &&
        current !== "S_Login.html" &&
        current !== "S_Registration.html"
    ) {

        const staff =
            getLoggedInStaff();


        if (
            !staff ||
            !staff._id
        ) {

            localStorage.removeItem(
                "loggedInStaff"
            );

            localStorage.removeItem(
                "staffRole"
            );

            localStorage.removeItem(
                "staffUsername"
            );

            localStorage.removeItem(
                "staffEmail"
            );

            localStorage.removeItem(
                "staffId"
            );

            alert(
                "Staff authentication required. Please login."
            );

            window.location.replace(
                "S_Login.html"
            );

            return false;
        }

        return true;
    }

    return true;
}


/* =========================================================
   COMPLETE LOGOUT FUNCTION
========================================================= */

function logout() {

    if (
        !confirm(
            "Are you sure you want to logout?"
        )
    ) {
        return;
    }


    const current =
        window.location.pathname
            .split("/")
            .pop() || "";


    const isStaffPage =
        current.startsWith("S_");


    const staffSession =
        localStorage.getItem(
            "loggedInStaff"
        ) ||
        localStorage.getItem(
            "staffRole"
        ) ||
        localStorage.getItem(
            "staffUsername"
        );


    /* =====================================================
       STAFF / ADMIN LOGOUT
    ===================================================== */

    if (
        isStaffPage ||
        staffSession
    ) {

        localStorage.removeItem(
            "loggedInStaff"
        );

        localStorage.removeItem(
            "staffRole"
        );

        localStorage.removeItem(
            "staffUsername"
        );

        localStorage.removeItem(
            "staffEmail"
        );

        localStorage.removeItem(
            "staffId"
        );

        localStorage.removeItem(
            "adminSession"
        );

        localStorage.removeItem(
            "staffSession"
        );

        localStorage.removeItem(
            "loggedInCustomer"
        );

        sessionStorage.clear();

        alert(
            "Logged out successfully!"
        );

        window.location.replace(
            "S_Login.html"
        );

        return;
    }


    /* =====================================================
       CUSTOMER LOGOUT
    ===================================================== */

    localStorage.removeItem(
        "loggedInCustomer"
    );

    localStorage.removeItem(
        "loggedInStaff"
    );

    localStorage.removeItem(
        "staffRole"
    );

    localStorage.removeItem(
        "staffUsername"
    );

    localStorage.removeItem(
        "staffEmail"
    );

    localStorage.removeItem(
        "staffId"
    );

    localStorage.removeItem(
        "adminSession"
    );

    localStorage.removeItem(
        "staffSession"
    );

    sessionStorage.clear();

    alert(
        "Logged out successfully!"
    );

    window.location.replace(
        "Login.html"
    );
}


/* =========================================================
   STAFF LOGOUT
========================================================= */

function staffLogout() {

    if (
        !confirm(
            "Are you sure you want to logout from Staff Panel?"
        )
    ) {
        return;
    }


    localStorage.removeItem(
        "loggedInStaff"
    );

    localStorage.removeItem(
        "staffRole"
    );

    localStorage.removeItem(
        "staffUsername"
    );

    localStorage.removeItem(
        "staffEmail"
    );

    localStorage.removeItem(
        "staffId"
    );

    localStorage.removeItem(
        "adminSession"
    );

    localStorage.removeItem(
        "staffSession"
    );

    localStorage.removeItem(
        "loggedInCustomer"
    );

    sessionStorage.clear();

    alert(
        "Logged out successfully!"
    );

    window.location.replace(
        "S_Login.html"
    );
}


/* =========================================================
   UTILITIES & FORMATTERS
========================================================= */

function safeString(
    value,
    fallback = ""
) {

    if (
        value === null ||
        value === undefined
    ) {
        return fallback;
    }

    return String(value);
}


function formatDate(dateValue) {

    if (!dateValue) {
        return "-";
    }

    try {

        const d =
            new Date(dateValue);

        if (
            !isNaN(
                d.getTime()
            )
        ) {

            return d.toLocaleDateString(
                "en-IN",
                {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                }
            );
        }

    } catch (e) {}

    return (
        String(dateValue)
            .substring(0, 10) ||
        "-"
    );
}


function formatAmount(amount) {

    const num =
        Number(amount);

    if (isNaN(num)) {
        return "0";
    }

    return num.toLocaleString(
        "en-IN"
    );
}


function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}


function getCustomerId(cust) {

    if (!cust) {
        return "";
    }

    if (
        typeof cust === "object" &&
        cust._id
    ) {

        return String(
            cust._id
        );
    }

    return String(cust);
}


function sameId(a, b) {

    return (
        String(a || "").trim() ===
        String(b || "").trim()
    );
}


/* =========================================================
   PRODUCT IMAGE RESOLVER
========================================================= */

function resolveProductImage(img) {

    if (
        !img ||
        typeof img !== "string"
    ) {

        return "images/seethru-smart-dome.svg";
    }


    let cleaned =
        img.trim();


    if (
        cleaned.startsWith("http://") ||
        cleaned.startsWith("https://")
    ) {

        return cleaned;
    }


    const map = {

        "seethru-7-pro.jpeg":
            "seethru-7-pro.svg",

        "seethru-7-contactless.jpeg":
            "seethru-7-contactless.svg",

        "seethru-pro-nova.jpeg":
            "seethru-pro-nova.svg",

        "ace-pro-green-solar.jpeg":
            "ace-pro-green-solar.svg",

        "ace-pro-4g-mini-pt.jpeg":
            "ace-pro-4g-mini-pt.svg",

        "ace-pro-4g-linkage.jpeg":
            "ace-pro-4g-linkage.svg",

        "ace-pro-home-camera.jpeg":
            "ace-pro-home-camera.svg",

        "seethru-smart-nvr.jpeg":
            "seethru-smart-nvr.svg",

        "seethru-smart-dome.jpeg":
            "seethru-smart-dome.svg",

        "st-poe-4p2u.jpeg":
            "st-poe-4p2u.svg",

        "ace-pro-4g-dual-lens.jpeg":
            "ace-pro-4g-linkage.svg"
    };


    for (
        const [k, v]
        of Object.entries(map)
    ) {

        if (
            cleaned.includes(k)
        ) {

            return `images/${v}`;
        }
    }


    if (
        cleaned.startsWith(
            "./images/"
        )
    ) {

        return cleaned.replace(
            "./",
            ""
        );
    }


    if (
        cleaned.startsWith(
            "images/"
        )
    ) {

        return cleaned;
    }


    return `images/${cleaned}`;
}


/* =========================================================
   CART HELPERS
========================================================= */

const CART_STORAGE_KEY =
    "shoppingCart";


function getCart() {

    const saved =
        localStorage.getItem(
            CART_STORAGE_KEY
        );


    if (!saved) {
        return [];
    }


    try {

        const parsed =
            JSON.parse(saved);

        return Array.isArray(
            parsed
        )
            ? parsed
            : [];

    } catch (e) {

        console.error(
            "Unable to read shopping cart:",
            e
        );

        return [];
    }
}


/* ---------------------------------------------------------
   SAVE CART
--------------------------------------------------------- */

function saveCart(cart) {

    if (!Array.isArray(cart)) {
        cart = [];
    }

    localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cart)
    );

    updateCartCount();
}


/* ---------------------------------------------------------
   CART COUNT
--------------------------------------------------------- */

function updateCartCount() {

    const cartCountEl =
        document.getElementById(
            "cartCount"
        );


    if (!cartCountEl) {
        return;
    }


    const cart =
        getCart();


    const total =
        cart.reduce(
            (
                sum,
                item
            ) => {

                return (
                    sum +
                    Number(
                        item.quantity || 0
                    )
                );
            },
            0
        );


    cartCountEl.textContent =
        total;
}


/* =========================================================
   REMOVE PRODUCT FROM CART
========================================================= */

function removeCartItem(index) {

    let cart =
        getCart();


    const numericIndex =
        Number(index);


    if (
        !Number.isInteger(
            numericIndex
        )
    ) {

        console.error(
            "Invalid cart index:",
            index
        );

        return false;
    }


    if (
        numericIndex < 0 ||
        numericIndex >= cart.length
    ) {

        console.error(
            "Cart item does not exist:",
            numericIndex
        );

        return false;
    }


    const removedItem =
        cart[numericIndex];


    const productName =
        removedItem?.name ||
        removedItem?.productName ||
        removedItem?.product?.name ||
        "this product";


    cart.splice(
        numericIndex,
        1
    );


    saveCart(cart);


    console.log(
        "PROTECH CART: Removed item",
        removedItem
    );


    alert(
        `${productName} removed from cart.`
    );


    setTimeout(
        function () {

            window.location.reload();

        },
        100
    );


    return true;
}


/* ---------------------------------------------------------
   REMOVE CART ITEM BY PRODUCT ID
--------------------------------------------------------- */

function removeCartItemByProductId(
    productId
) {

    const cart =
        getCart();


    const index =
        cart.findIndex(
            function (item) {

                const itemId =
                    item.productId ||
                    item.productID ||
                    item._id ||
                    item.id ||
                    item.product?._id ||
                    item.product?.id ||
                    "";

                return sameId(
                    itemId,
                    productId
                );
            }
        );


    if (index === -1) {

        console.error(
            "Product was not found in cart:",
            productId
        );

        return false;
    }


    return removeCartItem(
        index
    );
}


/* ---------------------------------------------------------
   REMOVE FROM CART ALIAS
--------------------------------------------------------- */

function removeFromCart(value) {

    if (
        typeof value === "number" ||
        (
            typeof value === "string" &&
            value.trim() !== "" &&
            !isNaN(value)
        )
    ) {

        return removeCartItem(
            Number(value)
        );
    }


    return removeCartItemByProductId(
        value
    );
}


/*
 * Make the remove functions globally available.
 *
 * This is important if Cart.html uses:
 *
 * onclick="removeFromCart(...)"
 */

window.removeCartItem =
    removeCartItem;

window.removeCartItemByProductId =
    removeCartItemByProductId;

window.removeFromCart =
    removeFromCart;


/* ---------------------------------------------------------
   EVENT-DELEGATED REMOVE BUTTON HANDLER
--------------------------------------------------------- */

function setupCartRemoveHandler() {

    if (
        !document.body
    ) {
        return;
    }


    if (
        document.body.dataset.cartRemoveHandlerAttached ===
        "true"
    ) {
        return;
    }


    document.body.dataset.cartRemoveHandlerAttached =
        "true";


    document.addEventListener(
        "click",
        function (event) {

            const target =
                event.target;


            if (!target) {
                return;
            }


            const removeButton =
                target.closest(
                    [
                        "[data-cart-index]",
                        "[data-index]",
                        "[data-product-id]",
                        "[data-productid]",
                        "[data-id]",
                        ".remove-cart-item",
                        ".remove-btn",
                        ".cart-remove-btn",
                        ".remove-from-cart",
                        ".cart-remove"
                    ].join(",")
                );


            if (!removeButton) {
                return;
            }


            const buttonText =
                String(
                    removeButton.textContent || ""
                )
                    .trim()
                    .toLowerCase();


            const isRemoveButton =
                buttonText.includes("remove") ||
                removeButton.hasAttribute(
                    "data-cart-index"
                ) ||
                removeButton.hasAttribute(
                    "data-product-id"
                ) ||
                removeButton.classList.contains(
                    "remove-cart-item"
                ) ||
                removeButton.classList.contains(
                    "remove-btn"
                ) ||
                removeButton.classList.contains(
                    "cart-remove-btn"
                ) ||
                removeButton.classList.contains(
                    "remove-from-cart"
                ) ||
                removeButton.classList.contains(
                    "cart-remove"
                );


            if (!isRemoveButton) {
                return;
            }


            event.preventDefault();
            event.stopPropagation();


            const cartIndex =
                removeButton.getAttribute(
                    "data-cart-index"
                ) ??
                removeButton.getAttribute(
                    "data-index"
                );


            if (
                cartIndex !== null &&
                cartIndex !== ""
            ) {

                removeCartItem(
                    Number(cartIndex)
                );

                return;
            }


            const productId =
                removeButton.getAttribute(
                    "data-product-id"
                ) ??
                removeButton.getAttribute(
                    "data-productid"
                ) ??
                removeButton.getAttribute(
                    "data-id"
                );


            if (
                productId
            ) {

                removeCartItemByProductId(
                    productId
                );

                return;
            }


            const cartContainer =
                removeButton.closest(
                    [
                        "[data-cart-index]",
                        "[data-index]",
                        "[data-product-id]",
                        ".cart-item",
                        ".cart-product",
                        ".cart-item-card",
                        ".cart-product-item"
                    ].join(",")
                );


            if (cartContainer) {

                const surroundingIndex =
                    cartContainer.getAttribute(
                        "data-cart-index"
                    ) ??
                    cartContainer.getAttribute(
                        "data-index"
                    );


                if (
                    surroundingIndex !== null &&
                    surroundingIndex !== ""
                ) {

                    removeCartItem(
                        Number(
                            surroundingIndex
                        )
                    );

                    return;
                }


                const surroundingProductId =
                    cartContainer.getAttribute(
                        "data-product-id"
                    );


                if (
                    surroundingProductId
                ) {

                    removeCartItemByProductId(
                        surroundingProductId
                    );

                    return;
                }
            }


            const cart =
                getCart();


            const cartItems =
                document.querySelectorAll(
                    ".cart-item, .cart-product, .cart-item-card, .cart-product-item"
                );


            for (
                let i = 0;
                i < cartItems.length;
                i++
            ) {

                if (
                    cartItems[i].contains(
                        removeButton
                    )
                ) {

                    if (
                        i < cart.length
                    ) {

                        removeCartItem(i);
                    }

                    return;
                }
            }


            console.warn(
                "Remove button clicked, but no cart item/index/product ID could be determined.",
                removeButton
            );

        },
        true
    );
}


/* =========================================================
   CUSTOMER AUTHENTICATION SETUP
========================================================= */

function setupCustomerAuth() {


    /* =====================================================
       1. CUSTOMER REGISTRATION
    ===================================================== */

    const registerForm =
        document.getElementById(
            "registerForm"
        );


    if (registerForm) {

        registerForm.addEventListener(
            "submit",
            async function (e) {

                e.preventDefault();


                const fullName =
                    document.getElementById(
                        "fullName"
                    )?.value.trim();


                const email =
                    document.getElementById(
                        "registerEmail"
                    )?.value.trim();


                const mobile =
                    document.getElementById(
                        "mobile"
                    )?.value.trim();


                const address =
                    document.getElementById(
                        "address"
                    )?.value.trim();


                const password =
                    document.getElementById(
                        "registerPassword"
                    )?.value;


                const confirmPassword =
                    document.getElementById(
                        "confirmPassword"
                    )?.value;


                if (
                    !fullName ||
                    !email ||
                    !mobile ||
                    !address ||
                    !password
                ) {

                    alert(
                        "Please fill in all required registration fields."
                    );

                    return;
                }


                if (
                    !/^\d{10}$/.test(
                        mobile
                    )
                ) {

                    alert(
                        "Mobile number must contain exactly 10 digits (numbers only)."
                    );

                    return;
                }


                if (
                    password.length < 6
                ) {

                    alert(
                        "Password must be at least 6 characters long."
                    );

                    return;
                }


                if (
                    password !==
                    confirmPassword
                ) {

                    alert(
                        "Password and Confirm Password do not match."
                    );

                    return;
                }


                const submitBtn =
                    registerForm.querySelector(
                        "button[type='submit']"
                    );


                if (submitBtn) {

                    submitBtn.disabled =
                        true;

                    submitBtn.textContent =
                        "Creating Account...";
                }


                try {

                    const res =
                        await fetch(
                            `${API_BASE_URL}/customers`,
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json",

                                    "Accept":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify({

                                        name:
                                            fullName,

                                        email:
                                            email,

                                        phone:
                                            mobile,

                                        address:
                                            address,

                                        password:
                                            password
                                    })
                            }
                        );


                    const data =
                        await readApiResponse(
                            res
                        );


                    if (!res.ok) {

                        alert(
                            data.message ||
                            data.error ||
                            "Registration failed. Please check your details."
                        );


                        if (submitBtn) {

                            submitBtn.disabled =
                                false;

                            submitBtn.textContent =
                                "Create Account";
                        }

                        return;
                    }


                    alert(
                        "Account created successfully! Please login with your registered credentials."
                    );


                    window.location.replace(
                        "Login.html"
                    );

                } catch (err) {

                    console.error(
                        "Registration error:",
                        err
                    );


                    alert(
                        "Unable to connect to the server. Please check your connection."
                    );


                    if (submitBtn) {

                        submitBtn.disabled =
                            false;

                        submitBtn.textContent =
                            "Create Account";
                    }
                }
            }
        );
    }


    /* =====================================================
       2. CUSTOMER LOGIN
    ===================================================== */

    const loginForm =
        document.getElementById(
            "loginForm"
        );


    const customerLoginBtn =
        document.getElementById(
            "customerLoginBtn"
        );


    /* -----------------------------------------------------
       CUSTOMER LOGIN FUNCTION
    ----------------------------------------------------- */

    async function performCustomerLogin(event) {

        if (event) {

            event.preventDefault();

            event.stopPropagation();
        }


        console.log(
            "CUSTOMER LOGIN: Button clicked"
        );


        const userType =
            document.querySelector(
                'input[name="userType"]:checked'
            )?.value ||
            "customer";


        /* -------------------------------------------------
           STAFF REDIRECT
        ------------------------------------------------- */

        if (
            userType === "staff"
        ) {

            window.location.replace(
                "S_Login.html"
            );

            return;
        }


        /* -------------------------------------------------
           GET INPUTS
        ------------------------------------------------- */

        const emailInput =
            document.getElementById(
                "email"
            );


        const passwordInput =
            document.getElementById(
                "password"
            );


        const email =
            emailInput?.value.trim();


        const password =
            passwordInput?.value;


        /* -------------------------------------------------
           BASIC VALIDATION
        ------------------------------------------------- */

        if (
            !email ||
            !password
        ) {

            alert(
                "Please enter both email and password."
            );

            return;
        }


        /* -------------------------------------------------
           VALIDATE EMAIL FORMAT
        ------------------------------------------------- */

        if (
            emailInput &&
            !emailInput.checkValidity()
        ) {

            emailInput.reportValidity();

            return;
        }


        /* -------------------------------------------------
           LOGIN BUTTON
        ------------------------------------------------- */

        const button =
            document.getElementById(
                "customerLoginBtn"
            );


        if (button) {

            button.disabled =
                true;

            button.textContent =
                "Signing In...";
        }


        try {

            console.log(
                "CUSTOMER LOGIN: Sending request..."
            );


            /* -------------------------------------------------
               SEND LOGIN REQUEST
            ------------------------------------------------- */

            const response =
                await fetch(
                    `${API_BASE_URL}/customers/login`,
                    {
                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Accept":
                                "application/json"
                        },

                        body:
                            JSON.stringify({

                                email:
                                    email,

                                password:
                                    password
                            })
                    }
                );


            console.log(
                "CUSTOMER LOGIN HTTP STATUS:",
                response.status
            );


            /* -------------------------------------------------
               READ RESPONSE
            ------------------------------------------------- */

            let data = {};

            let responseText = "";


            try {

                responseText =
                    await response.text();


                console.log(
                    "CUSTOMER LOGIN RESPONSE:",
                    responseText
                );


                if (
                    responseText
                ) {

                    try {

                        data =
                            JSON.parse(
                                responseText
                            );

                    } catch (jsonError) {

                        data = {

                            message:
                                responseText
                        };
                    }
                }

            } catch (responseError) {

                console.error(
                    "Unable to read login response:",
                    responseError
                );
            }


            console.log(
                "CUSTOMER LOGIN DATA:",
                data
            );


            /* =================================================
               WRONG PASSWORD - HTTP 401
            ================================================= */

            if (
                response.status === 401
            ) {

                alert(
                    "Invalid password."
                );


                if (button) {

                    button.disabled =
                        false;

                    button.textContent =
                        "Login to Dashboard";
                }


                return;
            }


            /* =================================================
               CHECK BACKEND ERROR MESSAGE
            ================================================= */

            const backendMessage =
                String(
                    data?.message ||
                    data?.error ||
                    ""
                ).trim();


            const lowerMessage =
                backendMessage.toLowerCase();


            /*
             * Detect password-related backend messages even
             * when the backend does not return HTTP 401.
             */

            const passwordError =
                lowerMessage.includes(
                    "invalid password"
                ) ||
                lowerMessage.includes(
                    "wrong password"
                ) ||
                lowerMessage.includes(
                    "incorrect password"
                ) ||
                lowerMessage.includes(
                    "password is incorrect"
                ) ||
                lowerMessage.includes(
                    "password incorrect"
                ) ||
                lowerMessage.includes(
                    "invalid credentials"
                );


            /* =================================================
               PASSWORD ERROR FROM BACKEND MESSAGE
            ================================================= */

            if (
                passwordError
            ) {

                alert(
                    "Invalid password."
                );


                if (button) {

                    button.disabled =
                        false;

                    button.textContent =
                        "Login to Dashboard";
                }


                return;
            }


            /* =================================================
               OTHER SERVER ERROR
            ================================================= */

            if (
                !response.ok
            ) {

                alert(
                    backendMessage ||
                    "Unable to login. Please try again."
                );


                if (button) {

                    button.disabled =
                        false;

                    button.textContent =
                        "Login to Dashboard";
                }


                return;
            }


            /* =================================================
               SUCCESS FALSE
            ================================================= */

            if (
                data.success === false
            ) {

                /*
                 * If login failed but the backend did not
                 * provide a recognizable password message,
                 * show its actual message.
                 */

                alert(
                    backendMessage ||
                    "Login failed. Please try again."
                );


                if (button) {

                    button.disabled =
                        false;

                    button.textContent =
                        "Login to Dashboard";
                }


                return;
            }


            /* =================================================
               CUSTOMER OBJECT CHECK
            ================================================= */

            if (
                !data.customer ||
                !data.customer._id
            ) {

                console.error(
                    "Customer was not returned:",
                    data
                );


                alert(
                    "Login failed. Customer information was not returned."
                );


                if (button) {

                    button.disabled =
                        false;

                    button.textContent =
                        "Login to Dashboard";
                }


                return;
            }


            /* =================================================
               SUCCESSFUL CUSTOMER LOGIN
            ================================================= */

            localStorage.removeItem(
                "loggedInStaff"
            );

            localStorage.removeItem(
                "staffRole"
            );

            localStorage.removeItem(
                "staffUsername"
            );

            localStorage.removeItem(
                "staffEmail"
            );

            localStorage.removeItem(
                "staffId"
            );

            localStorage.removeItem(
                "adminSession"
            );

            localStorage.removeItem(
                "staffSession"
            );


            localStorage.setItem(
                "loggedInCustomer",
                JSON.stringify(
                    data.customer
                )
            );


            console.log(
                "CUSTOMER LOGIN SUCCESSFUL"
            );


            window.location.replace(
                "Dashboard.html"
            );

        } catch (error) {

            console.error(
                "CUSTOMER LOGIN ERROR:",
                error
            );


            alert(
                "Unable to connect to the server. Please ensure the backend is running."
            );


            if (button) {

                button.disabled =
                    false;

                button.textContent =
                    "Login to Dashboard";
            }
        }
    }


    /* -----------------------------------------------------
       CUSTOMER LOGIN BUTTON
    ----------------------------------------------------- */

    if (
        customerLoginBtn
    ) {

        customerLoginBtn.addEventListener(
            "click",
            performCustomerLogin
        );
    }


    /* -----------------------------------------------------
       CUSTOMER FORM SUBMIT
       
       This is kept as a backup in case the form is submitted
       by the browser rather than clicking the button.
    ----------------------------------------------------- */

    if (
        loginForm
    ) {

        loginForm.addEventListener(
            "submit",
            performCustomerLogin
        );
    }


    /* =====================================================
       3. STAFF LOGIN
    ===================================================== */

    const staffLoginForm =
        document.getElementById(
            "staffLoginForm"
        );


    if (staffLoginForm) {

        staffLoginForm.addEventListener(
            "submit",
            async function (e) {

                e.preventDefault();


                const username =
                    document.getElementById(
                        "staffUsername"
                    )?.value.trim();


                const password =
                    document.getElementById(
                        "staffPassword"
                    )?.value;


                const role =
                    document.getElementById(
                        "staffRole"
                    )?.value;


                if (
                    !username ||
                    !password ||
                    !role
                ) {

                    alert(
                        "Please enter username, password, and select your role."
                    );

                    return;
                }


                const submitBtn =
                    staffLoginForm.querySelector(
                        "button[type='submit']"
                    );


                if (submitBtn) {

                    submitBtn.disabled =
                        true;

                    submitBtn.textContent =
                        "Authenticating...";
                }


                try {

                    const res =
                        await fetch(
                            `${API_BASE_URL}/staff/login`,
                            {
                                method: "POST",

                                headers: {

                                    "Content-Type":
                                        "application/json",

                                    "Accept":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify({

                                        username:
                                            username,

                                        password:
                                            password,

                                        role:
                                            role
                                    })
                            }
                        );


                    console.log(
                        "STAFF LOGIN HTTP STATUS:",
                        res.status
                    );


                    if (
                        res.status === 401
                    ) {

                        let errorData = {};


                        try {

                            errorData =
                                await readApiResponse(
                                    res
                                );

                        } catch (error) {

                            console.error(
                                "Could not read staff login error response:",
                                error
                            );
                        }


                        console.log(
                            "STAFF LOGIN ERROR RESPONSE:",
                            errorData
                        );


                        alert(
                            "Invalid password."
                        );


                        if (submitBtn) {

                            submitBtn.disabled =
                                false;

                            submitBtn.textContent =
                                "Login";
                        }


                        return;
                    }


                    const data =
                        await readApiResponse(
                            res
                        );


                    console.log(
                        "STAFF LOGIN RESPONSE:",
                        data
                    );


                    if (
                        !res.ok
                    ) {

                        alert(
                            data.message ||
                            data.error ||
                            "Invalid username or credentials."
                        );


                        if (submitBtn) {

                            submitBtn.disabled =
                                false;

                            submitBtn.textContent =
                                "Login";
                        }


                        return;
                    }


                    if (
                        data.success === false
                    ) {

                        const backendMessage =
                            String(
                                data.message ||
                                data.error ||
                                ""
                            ).toLowerCase();


                        if (
                            backendMessage.includes(
                                "password"
                            )
                        ) {

                            alert(
                                "Invalid password."
                            );

                        } else {

                            alert(
                                data.message ||
                                data.error ||
                                "Invalid username or credentials."
                            );
                        }


                        if (submitBtn) {

                            submitBtn.disabled =
                                false;

                            submitBtn.textContent =
                                "Login";
                        }


                        return;
                    }


                    if (
                        !data.staff ||
                        !data.staff._id
                    ) {

                        console.error(
                            "Invalid staff login response:",
                            data
                        );


                        alert(
                            "Login failed. Staff information was not returned."
                        );


                        if (submitBtn) {

                            submitBtn.disabled =
                                false;

                            submitBtn.textContent =
                                "Login";
                        }


                        return;
                    }


                    localStorage.removeItem(
                        "loggedInCustomer"
                    );


                    localStorage.setItem(
                        "loggedInStaff",
                        JSON.stringify(
                            data.staff
                        )
                    );


                    localStorage.setItem(
                        "staffRole",
                        data.staff.role ||
                        role
                    );


                    localStorage.setItem(
                        "staffUsername",
                        data.staff.name ||
                        data.staff.username ||
                        username
                    );


                    window.location.replace(
                        "S_Dashboard.html"
                    );

                } catch (err) {

                    console.error(
                        "Staff login error:",
                        err
                    );


                    alert(
                        "Unable to connect to staff backend server."
                    );


                    if (submitBtn) {

                        submitBtn.disabled =
                            false;

                        submitBtn.textContent =
                            "Login";
                    }
                }
            }
        );
    }
}


/* =========================================================
   CUSTOMER DASHBOARD HEADER & WELCOME
========================================================= */

function setupDashboardHeader() {

    const customer =
        getLoggedInCustomer();


    if (customer) {

        const welcomeHeading =
            document.querySelector(
                ".welcome h1"
            );


        if (
            welcomeHeading &&
            !welcomeHeading.id
        ) {

            welcomeHeading.textContent =
                `Welcome, ${customer.name}!`;
        }
    }


    const staffWelcome =
        document.getElementById(
            "staffWelcome"
        );


    if (staffWelcome) {

        const staff =
            getLoggedInStaff();


        if (staff) {

            staffWelcome.textContent =
                `Welcome, ${staff.name} (${staff.role})!`;


            const roleDisplay =
                document.getElementById(
                    "staffRoleDisplay"
                );


            if (roleDisplay) {

                roleDisplay.textContent =
                    staff.role;
            }
        }
    }
}


/* =========================================================
   ORDER PAGE
========================================================= */

function setupOrderPage() {

    const orderForm =
        document.getElementById(
            "orderForm"
        );


    const orderButton =
        document.getElementById(
            "placeOrderBtn"
        );


    if (
        !orderForm &&
        !orderButton
    ) {
        return;
    }


    console.log(
        "PROTECH ORDER: Order page initialized"
    );


    if (orderForm) {

        orderForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();

                await placeProtechOrder();
            }
        );

        return;
    }


    if (orderButton) {

        orderButton.addEventListener(
            "click",
            async function (event) {

                event.preventDefault();

                await placeProtechOrder();
            }
        );
    }
}


/* =========================================================
   PLACE PROTECH ORDER
========================================================= */

async function placeProtechOrder() {

    console.log(
        "PROTECH ORDER: Place Order button clicked"
    );


    const customer =
        getLoggedInCustomer();


    if (
        !customer ||
        !customer._id
    ) {

        alert(
            "Please login before placing an order."
        );


        window.location.replace(
            "Login.html"
        );


        return;
    }


    const fullNameInput =
        document.getElementById(
            "fullName"
        ) ||
        document.getElementById(
            "orderFullName"
        );


    const phoneInput =
        document.getElementById(
            "phone"
        ) ||
        document.getElementById(
            "contactPhone"
        ) ||
        document.getElementById(
            "mobile"
        ) ||
        document.getElementById(
            "orderPhone"
        );


    const addressInput =
        document.getElementById(
            "address"
        ) ||
        document.getElementById(
            "deliveryAddress"
        ) ||
        document.getElementById(
            "installationAddress"
        ) ||
        document.getElementById(
            "orderAddress"
        );


    const notesInput =
        document.getElementById(
            "notes"
        ) ||
        document.getElementById(
            "orderNotes"
        ) ||
        document.getElementById(
            "installationNotes"
        );


    const fullName =
        fullNameInput?.value.trim() ||
        customer.name ||
        "";


    const phone =
        phoneInput?.value.trim() ||
        customer.phone ||
        "";


    const address =
        addressInput?.value.trim() ||
        customer.address ||
        "";


    const notes =
        notesInput?.value.trim() ||
        "";


    if (!fullName) {

        alert(
            "Please enter your full name."
        );

        fullNameInput?.focus();

        return;
    }


    if (!phone) {

        alert(
            "Please enter your contact phone number."
        );

        phoneInput?.focus();

        return;
    }


    if (
        !/^\d{10}$/.test(
            phone
        )
    ) {

        alert(
            "Contact phone number must contain exactly 10 digits (numbers only)."
        );

        phoneInput?.focus();

        return;
    }


    if (!address) {

        alert(
            "Please enter the installation and delivery address."
        );

        addressInput?.focus();

        return;
    }


    const cart =
        getCart();


    if (
        !Array.isArray(cart) ||
        cart.length === 0
    ) {

        alert(
            "Your cart is empty. Please add a product before placing an order."
        );

        return;
    }


    console.log(
        "PROTECH CART:",
        cart
    );


    const orderItems = [];


    for (
        const item of cart
    ) {

        const productId =
            item.productId ||
            item.productID ||
            item._id ||
            item.id ||
            item.product?._id ||
            item.product?.id ||
            null;


        const quantity =
            Math.max(
                1,
                Number(
                    item.quantity || 1
                )
            );


        if (!productId) {

            console.error(
                "Product ID missing:",
                item
            );


            alert(
                `Product ID is missing for "${item.name || item.productName || "a product"}". Please remove this product from the cart and add it again.`
            );


            return;
        }


        orderItems.push({

            productId:
                String(
                    productId
                ),

            name:
                item.name ||
                item.productName ||
                item.product?.name ||
                "CCTV Product",

            quantity:
                quantity,

            price:
                Number(
                    item.price ||
                    item.product?.price ||
                    0
                ),

            image:
                item.image ||
                item.productImage ||
                item.product?.image ||
                ""
        });
    }


    console.log(
        "PROTECH ORDER ITEMS:",
        orderItems
    );


    const orderButton =
        document.getElementById(
            "placeOrderBtn"
        ) ||
        document.querySelector(
            "#orderForm button[type='submit']"
        ) ||
        document.querySelector(
            "button[type='submit']"
        );


    const originalButtonText =
        orderButton?.textContent ||
        "Place Order & Proceed to Payment";


    if (orderButton) {

        orderButton.disabled =
            true;

        orderButton.textContent =
            "Placing Order...";
    }


    const createdOrders = [];


    let totalAmount = 0;


    try {

        for (
            let index = 0;
            index < orderItems.length;
            index++
        ) {

            const item =
                orderItems[index];


            if (orderButton) {

                if (
                    orderItems.length > 1
                ) {

                    orderButton.textContent =
                        `Placing Order ${index + 1} of ${orderItems.length}...`;

                } else {

                    orderButton.textContent =
                        "Placing Order...";
                }
            }


            const backendOrderData = {

                customer:
                    String(
                        customer._id
                    ),

                product:
                    String(
                        item.productId
                    ),

                quantity:
                    Number(
                        item.quantity
                    )
            };


            console.log(
                "PROTECH ORDER DATA:",
                backendOrderData
            );


            const response =
                await fetch(
                    `${API_BASE_URL}/orders`,
                    {
                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Accept":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                backendOrderData
                            )
                    }
                );


            console.log(
                "PROTECH ORDER HTTP STATUS:",
                response.status
            );


            const data =
                await readApiResponse(
                    response
                );


            console.log(
                "PROTECH ORDER RESPONSE:",
                data
            );


            if (!response.ok) {

                console.error(
                    "Order creation failed:",
                    data
                );


                alert(
                    data.message ||
                    data.error ||
                    "Unable to place the order. Please try again."
                );


                if (orderButton) {

                    orderButton.disabled =
                        false;

                    orderButton.textContent =
                        originalButtonText;
                }


                return;
            }


            const createdOrder =
                data.order ||
                data.createdOrder ||
                data.data ||
                {};


            const orderId =
                createdOrder._id ||
                createdOrder.orderId ||
                data.orderId ||
                data._id ||
                "";


            if (!orderId) {

                console.error(
                    "Backend did not return order ID:",
                    data
                );


                alert(
                    "Order was created, but the order ID was not returned by the server."
                );


                if (orderButton) {

                    orderButton.disabled =
                        false;

                    orderButton.textContent =
                        originalButtonText;
                }


                return;
            }


            let backendTotal =
                Number(
                    createdOrder.totalAmount ||
                    data.totalAmount ||
                    0
                );


            if (
                backendTotal <= 0
            ) {

                backendTotal =
                    Number(
                        item.price || 0
                    ) *
                    Number(
                        item.quantity || 1
                    );
            }


            totalAmount +=
                backendTotal;


            createdOrders.push({

                ...createdOrder,

                _id:
                    orderId,

                orderId:
                    orderId,

                productId:
                    item.productId,

                name:
                    item.name,

                quantity:
                    item.quantity,

                price:
                    item.price,

                image:
                    item.image,

                customerId:
                    customer._id,

                customerName:
                    fullName,

                phone:
                    phone,

                address:
                    address,

                notes:
                    notes
            });


            console.log(
                "PROTECH ORDER CREATED:",
                createdOrder
            );
        }


        if (
            createdOrders.length === 0
        ) {

            alert(
                "No order was created."
            );


            if (orderButton) {

                orderButton.disabled =
                    false;

                orderButton.textContent =
                    originalButtonText;
            }


            return;
        }


        const firstOrder =
            createdOrders[0];


        const firstOrderId =
            firstOrder.orderId ||
            firstOrder._id ||
            "";


        const paymentOrder = {

            orderId:
                firstOrderId,

            _id:
                firstOrderId,

            customerId:
                customer._id,

            customerName:
                fullName,

            email:
                customer.email ||
                "",

            phone:
                phone,

            address:
                address,

            notes:
                notes,

            items:
                createdOrders.map(
                    order => ({

                        orderId:
                            order.orderId ||
                            order._id ||
                            "",

                        productId:
                            order.productId ||
                            "",

                        name:
                            order.name ||
                            "CCTV Product",

                        quantity:
                            Number(
                                order.quantity ||
                                1
                            ),

                        price:
                            Number(
                                order.price ||
                                0
                            ),

                        totalAmount:
                            Number(
                                order.totalAmount ||
                                (
                                    Number(
                                        order.price ||
                                        0
                                    ) *
                                    Number(
                                        order.quantity ||
                                        1
                                    )
                                )
                            ),

                        image:
                            order.image ||
                            ""
                    })
                ),

            totalAmount:
                totalAmount,

            status:
                "Pending",

            paymentStatus:
                "Pending",

            service:
                "CCTV Product Order",

            createdAt:
                new Date().toISOString()
        };


        localStorage.setItem(
            "latestOrder",
            JSON.stringify(
                paymentOrder
            )
        );


        localStorage.setItem(
            "latestOrders",
            JSON.stringify(
                createdOrders
            )
        );


        console.log(
            "PROTECH FINAL ORDER:",
            paymentOrder
        );


        localStorage.removeItem(
            CART_STORAGE_KEY
        );


        updateCartCount();


        const paymentParams =
            new URLSearchParams();


        if (
            firstOrderId
        ) {

            paymentParams.set(
                "orderId",
                firstOrderId
            );
        }


        paymentParams.set(
            "amount",
            String(
                totalAmount
            )
        );


        paymentParams.set(
            "service",
            "CCTV Product Order"
        );


        const billId =
            firstOrder.billId ||
            "";


        if (
            billId
        ) {

            paymentParams.set(
                "billId",
                billId
            );
        }


        console.log(
            "PROTECH PAYMENT URL:",
            `Payment.html?${paymentParams.toString()}`
        );


        window.location.replace(
            `Payment.html?${paymentParams.toString()}`
        );


    } catch (error) {

        console.error(
            "PROTECH ORDER ERROR:",
            error
        );


        alert(
            "Unable to connect to the server while placing the order. Please make sure the backend is running."
        );


        if (orderButton) {

            orderButton.disabled =
                false;

            orderButton.textContent =
                originalButtonText;
        }
    }
}


/* =========================================================
   AUTHENTICATION CHECK ON BROWSER BACK/FORWARD
========================================================= */

function handlePageShowAuth() {

    const current =
        window.location.pathname
            .split("/")
            .pop() || "";


    if (
        current.startsWith("S_") &&
        current !== "S_Login.html" &&
        current !== "S_Registration.html"
    ) {

        const staff =
            getLoggedInStaff();


        if (
            !staff ||
            !staff._id
        ) {

            window.location.replace(
                "S_Login.html"
            );

            return;
        }
    }


    if (
        !current.startsWith("S_") &&
        current !== "Login.html" &&
        current !== "Registration.html" &&
        current !== "ForgotPassword.html" &&
        current !== "ResetPassword.html" &&
        current !== ""
    ) {

        const customer =
            getLoggedInCustomer();


        if (
            !customer ||
            !customer._id
        ) {

            window.location.replace(
                "Login.html"
            );
        }
    }
}


/* =========================================================
   PAGE INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /* ---------------------------------------------
           1. Authentication Guards
        --------------------------------------------- */

        requireCustomerAuth();

        requireStaffAuth();


        /* ---------------------------------------------
           2. Authentication Handlers
        --------------------------------------------- */

        setupCustomerAuth();


        /* ---------------------------------------------
           3. Header & UI
        --------------------------------------------- */

        setupDashboardHeader();


        /* ---------------------------------------------
           4. Cart Count
        --------------------------------------------- */

        updateCartCount();


        /* ---------------------------------------------
           5. CART REMOVE HANDLER
        --------------------------------------------- */

        setupCartRemoveHandler();


        /* ---------------------------------------------
           6. Order Page
        --------------------------------------------- */

        setupOrderPage();
    }
);


/* =========================================================
   HANDLE BROWSER BACK/FORWARD CACHE
========================================================= */

window.addEventListener(
    "pageshow",
    function () {

        handlePageShowAuth();
    }
);