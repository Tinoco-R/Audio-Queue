import { createHash } from 'crypto';

// Code challenge used for Soundcloud user authentication
export function createCodeChallenge(codeVerifier: string): string {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    
    // Convert to Uint8Array
    const uint8Array = new Uint8Array(data);
    
    // Create SHA256 hash
    const hashBuffer = createHash('sha256').update(uint8Array).digest();
    
    // Base64UrlEncode the hash
    const base64UrlEncoded = Buffer.from(hashBuffer).toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
        
    console.log("base64UrlEncoded: ", base64UrlEncoded);
    return base64UrlEncoded;
}

// Need to create a code verifier for the code challenge to be used in Soundcloud user authentication
export function generateCodeVerifier() {
    const length = 43;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    let codeVerifier = '';
    
    for (let i = 0; i < length; i++) {
        codeVerifier += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    console.log("Code Verifier: ", codeVerifier);
    return codeVerifier;
}

// Sets a value in local storage provided it doesn't exist yet
export function setValueIfNotExists(key: string, value: string): void {
    if (!localStorage.getItem(key)) {
        const stringValue = JSON.stringify(value).replace(/"/g, '');
        localStorage.setItem(key, stringValue);
    }
}