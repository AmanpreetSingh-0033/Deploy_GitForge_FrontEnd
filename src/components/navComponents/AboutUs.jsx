import React from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Box,
  Divider,
  IconButton,
} from "@mui/material";
import {
  Email,
  Phone,
  GitHub,
  LinkedIn,
  Code,
  BugReport,
  Hub,
  PhoneIphone,
} from "@mui/icons-material";

import Navbar from "../Navbar.jsx";
import Footer from "../Footer.jsx";

import DeveloperImg from "../../assets/MyPicture_2.jpg";

import "./AboutUs.css";

const features = [
  {
    title: "Full Git Version Control",
    description:
      "Manage repositories, branches, and commits with a comprehensive and intuitive Git-based system.",
    icon: <Code />,
  },
  {
    title: "Advanced Issue Tracking",
    description:
      "Track and manage project issues with customizable labels, milestones, and assignees.",
    icon: <BugReport />,
  },
  {
    title: "Collaborative Pull Requests",
    description:
      "Work together with team members through pull requests and streamlined code reviews.",
    icon: <Hub />,
  },
  {
    title: "MVC Architecture",
    description:
      "Our project's codebase follows a robust Model-View-Controller architecture for scalability and maintainability.",
    icon: <Code />,
  },
  {
    title: "Mobile-Friendly Interface",
    description:
      "Access your repositories and projects from any device with a responsive, mobile-friendly interface.",
    icon: <PhoneIphone />,
  },
];

const AboutUs = () => {
  return (
    <>
      <div>
        <div>
          {" "}
          <Navbar />
          <div className="about-us-page">
            <Container maxWidth="lg" className="about-container">
              {/* Hero Section */}
              <Box className="hero-section" textAlign="center" mb={6}>
                <Typography
                  variant="h2"
                  component="h1"
                  className="page-title"
                  gutterBottom
                >
                  About GitForge
                </Typography>
                <Typography
                  variant="h6"
                  className="page-subtitle"
                  color="textSecondary"
                >
                  A powerful Git-based version control platform designed for
                  developers
                </Typography>
              </Box>

              {/* Project Overview */}
              <Card className="about-card" elevation={3}>
                <CardContent>
                  <Typography
                    variant="h5"
                    className="section-title"
                    gutterBottom
                  >
                    About the Project
                  </Typography>
                  <Divider className="divider" />
                  <Typography variant="body1" paragraph>
                    GitForge is a full-stack web application that provides Git
                    version control functionality with a user-friendly
                    interface. Built using the MERN stack (MongoDB, Express,
                    React, Node.js), it offers features like repository
                    management, issue tracking, and team collaboration tools.
                  </Typography>
                  <Typography variant="body1" paragraph>
                    This project was developed as part of my journey in becoming
                    a full-stack developer, combining modern web technologies to
                    create a robust and scalable platform for developers.
                  </Typography>
                </CardContent>
              </Card>

              {/* Key Features Section */}
              <Box mt={6} mb={6}>
                <Typography
                  variant="h4"
                  className="section-title"
                  align="center"
                  gutterBottom
                >
                  Key Features
                </Typography>
                <Grid
                  container
                  spacing={4}
                  justifyContent="center"
                  alignItems="stretch"
                >
                  {features.map((feature, index) => (
                    <Grid item xs={12} sm={6} md={6} lg={4} key={index}>
                      <Card className="feature-card" elevation={3}>
                        <CardContent className="feature-content">
                          <Box className="feature-icon-container">
                            {feature.icon}
                          </Box>
                          <Typography
                            variant="h6"
                            className="feature-title"
                            gutterBottom
                          >
                            {feature.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            className="feature-description"
                          >
                            {feature.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* Developer Info */}
              <Box mt={6} mb={6}>
                <Typography
                  variant="h4"
                  className="section-title"
                  align="center"
                  gutterBottom
                >
                  The Developer
                </Typography>
                <Grid container justifyContent="center">
                  <Grid item xs={12} md={8} lg={6}>
                    <Card className="developer-card" elevation={3}>
                      <CardContent className="developer-content">
                        <Box className="developer-avatar-container">
                          <Avatar
                            src={DeveloperImg}
                            alt="Amanpreet Singh"
                            className="developer-avatar"
                            sx={{
                              width: 150,
                              height: 150,
                              border: "3px solid #e0e1dd",
                            }}
                          />
                        </Box>
                        <Typography
                          variant="h5"
                          component="h2"
                          className="developer-name"
                          gutterBottom
                        >
                          Amanpreet Singh
                        </Typography>

                        <Box className="contact-info">
                          <Box className="contact-item">
                            <Email className="contact-icon" />
                            <Typography variant="body1">
                              amanpreetsingh8427126108@gmail.com
                            </Typography>
                          </Box>
                          <Box className="contact-item">
                            <Phone className="contact-icon" />
                            <Typography variant="body1">
                              +91 8427126108
                            </Typography>
                          </Box>
                        </Box>

                        <Box className="social-links">
                          <IconButton
                            href="https://github.com/AmanpreetSingh-0033"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-icon"
                          >
                            <GitHub />
                          </IconButton>
                          <IconButton
                            href="https://www.linkedin.com/in/amanpreetsingh0033"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-icon"
                          >
                            <LinkedIn />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </Container>
          </div>
        </div>
        <div>
          <Footer></Footer>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
