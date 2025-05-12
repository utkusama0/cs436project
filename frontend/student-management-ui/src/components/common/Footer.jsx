import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-3 mt-5">
      <Container className="text-center">
        <p className="mb-0">Student Management System &copy; {new Date().getFullYear()}</p>
      </Container>
    </footer>
  );
};

export default Footer;
