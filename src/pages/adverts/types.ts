export type Tags = string[];

export interface Advert {
  id: string;
  name: string;
  sale: boolean;
  price: number;
  tags: Tags;
  photo: string | null;
}

export type CreateAdvertDto = Pick<
  Advert,
  "name" | "sale" | "price" | "tags"
> & {
  photo?: File;
};
