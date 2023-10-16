import {backendUrl} from "./Config";

export const makeUnauthenticatedPOSTRequest = async (route, body) => {
    const response = await fetch(backendUrl + route, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
    const formattedResponse = await response.json();
    return formattedResponse;
};

export const makeAuthenticatedPOSTRequest = async (route, body) => {
    const token = getToken();
    const response = await fetch(backendUrl + route, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    });
    const formattedResponse = await response.json();
    return formattedResponse;
};

export const makeAuthenticatedMulterPostRequest = async (route, formData) => {
    try {
        const token = getToken();
        const response = await fetch(backendUrl + route, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });
        
        if (!response.ok) {
            throw new Error(`Request failed with status: ${response.status}`);
        }

        const formattedResponse = await response.json();
        return formattedResponse;
    } catch (error) {
        console.error("Request error:", error);
        const responseText = await error.text(); // Capture the error response text
        console.log("Response text:", responseText); // Log the error response
        return { error: "Request failed" };
    }
};


export const makeAuthenticatedGETRequest = async (route) => {
    const token = getToken();
    const response = await fetch(backendUrl + route, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        
    });
    const formattedResponse = await response.json();
    return formattedResponse;
};

export const makeAuthenticatedPUTRequest = async (route, body) => {
    const token = getToken();
    const response = await fetch(backendUrl + route, {
        method : "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body)
    });
    const formattedResponse = await response.json();
    return formattedResponse;
};

export const makeAuthenticatedDELETERequest = async (route) => {
    const token = getToken();
    try {
        const response = await fetch(backendUrl + route, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Request failed with status: ${response.status}`);
        }

        return { message: "DELETE request successful" };
    } catch (error) {
        console.error("Request error:", error);
        const responseText = await error.text(); 
        console.log("Response text:", responseText);
        return { error: "Request failed" };
    }
};


const getToken = () => {
    const accessToken = document.cookie.replace(
        /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
        "$1"
    );
    return accessToken;
};