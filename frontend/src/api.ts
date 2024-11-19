import axios, { AxiosResponse } from "axios";

export interface ResultData {
  username: string;
  nbWords: number;
  nbMistakes: number;
  timer: number;
}

export const apiFetchWords = async (nbWords: number): Promise<string[]> => {
  try {
    const response: AxiosResponse<{ randomWords: string[] }> = await axios.get("http://localhost:8080/api/words");
    const res = response.data.randomWords.slice(0, nbWords);
    return res;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const apiSendResult = async (resultData: ResultData): Promise<void> => {
  try {
    await axios.post("http://localhost:8080/api/results", { params: resultData });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(error.response.data.error);
    } else {
      console.error("Unexpected while sending results error:", error);
    }
  }
};

export const apiFetchResults = async (): Promise<ResultData[]> => {
  try {
    const response = await axios.get("http://localhost:8080/api/results");
    return response.data.map(({ username, nbWords, nbMistakes, timer }: ResultData) => ({
      username,
      nbWords,
      nbMistakes,
      timer,
    }));
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(error.response.data.error);
    } else {
      console.error("Unexpected while getting results error:", error);
    }
    return [];
  }
};
