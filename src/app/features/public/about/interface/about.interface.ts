export interface Interest {
  label: string;
  description: string;
  icon: string;
}

export interface About {
  fullname: string;
  title: string;
  description: string;
  location: string;
  email: string;
  imageUrl: string;
  interests: Interest[];
}
