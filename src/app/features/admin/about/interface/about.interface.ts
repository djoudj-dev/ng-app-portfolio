export interface Interest {
  id?: string;
  label: string;
  description: string;
  icon: string;
}

export interface About {
  id?: string;
  fullname: string;
  title: string;
  description: string;
  location: string;
  email: string;
  imageUrl: string;
  interests?: Interest[];
}
