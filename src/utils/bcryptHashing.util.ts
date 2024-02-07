import bcrypt from 'bcrypt';
import { Buffer } from 'buffer';

// Function to hash the password and encode it in Base64
export async function hashPasswordAndEncode(emailId: string, password: string): Promise<string> {
  const saltRounds = 10; // You can adjust the salt rounds as needed

  try {
    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(emailId+":"+password, salt);

    // Convert the hashed password to Base64
    const base64EncodedPassword = Buffer.from(hashedPassword).toString('base64');

    return base64EncodedPassword;
  } catch (error) {
    throw error; // Rethrow or handle the error appropriately
  }
}

// Example usage
const emailId = 'user@example.com';
const password = 'SecureP@ssw0rd!';

hashPasswordAndEncode(emailId, password)
  .then(encodedPassword => {
    console.log('Encoded Password:', encodedPassword);
    // Proceed to save the emailId and encodedPassword to your database
  })
  .catch(error => {
    console.error(error);
  });
