import type Text from "../components/Content/Article/Text.svelte";
import type { IArticleNodes } from "./IArticleNodes";

export interface IArticlePage {
  left: number;
  component: Text | null;
  leadArticleNodes: IArticleNodes | null;
  bodyArticleNodes: IArticleNodes | null;
  showMore: boolean;
  primaryColor: string;
}