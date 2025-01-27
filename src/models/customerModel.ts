
/**
 * @interface Customer
 * @property {string} id - The unique identifier for the customer
 * @property {string} name - The name of the customer
 * @property {string} company - The company of the customer
 * @property {string} position - The position of the customer
 * @property {string} email - The email of the customer
 * @property {string} phoneNumber - The phone number of the customer
 * @property {string} address - The address of the customer
 * @property {Date} createdAt - The date and time when the customer was created
 * @property {Date} updatedAt - The date and time when the customer was last updated
 */
export interface Customer {
  id: string;
  name: string;
  company: string;
  position: string | null;
  email: string;
  phoneNumber: string;
  address: string | null;
}