import "../styles/App.css";
import "../styles/Navigation.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/ArmoryPage.css";

import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { navRoutes } from "../constants";
import { useMobile } from "../hooks/useMobile";
import hdlogo from "../assets/logos/hdlogo.svg";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isMobile } = useMobile();
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => setShowMenu((prev) => !prev);

  const handleNavClick = (route) => {
    navigate(`/${route}`);
    setShowMenu(false);
  };

  const mainRoutes = navRoutes.slice(0, 3);
  const otherRoutes = navRoutes.slice(3);

  return (
    <div className="nav-container">
      {isMobile && (
        <>
          <div className="hd-logo hd-logo-mobile" onClick={toggleMenu}>
            <img src={hdlogo} alt="Logo" />
          </div>

          <AnimatePresence>
            {showMenu && (
              <motion.div
                className="mobile-menu-backdrop"
                onClick={() => setShowMenu(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.14 }}>

                <motion.div
                  className="mobile-menu-overlay"
                  initial={{ y: "-100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-100%" }}
                  transition={{ duration: 0.1, ease: "easeInOut" }}
                  onClick={(e) => e.stopPropagation()}>

                  <motion.div
                    className="mobile-menu-content"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden">

                    <motion.div
                      className="nav-section-wrapper"
                      variants={containerVariants}>
                      {mainRoutes.map((navRoute) => (
                        <motion.div
                          key={navRoute.route}
                          className="mobile-menu-btn text-medium"
                          variants={itemVariants}
                          onClick={() => handleNavClick(navRoute.route)}>
                          {navRoute.name}
                        </motion.div>
                      ))}
                    </motion.div>

                    <motion.div
                      className="nav-section-divider"
                      variants={containerVariants}></motion.div>

                    <motion.div
                      className="nav-section-wrapper"
                      variants={containerVariants}>
                      {otherRoutes.map((navRoute) => (
                        <motion.div
                          key={navRoute.route}
                          className="mobile-menu-btn text-medium"
                          variants={itemVariants}
                          onClick={() => handleNavClick(navRoute.route)}>
                          {navRoute.name}
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {!isMobile && (
        <>
          <div className="logos-wrapper">
            <div className="app-logo" onClick={() => navigate("/")}>
              HELLDIVE.LIVE
            </div>
            <div className="hd-logo" onClick={() => navigate("/")}>
              <img src={hdlogo} alt="" />
            </div>
          </div>
          <div className="menu">
            {navRoutes.map((navRoute) => (
              <Link
                key={navRoute.route}
                to={`/${navRoute.route}`}
                className={
                  location.pathname.includes(navRoute.route) ? "menu-active" : ""
                }
              >
                <span className="custom-font">{navRoute.name}</span>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Navigation;
