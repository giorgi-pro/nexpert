import crypto from "node:crypto";
import bcrypt from "bcryptjs";

export const encryptString = (input: string, key: string): string => {
    const algorithm = 'aes-256-cbc';
    const keyBuffer = Buffer.from(key, 'hex');
    const iv = crypto.randomBytes(16);
    
    const cipher = crypto.createCipheriv(algorithm, keyBuffer, iv);
    let encrypted = cipher.update(input, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Return IV + encrypted password
    return `${iv.toString('hex')}:${encrypted}`;
};

export const hashString = async (input: string, saltRounds: number): Promise<string> => {
	return bcrypt.hash(input, saltRounds);
};
