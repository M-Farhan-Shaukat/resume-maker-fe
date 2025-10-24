import { Sidebar } from "../shared";

export default function Privatelayout({ children }) {
  return (
    <>
      <div className="layout__container">
        <div className="layout__wrapper d-flex">
          <div className="layout__sidebar-wrapper">
            <Sidebar className="layout__sidebar" />
          </div>

          <div className="layout__right-section">
            {/* <PrivateHeader className="layout__header" /> */}
            <div className="layout__content">{children}</div>
          </div>
        </div>
      </div>
      {/* <div className="layout__container--fluid">
        <Footer className="layout__footer" />
      </div> */}
    </>
  );
}
