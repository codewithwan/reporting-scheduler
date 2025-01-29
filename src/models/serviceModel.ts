/**
 * @interface Service
 * @property {string} id
 * @property {string} name
 */

export interface Service {
    id: string;
    name: string;
}

export interface CreateServiceInput {
    name: string;
  }