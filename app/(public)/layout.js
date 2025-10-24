import { PublicHeader } from "../shared";

export default function Privatelayout({ children }) {
  return (
    <div className="signin-container">
      <PublicHeader />
      {children}
    </div>
  );
}
