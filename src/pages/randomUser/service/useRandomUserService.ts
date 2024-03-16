import { useState } from "react";
import { User } from "../types";
import { isFailResponse } from "../../../utils/http";

const URL = "https://jsonplaceholder.typicode.com/users";

const useRandomUserService = () => {
  const [awaiting, setAwaiting] = useState<boolean>(false);

  const get = async (randomId: number): Promise<User> => {
    setAwaiting(true);
    try {
      const response = await fetch(`${URL}/${randomId}`);
      if (!isFailResponse(response)) {
        const user = (await response.json()) as User;
        return Promise.resolve(user);
      }
      return Promise.reject();
    } catch (e) {
      return Promise.reject();
    } finally {
      setAwaiting(false);
    }
  };

  return { awaiting, get };
};

export default useRandomUserService;
