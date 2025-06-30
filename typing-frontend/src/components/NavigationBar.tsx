import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import { AuthContext } from '../store/AuthContext';

function NavigationBar() {

  const {t, i18n} = useTranslation();
  const {setRole, loggedIn, setLoggedIn} = useContext(AuthContext);
  const navigate = useNavigate();

  const setLanguage = (newLang: string) => {
    i18n.changeLanguage(newLang);
    localStorage.setItem("language", newLang);
  }

  const logout = () => {
    setRole("");
    setLoggedIn(false);
    sessionStorage.removeItem("token");
    navigate("/");
  }

  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand as={Link} to="/">Typing Project</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            {/* {loggedIn === true && (role === "ADMIN" || role === "SUPERADMIN") &&  <Nav.Link as={Link} to="/admin">Admin</Nav.Link>} */}
            {/* {loggedIn === true && role === "SUPERADMIN" &&  <Nav.Link as={Link} to="/superadmin/persons">Persons</Nav.Link>} */}
            {loggedIn === true &&
            <>
              <Nav.Link as={Link} to="/">{t("nav.typing")}</Nav.Link>
              <Nav.Link as={Link} to="/lesson-text">{t("nav.lesson-text")}</Nav.Link>
              <Nav.Link as={Link} to="/prev-lessons">{t("nav.prev-lessons")}</Nav.Link>
             </>}
          </Nav>
          <Nav>
            {loggedIn === true ? 
              <>
              <Nav.Link onClick={logout}>{t("nav.logout")}</Nav.Link>
              <Nav.Link as={Link} to="/preference/">{t("nav.preference")}</Nav.Link>
              </> :
              <>
              <Nav.Link as={Link} to="/login">{t("nav.login")}</Nav.Link>
              <Nav.Link as={Link} to="/signup">{t("nav.signup")}</Nav.Link>
              </>
            }
            <img className='icon lang' src="/english.png" onClick={() => setLanguage("en")} alt="United Kingdom flag icon" />
            <img className='icon lang' src="/estonian.png" onClick={() => setLanguage("et")} alt="Estonian flag icon" />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;