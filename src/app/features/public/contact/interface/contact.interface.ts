export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactFormResponse {
  success: boolean;
  message: string;
  status?: number;
  error?: string;
}

export interface ContactCard {
  id: string;
  title: string;
  icon: string;
  content: string;
  link?: string;
}

export interface ContactCardGroup {
  id: string;
  title: string;
  items: ContactCard[];
}
