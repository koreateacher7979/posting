
export interface LectureInfo {
  location: string;
  dateTime: string;
  target: string;
  topic: string;
  feedback: string;
}

export interface GeneratedPosts {
  instagram: {
    content: string;
    hashtags: string[];
  };
  naverBlog: {
    title: string;
    content: string;
  };
}
