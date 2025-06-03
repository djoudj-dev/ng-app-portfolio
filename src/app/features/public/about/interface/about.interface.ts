export interface Interest {
  id?: string;
  label: string;
  description: string;
  icon?: string;
}

export interface About {
  fullname: string;
  title: string;
  description: string;
  location: string;
  email: string;
  imageUrl: string;
  interests: Interest[];
  socialLinks: SocialLink[];
}

export interface SocialLink {
  label: string;
  href: string;
  icon: string;
}
