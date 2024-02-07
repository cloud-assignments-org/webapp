/**
 * The Email type is used to signal to developers that the function expects an email-formatted string, but the actual validation logic still relies on JavaScript runtime checks, such as regex testing, to enforce the email pattern.
 * @pattern /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
 */
 export type EmailT = string;
