import { User } from "../types";

interface IUserInfoProps {
  user: User | null;
}
export const UserInfo = ({ user }: IUserInfoProps) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Username</th>
          <th>Phone number</th>
        </tr>
      </thead>
      {user && (
        <tbody>
          <tr>
            <td>{user.name}</td>
            <td>{user.phone}</td>
          </tr>
        </tbody>
      )}
    </table>
  );
};
