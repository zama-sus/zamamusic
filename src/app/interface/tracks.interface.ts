export interface Track {
  id?: any;
  createdAt: string;
  createdBy: string;
  description: string;
  title: string;
  username: string;
  likes: Array<null>;
  track: {
   name: string,
   path: string,
   url: string
  };
  trackImage: {
    name: string,
    path: string,
    url: string
   };
  
}