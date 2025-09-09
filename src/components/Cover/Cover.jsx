import './Cover.css'
import coverImage from '../../assets/images/cover.webp';
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Cover = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

 

  return (
    <div className="cover">
      <img className="cover-image" src={coverImage} alt="Cover" />
      <button className="order-button" onClick={() => navigate("/order")}>{t("order-button")}</button>
    </div>
  )
}

export default Cover
