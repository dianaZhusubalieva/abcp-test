// Мы ожидаем, что Вы исправите синтаксические ошибки, сделаете перехват возможных исключений и улучшите читаемость кода.
// А так же, напишите кастомный хук useThrottle и используете его там где это нужно.
// Желательно использование React.memo и React.useCallback там где это имеет смысл.
// Будет большим плюсом, если Вы сможете закэшировать получение случайного пользователя.
// Укажите правильные типы.
// По возможности пришлите Ваш вариант в https://codesandbox.io

import React, { useCallback, useState } from "react";
import { User } from "./types";
import { getNativeErrorMessage } from "../../utils/http";
import { Button } from "../../components/Button";
import { UserInfo } from "./components/UserInfo";
import useRandomUserService from "./service/useRandomUserService";
import { getRandomNum } from "../../utils/common";

function RandomUserPage() {
  const { awaiting, get } = useRandomUserService();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>();

  const receiveRandomUser = useCallback(async () => {
    setError(null);
    try {
      const randomUserId = getRandomNum();
      const loadedUser = await get(randomUserId);
      setCurrentUser(loadedUser);
    } catch (e) {
      setError(getNativeErrorMessage(e));
    }
  }, [get]);

  const handleButtonClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.stopPropagation();
      receiveRandomUser();
    },
    [receiveRandomUser],
  );

  return (
    <div>
      <header>Get a random user</header>
      <Button onClick={handleButtonClick}>get</Button>
      {error && <div>{error}</div>}
      {awaiting && <div>loading...</div>}
      {!error && !awaiting && <UserInfo user={currentUser} />}
    </div>
  );
}

export default RandomUserPage;
