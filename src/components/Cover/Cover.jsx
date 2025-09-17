import './Cover.css'
import coverImage from '../../assets/images/cover.png';
import logo from '../../assets/images/logo.png';
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Cover = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

 

  return (
    <div className="cover">
      <img className="cover-image" src={coverImage} alt="Cover" />
      <img className="cover-logo" src={logo} alt="Logo" />
      <button className="order-button" onClick={() => navigate("/order")}>{t("order-button")}</button>
    </div>
  )
}

export default Cover
