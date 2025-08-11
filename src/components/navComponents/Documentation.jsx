import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";
import "./Documentation.css";
import {
  FiChevronRight,
  FiTerminal,
  FiGitBranch,
  FiUpload,
  FiDownload,
  FiClock,
  FiCode,
  FiUsers,
  FiLock,
  FiAlertCircle,
} from "react-icons/fi";

const Documentation = () => {
  const [activeSection, setActiveSection] = useState("introduction");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(sectionId);
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    }
  };

  const sections = [
    { id: "introduction", title: "Introduction" },
    { id: "getting-started", title: "Getting Started" },
    { id: "commands", title: "Command Reference" },
    { id: "workflow", title: "Workflow Examples" },
    { id: "troubleshooting", title: "Troubleshooting" },
  ];

  const commands = [
    {
      name: "init",
      description: "Initialize a new GitForge repository",
      usage: "node index.js init",
      details: "Creates a new .gitforge directory with initial structure",
      example: "node index.js init",
    },
    {
      name: "add",
      description: "Stage files for commit",
      usage: "node index.js add <file>",
      details: "Adds the specified file to the staging area",
      example: "node index.js add index.html",
    },
    {
      name: "commit",
      description: "Record changes to the repository",
      usage: 'node index.js commit "commit message"',
      details: "Creates a new commit with the staged files",
      example: 'node index.js commit "Initial commit"',
    },
    {
      name: "push",
      description: "Upload local commits to remote",
      usage: "node index.js push",
      details: "Pushes committed changes to the remote repository",
      example: "node index.js push",
    },
    {
      name: "pull",
      description: "Fetch from and integrate with remote repository",
      usage: "node index.js pull",
      details: "Downloads and merges changes from the remote repository",
      example: "node index.js pull",
    },
    {
      name: "revert",
      description: "Revert to a previous commit",
      usage: "node index.js revert <commit-id> [--subfolder]",
      details: "Reverts the working directory to match a specific commit",
      example: "node index.js revert abc123",
    },
  ];

  const workflowExamples = [
    {
      title: "Create and Initialize a New Repository",
      steps: [
        "Create a new directory: `mkdir my-project`",
        "Navigate into the directory: `cd my-project`",
        "Initialize the repository: `node index.js init`",
      ],
    },
    {
      title: "Make and Commit Changes",
      steps: [
        "Create or modify files in your project",
        "Stage the changes: `node index.js add filename`",
        'Commit the changes: `node index.js commit "Your commit message"`',
      ],
    },
  ];

  const troubleshooting = [
    {
      issue: "Command not found",
      solution:
        "Make sure you are in the correct directory and have installed all dependencies with `npm install`",
    },
    {
      issue: "Permission denied",
      solution:
        "You might need to run the command with sudo or check your file permissions",
    },
    {
      issue: "Repository not found",
      solution:
        "Ensure the repository exists and you have the correct permissions to access it",
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section.id);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <div>
        <div className="documentation-container">
          <Navbar />

          <div className="doc-layout">
            {/* Sidebar Navigation */}
            <div
              className={`doc-sidebar ${isMobileMenuOpen ? "mobile-open" : ""}`}
            >
              <div className="sidebar-header">
                <h3>Documentation</h3>
                <button
                  className="mobile-close-btn"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  &times;
                </button>
              </div>
              <nav>
                <ul>
                  {sections.map((section) => (
                    <li
                      key={section.id}
                      className={activeSection === section.id ? "active" : ""}
                      onClick={() => scrollToSection(section.id)}
                    >
                      <FiChevronRight className="nav-icon" />
                      {section.title}
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              ☰ Menu
            </button>

            {/* Main Content */}
            <main className="doc-content">
              <section id="introduction" className="doc-section">
                <h1>GitForge Documentation</h1>
                <p className="lead">
                  A Git-like version control system with a user-friendly
                  interface for managing your projects.
                </p>
                <div className="feature-grid">
                  <div className="feature-card">
                    <FiGitBranch className="feature-icon" />
                    <h3>Version Control</h3>
                    <p>Track changes and collaborate with your team</p>
                  </div>
                  <div className="feature-card">
                    <FiUpload className="feature-icon" />
                    <h3>Cloud Sync</h3>
                    <p>Push and pull changes from anywhere</p>
                  </div>
                  <div className="feature-card">
                    <FiLock className="feature-icon" />
                    <h3>Secure</h3>
                    <p>Built with security in mind</p>
                  </div>
                </div>
              </section>

              <section id="getting-started" className="doc-section">
                <h2>Getting Started</h2>
                <div className="card">
                  <h3>Installation</h3>
                  <pre className="code-block">
                    <code>
                      # Navigate to the project directory
                      <br />
                      cd backend and frontend
                      <br />
                      <br />
                      # Install dependencies
                      <br />
                      npm install
                      <br />
                      <br />
                      # Set up environment variables
                      <br />
                      cp .env.example .env
                    </code>
                  </pre>
                  <h4>Environment Variables</h4>
                  <p>Configure your .env file with the following variables:</p>
                  <pre className="code-block">
                    <code>
                      MONGODB_URI=your_mongodb_uri
                      <br />
                      JWT_SECRET=your_jwt_secret
                      <br />
                      S3_BUCKET=your_s3_bucket_name
                      <br />
                      AWS_ACCESS_KEY_ID=your_aws_access_key
                      <br />
                      AWS_SECRET_ACCESS_KEY=your_aws_secret_key
                    </code>
                  </pre>
                </div>
              </section>

              <section id="commands" className="doc-section">
                <h2>Command Reference</h2>
                <p>
                  GitForge provides several commands to manage your
                  repositories:
                </p>

                <div className="commands-grid">
                  {commands.map((cmd, index) => (
                    <div key={index} className="command-card">
                      <h3 className="command-name">
                        <FiTerminal className="command-icon" />
                        {cmd.name}
                      </h3>
                      <p className="command-description">{cmd.description}</p>
                      <div className="command-usage">
                        <strong>Usage:</strong>
                        <code>{cmd.usage}</code>
                      </div>
                      <div className="command-details">
                        <strong>Details:</strong> {cmd.details}
                      </div>
                      <div className="command-example">
                        <strong>Example:</strong>
                        <code>{cmd.example}</code>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section id="workflow" className="doc-section">
                <h2>Workflow Examples</h2>
                <div className="workflow-container">
                  {workflowExamples.map((workflow, index) => (
                    <div key={index} className="workflow-card">
                      <h3>{workflow.title}</h3>
                      <ol>
                        {workflow.steps.map((step, i) => (
                          <li
                            key={i}
                            dangerouslySetInnerHTML={{
                              __html: step.replace(
                                /`(.*?)`/g,
                                "<code>$1</code>"
                              ),
                            }}
                          />
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>
              </section>

              <section id="troubleshooting" className="doc-section">
                <h2>Troubleshooting</h2>
                <div className="troubleshooting-grid">
                  {troubleshooting.map((item, index) => (
                    <div key={index} className="troubleshooting-card">
                      <FiAlertCircle className="troubleshoot-icon" />
                      <div>
                        <h4>{item.issue}</h4>
                        <p>{item.solution}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>
      <div>
        <Footer style={{ zIndex: 999 }}></Footer>
      </div>
    </div>
  );
};

export default Documentation;
