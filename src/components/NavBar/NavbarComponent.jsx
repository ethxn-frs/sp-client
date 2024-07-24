import Nav from 'react-bootstrap/Nav';
import './NavbarComponent.css'
import { LinkContainer } from 'react-router-bootstrap';

function Navbar() {
  return (
    <div className='nav-content'>
      <Nav className="nav-bar" >
      <Nav.Item>
          <LinkContainer to="/home">
            <Nav.Link>HOME</Nav.Link>
          </LinkContainer>
        </Nav.Item>
        <Nav.Item>
          <LinkContainer to="/contact">
            <Nav.Link>NOUS CONTACTER</Nav.Link>
          </LinkContainer>
        </Nav.Item>
        <Nav.Item>
          <LinkContainer to="/login">
            <Nav.Link>CONNEXION</Nav.Link>
          </LinkContainer>
        </Nav.Item>
      </Nav>
    </div>
    
  );
}

export default Navbar;