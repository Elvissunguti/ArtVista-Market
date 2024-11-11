const jwt = require("jsonwebtoken");

// Store invalidated tokens
const invalidTokens = new Set();

// Generate token
exports.getToken = async (email, user) => {
    const token = jwt.sign(
        { identifier: user._id }, // Store user ID in token
        "SECRETKEY",
        { expiresIn: "80d" } // Token expiration time
    );
    return token;
}

// Verify a JWT token
exports.verifyToken = (token) => {
    try {
        const decodedToken = jwt.verify(token, "SECRETKEY");
        return decodedToken; // Return the decoded token if valid
    } catch (error) {
        return null; // Invalid token
    }
}

// Invalidate a JWT token
exports.invalidateToken = (token) => {
    invalidTokens.add(token); // Add token to invalidated set
}

// Check if a token is invalid
exports.isTokenInvalid = (token) => {
    return invalidTokens.has(token); // Check if token is in invalid set
}
