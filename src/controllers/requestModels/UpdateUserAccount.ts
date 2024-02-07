export class UpdateUserAccount {
    password?: string;
    firstName?: string;
    lastName?: string;

    // Method to check if at least one property is provided
    isValid(): boolean {
        return Object.values(this).some(value => value !== undefined);
    }    
}
