import { useTranslation } from "react-i18next";
import { Link, Outlet } from "react-router-dom"

function LessonTextChoice() {

  const {t} = useTranslation();

  return (
    <div>
      
      <div>
        <Link style={{
          border: "1px solid black",
          borderRadius: "10px",
          margin: "5%",
          fontSize: "LARGE",
          color: "black"
          }} to="/lesson-text">{t("nav.choosebook")}</Link>
        <Link style={{
          border: "1px solid black",
          borderRadius: "10px",
          margin: "5%",
          fontSize: "LARGE",
          color: "black"
          }} to="/lesson-text/custom-text">{t("nav.enteryourtext")}</Link>
      </div>
      <Outlet />

    </div>
  )
}

export default LessonTextChoice