export type Memory = {
  id: number;
  title: string;
  description: string;
  image?: string | null;
  date: string;
  createdAt: string;
};

type ImagePayload =
  | string
  | {
      uri: string;
      type?: string;
      fileName?: string;
    };

export type SuggestReq = {
  title: string;
  date: string;
  image: ImagePayload;
};

export type SuggestRes = {
  suggestedDescription: string;
};
